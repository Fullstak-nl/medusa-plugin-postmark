import { humanizeAmount, zeroDecimalCurrencies } from "medusa-core-utils"
import { DateTime } from "luxon";
import { NotificationService } from "medusa-interfaces";
import { EntityManager, IsNull, Not, LessThan } from "typeorm";
import * as postmark from "postmark"

class PostmarkService extends NotificationService {
  static identifier = "postmark";
  manager_ = null;
  orderRepository_ = null;

  /**
   * @param {Object} options - options defined in `medusa-config.js`
   */
  constructor(
    {
      manager,
      orderRepository,
      orderService,
      cartService,
      fulfillmentService,
      totalsService,
    },
    options
  ) {
    super({manager,orderRepository})

    this.options_ = options


    this.manager_ = manager;
    this.orderRepository_ = orderRepository;
    this.orderService_ = orderService
    this.cartService_ = cartService
    this.fulfillmentService_ = fulfillmentService
    this.totalsService_ = totalsService

    this.client_ = new postmark.ServerClient(options.server_api)
  }

  async remindUpsellOrders() {
    //console.log(this.options_)
    if(!this.options_?.upsell || !this.options_?.upsell?.enabled || !this.options_?.upsell?.collection || !this.options_?.upsell?.delay || !this.options_?.upsell?.template)
        return []
    const orderRepo = this.manager_.withRepository(this.orderRepository_);
    const options = this.options_.upsell;
    const validThrough = DateTime.now().minus({ days: options.valid }).toLocaleString(DateTime.DATE_FULL)
    const orders = await orderRepo.findBy({
      created_at: LessThan(new Date(new Date().getTime() - parseInt(options.delay) * 60 * 60 * 24 * 1000)),
    })

    for (const order of orders) {
      if(order.metadata?.upsell_sent)
        continue
      const orderData = await this.orderService_.retrieve(order.id, {
        select: ["id"],
        relations: [
          "customer","items","items.variant","items.variant.product"
        ],
      })
      let upsell = true
      for (const item of orderData.items) {
          if(item?.variant?.product?.collection_id !== options.collection)
              upsell = false
      }
      if(upsell){
        if (options.template.includes(",")) {
            // VERY simple setup for A/B testing
            options.template = options.template.split(",")
            options.template = options.template[Math.floor(Math.random() * options.template.length)]
        }
        const sendOptions = {
          From: this.options_.from,
          to: orderData.customer.email,
          TemplateId: options.template,
          TemplateModel: {
            ...orderData,
            ...this.options_.default_data,
            valid_through: validThrough
          }
        }

        //update order metadata
        order.metadata = {
            ...order.metadata,
            upsell_sent: true
        }
        //console.log("Sending upsell email to " + orderData.customer.email + " for order " + orderData.id)
        await this.client_.sendEmailWithTemplate(sendOptions)
            .then(async () => {
              await this.orderService_.update(order.id, {metadata: order.metadata})
            })
            .catch((error) => {
              console.error(error)
              return { to: sendOptions.to, status: 'failed', data: sendOptions }
            })
      }
    }
  }

  async fetchAttachments(event, data, attachmentGenerator) {
    let attachments = []
    switch (event) {
      case "user.password_reset": {
        try{
            if (attachmentGenerator && attachmentGenerator.createPasswordReset) {
                const base64 = await attachmentGenerator.createPasswordReset()
                attachments.push({
                  name: "password-reset",
                  base64,
                  type: "application/pdf",
                })
            }
        } catch (err) {
          console.error(err)
        }
        return attachments
      }
      case "swap.created":
      case "order.return_requested": {
        try {
          const {shipping_method, shipping_data} = data.return_request
          if (shipping_method) {
            const provider = shipping_method.shipping_option.provider_id

            const lbl = await this.fulfillmentProviderService_.retrieveDocuments(
                provider,
                shipping_data,
                "label"
            )

            attachments = attachments.concat(
                lbl.map((d) => ({
                  name: "return-label",
                  base64: d.base_64,
                  type: d.type,
                }))
            )
          }
        } catch (err) {
            console.error(err)
        }

        try{
          if (attachmentGenerator && attachmentGenerator.createReturnInvoice) {
            const base64 = await attachmentGenerator.createReturnInvoice(
                data.order,
                data.return_request.items
            )
            attachments.push({
              name: "invoice",
              base64,
              type: "application/pdf",
            })
          }
        } catch (err) {
            console.error(err)
        }
        return attachments
      }
      case "order.placed": {

        try{
          if ((this.options_?.pdf?.enabled??false) && attachmentGenerator && attachmentGenerator.createInvoice) {
            const base64 = await attachmentGenerator.createInvoice(
                this.options_,
                data
            )
            attachments.push({
              name: "invoice",
              base64,
              type: "application/pdf",
            })
          }
        } catch (err) {

          console.log('error ?',err)
          console.error(err)
        }
        return attachments
      }
      default:
        return []
    }
  }

  async fetchData(event, eventData, attachmentGenerator) {
    switch (event) {
      case "order.placed":
        return this.orderPlacedData(eventData, attachmentGenerator)
      case "order.shipment_created":
        return this.orderShipmentCreatedData(eventData, attachmentGenerator)
      case "order.canceled":
        return this.orderCanceledData(eventData, attachmentGenerator)
      case "user.password_reset":
        return this.userPasswordResetData(eventData, attachmentGenerator)
      case "customer.password_reset":
        return this.customerPasswordResetData(eventData, attachmentGenerator)
      default:
        return {}
    }
  }

  async sendNotification(event, eventData, attachmentGenerator) {
    let group = undefined;
    let action = undefined;
    try {
      const event_ = event.split(".",2)
      group = event_[0]
      action = event_[1]
      if(typeof group === "undefined" || typeof action === "undefined" || this.options_.events[group] === undefined || this.options_.events[group][action] === undefined)
        return false
    } catch (err) {
      console.error(err)
      return false
    }

    let templateId = this.options_.events[group][action]
    const data = await this.fetchData(event, eventData, attachmentGenerator)
    const attachments = await this.fetchAttachments(
      event,
      data,
      attachmentGenerator
    )

    if (data.locale && typeof templateId === "object")
      templateId = templateId[data.locale] || Object.values(templateId)[0] // Fallback to first template if locale is not found

    if(templateId === null)
        return false

    const sendOptions = {
      From: this.options_.from,
      to: data.email ?? data?.customer?.email,
      TemplateId: templateId,
      TemplateModel: {
        ...data,
        ...this.options_.default_data
      }
    }
    if(this.options_?.bcc)
        sendOptions.Bcc = this.options_.bcc

    if (attachments?.length) {
      sendOptions.Attachments = attachments.map((a) => {
        return {
          content: a.base64,
          Name: a.name,
          ContentType: a.type,
          ContentID: `cid:${a.name}`,
        }
      })
    }

    return await this.client_.sendEmailWithTemplate(sendOptions)
    .then(() => ({ to: sendOptions.to, status: 'sent', data: sendOptions }))
    .catch((error) => {
      console.error(error)
        return { to: sendOptions.to, status: 'failed', data: sendOptions }
    })
  }

  async resendNotification(notification, config, attachmentGenerator) {
    const sendOptions = {
      ...notification.data,
      To: config.to || notification.to,
    }

    const attachs = await this.fetchAttachments(
      notification.event_name,
      notification.data.dynamic_template_data,
      attachmentGenerator
    )
    sendOptions.attachments = attachs.map((a) => {
      return {
        content: a.base64,
        filename: a.name,
        type: a.type,
        disposition: "attachment",
        contentId: a.name,
      }
    })

    return await this.client_.sendEmailWithTemplate(sendOptions)
        .then(() => ({ to: sendOptions.To, status: 'sent', data: sendOptions }))
        .catch((error) => {
          console.error(error)
          return { to: sendOptions.To, status: 'failed', data: sendOptions }
        })
  }

  async sendMail(options) {
    try{
      this.client_.sendEmailWithTemplate({
        ...options,
        TemplateModel: {
          ...options.TemplateModel,
          ...this.options_.default_data
        }
      })
    }catch (err) {
      console.log(err)
      throw err
    }
  }

  async orderShipmentCreatedData({ id, fulfillment_id }, attachmentGenerator) {
    const order = await this.orderService_.retrieve(id, {
      select: [
        "shipping_total",
        "discount_total",
        "tax_total",
        "refunded_total",
        "gift_card_total",
        "subtotal",
        "total",
        "refundable_amount",
      ],
      relations: [
        "customer",
        "billing_address",
        "shipping_address",
        "discounts",
        "discounts.rule",
        "shipping_methods",
        "shipping_methods.shipping_option",
        "payments",
        "fulfillments",
        "returns",
        "gift_cards",
        "gift_card_transactions",
      ],
    })

    const shipment = await this.fulfillmentService_.retrieve(fulfillment_id, {
      relations: ["items", "tracking_links"],
    })

    const locale = await this.extractLocale(order)

    return {
      locale,
      order,
      date: shipment.shipped_at.toDateString(),
      email: order.email,
      fulfillment: shipment,
      tracking_links: shipment.tracking_links,
      tracking_number: shipment.tracking_numbers.join(", "),
    }
  }

  async orderCanceledData({ id }) {
    const order = await this.orderService_.retrieve(id, {
      select: [
        "shipping_total",
        "discount_total",
        "tax_total",
        "refunded_total",
        "gift_card_total",
        "subtotal",
        "total",
      ],
      relations: [
        "customer",
        "billing_address",
        "shipping_address",
        "discounts",
        "discounts.rule",
        "shipping_methods",
        "shipping_methods.shipping_option",
        "payments",
        "fulfillments",
        "returns",
        "gift_cards",
        "gift_card_transactions",
      ],
    })

    const {
      subtotal,
      tax_total,
      discount_total,
      shipping_total,
      gift_card_total,
      total,
    } = order

    const taxRate = order.tax_rate / 100
    const currencyCode = order.currency_code.toUpperCase()

    const items = this.processItems_(order.items, taxRate, currencyCode)

    let discounts = []
    if (order.discounts) {
      discounts = order.discounts.map((discount) => {
        return {
          is_giftcard: false,
          code: discount.code,
          descriptor: `${discount.rule.value}${
            discount.rule.type === "percentage" ? "%" : ` ${currencyCode}`
          }`,
        }
      })
    }

    let giftCards = []
    if (order.gift_cards) {
      giftCards = order.gift_cards.map((gc) => {
        return {
          is_giftcard: true,
          code: gc.code,
          descriptor: `${gc.value} ${currencyCode}`,
        }
      })

      discounts.concat(giftCards)
    }

    const locale = await this.extractLocale(order)

    return {
      ...order,
      locale,
      has_discounts: order.discounts.length,
      has_gift_cards: order.gift_cards.length,
      date: order.created_at.toDateString(),
      items,
      discounts,
      subtotal: `${this.humanPrice_(
        subtotal * (1 + taxRate),
        currencyCode
      )} ${currencyCode}`,
      gift_card_total: `${this.humanPrice_(
        gift_card_total * (1 + taxRate),
        currencyCode
      )} ${currencyCode}`,
      tax_total: `${this.humanPrice_(tax_total, currencyCode)} ${currencyCode}`,
      discount_total: `${this.humanPrice_(
        discount_total * (1 + taxRate),
        currencyCode
      )} ${currencyCode}`,
      shipping_total: `${this.humanPrice_(
        shipping_total * (1 + taxRate),
        currencyCode
      )} ${currencyCode}`,
      total: `${this.humanPrice_(total, currencyCode)} ${currencyCode}`,
    }
  }
  async orderPlacedData({ id }) {
    const order = await this.orderService_.retrieve(id, {
      select: [
        "shipping_total",
        "discount_total",
        "tax_total",
        "refunded_total",
        "gift_card_total",
        "subtotal",
        "total",
      ],
      relations: [
        "customer",
        "billing_address",
        "shipping_address",
        "discounts",
        "discounts.rule",
        "shipping_methods",
        "shipping_methods.shipping_option",
        "payments",
        "fulfillments",
        "returns",
        "gift_cards",
        "gift_card_transactions",
      ],
    })

    const { tax_total, shipping_total, gift_card_total, total } = order

    const currencyCode = order.currency_code.toUpperCase()

    const items = await Promise.all(
      order.items.map(async (i) => {
        i.totals = await this.totalsService_.getLineItemTotals(i, order, {
          include_tax: true,
          use_tax_lines: true,
        })
        i.thumbnail = this.normalizeThumbUrl_(i.thumbnail)
        i.discounted_price = `${this.humanPrice_(
          i.totals.total / i.quantity,
          currencyCode
        )} ${currencyCode}`
        i.price = `${this.humanPrice_(
          i.totals.original_total / i.quantity,
          currencyCode
        )} ${currencyCode}`
        return i
      })
    )

    let discounts = []
    if (order.discounts) {
      discounts = order.discounts.map((discount) => {
        return {
          is_giftcard: false,
          code: discount.code,
          descriptor: `${discount.rule.value}${
            discount.rule.type === "percentage" ? "%" : ` ${currencyCode}`
          }`,
        }
      })
    }

    let giftCards = []
    if (order.gift_cards) {
      giftCards = order.gift_cards.map((gc) => {
        return {
          is_giftcard: true,
          code: gc.code,
          descriptor: `${gc.value} ${currencyCode}`,
        }
      })

      discounts.concat(giftCards)
    }

    const locale = await this.extractLocale(order)

    // Includes taxes in discount amount
    const discountTotal = items.reduce((acc, i) => {
      return acc + i.totals.original_total - i.totals.total
    }, 0)

    const discounted_subtotal = items.reduce((acc, i) => {
      return acc + i.totals.total
    }, 0)
    const subtotal = items.reduce((acc, i) => {
      return acc + i.totals.original_total
    }, 0)

    const subtotal_ex_tax = items.reduce((total, i) => {
      return total + i.totals.subtotal
    }, 0)

    return {
      ...order,
      locale,
      has_discounts: order.discounts.length,
      has_gift_cards: order.gift_cards.length,
      date: order.created_at.toDateString(),
      items,
      discounts,
      subtotal_ex_tax: `${this.humanPrice_(
        subtotal_ex_tax,
        currencyCode
      )} ${currencyCode}`,
      subtotal: `${this.humanPrice_(subtotal, currencyCode)} ${currencyCode}`,
      gift_card_total: `${this.humanPrice_(
        gift_card_total,
        currencyCode
      )} ${currencyCode}`,
      tax_total: `${this.humanPrice_(tax_total, currencyCode)} ${currencyCode}`,
      discount_total: `${this.humanPrice_(
        discountTotal,
        currencyCode
      )} ${currencyCode}`,
      shipping_total: `${this.humanPrice_(
        shipping_total,
        currencyCode
      )} ${currencyCode}`,
      total: `${this.humanPrice_(total, currencyCode)} ${currencyCode}`,
    }
  }

  userPasswordResetData(data) {
    return data
  }

  customerPasswordResetData(data) {
    return data
  }

  processItems_(items, taxRate, currencyCode) {
    return items.map((i) => {
      return {
        ...i,
        thumbnail: this.normalizeThumbUrl_(i.thumbnail),
        price: `${currencyCode} ${this.humanPrice_(
          i.unit_price * (1 + taxRate),
          currencyCode
        )}`,
      }
    })
  }

  humanPrice_(amount, currency) {
    if (!amount)
      return "0.00"
    const normalized = humanizeAmount(amount, currency)
    return normalized.toFixed(
      zeroDecimalCurrencies.includes(currency.toLowerCase()) ? 0 : 2
    )
  }

  normalizeThumbUrl_(url) {
    if (!url)
      return null
    else if (url.startsWith("http"))
      return url
    else if (url.startsWith("//"))
      return `https:${url}`
    return url
  }

  async extractLocale(fromOrder) {
    if (fromOrder.cart_id) {
      try {
        const cart = await this.cartService_.retrieve(fromOrder.cart_id, {
          select: ["id", "context"],
        })

        if (cart.context && cart.context.locale)
          return cart.context.locale
      } catch (err) {
        console.log(err)
        console.warn("Failed to gather context for order")
        return null
      }
    }
    return null
  }
}

export default PostmarkService
