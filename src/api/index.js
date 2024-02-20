import { Router } from "express"
import routes from "./routes"
import {humanizeAmount, zeroDecimalCurrencies} from "medusa-core-utils";
import PdfGenerator from "../generators/pdfGenerator";
// writing pdf to file
import fs from 'fs';
import path from 'path';

export default (container) => {
   const app = Router()

   app.get("/hello", (req, res) => {
      res.json({
         message: "Welcome to My Store!",
      })
   })
   app.get("/export", async (req, res) => {
      const pdfGen = new PdfGenerator();
      const orderService = req.scope.resolve("orderService")
      const orderIds = ['order_01HBBZVQP85VNG96J683B5K88C','order_01HBEJGAG2MG3F86ZEG4VFJXN7','order_01HD0W7BAK9H2KG1NE4MWF2WE9','order_01HBGKGB53GT92913E81QDVQS5','order_01HBP8DT5R6RK3VBFGK710EQ0V','order_01HBP99PP63CHJN9P2KH5GZSAP','order_01HBTP2GJVBAJ9CXGEEKMZW3VA','order_01HBVH1WYSG9T7R7ZA99TZVE6Y','order_01HCAZ40NNT6R66R9RC64PKEFC','order_01HCH78FBCQG9GYQWXJBPVMX3J','order_01HD6WCPQ18BDWAF7XEV0XWR8E','order_01HCMV7YE2V6SZQ9J7VAA8PV85','order_01HDC11S8MPPK8BJ238TN8WFT9','order_01HDPACBK1Y89Q0ZY6XSEQAXHW','order_01HDV1S5SDNY31THZGNDTVHCAY','order_01HE0X59MMQQDTBAP1TFVW0Q03','order_01HE30PAP9DEHPA2GWK8E5QZGD','order_01HE8PNWNXMKMD1XP6AYNEPZXT','order_01HED71202RGBC7TBFD8Z22M16','order_01HEDX6F46C0FGXCBWGSAYGGWF','order_01HF9QWVSS478R9QX6S4B5CP44','order_01HEE6Z79AXNMZ0J6XFQS5Y3FE','order_01HFCABG830N64JDFK279QJF1G','order_01HFEVJTX34PZ331D97DP31RVH','order_01HFQA4KCCW4GD8V1KSHHMC3JP','order_01HG5N3320NA7CZZ6QWBG2QWGZ','order_01HGB4YGH07TGXQP9K3Y01CBEY','order_01HGBABS2BT6NVVJBDT06E3NKE','order_01HGGNV3X9CXH7957AZAXSBQJX','order_01HHD97J3JZBD007SM9ZD0Y7JM','order_01HGJMMW3P5RT4EAR92NP4DP5V','order_01HGWHMG7F512Z5ATJT26J316B','order_01HH0J0V82A2TD0MB507KQ5XXJ','order_01HHD36KQ6P4XWXK0H6TYZXRR1','order_01HHHGSDCB7RDH2T4N7G4GMYE0','order_01HHWPKFTV2ZA2MEWGS60GFZ6Y','order_01HJK113GHJ4XM0VXQ1JG32SZ9','order_01HK34278GAD734XC01KV6497Q','order_01HJQTP3GMW8T65EKM3ZH2MJJ3','order_01HKJ1CGVJH6729N6YFQY9QH8T','order_01HKHZBNNFRDQ5R39SHCYT1RAD','order_01HMKFED9TCHBK7KP6C3NVZ8GD','order_01HMNDFB41876NP25ZF4G62FSM'];//req.params.id;
      const totalsService = req.scope.resolve("totalsService")
      const options = {
         pdf: {
            enabled: true,
            settings: {
               font: process.env.POSTMARK_PDF_FONT || 'Helvetica',
               format: process.env.POSTMARK_PDF_FORMAT || 'A4',
               margin: {
                  top: process.env.POSTMARK_PDF_MARGIN_TOP || 50,
                  right: process.env.POSTMARK_PDF_MARGIN_RIGHT || 50,
                  bottom: process.env.POSTMARK_PDF_MARGIN_BOTTOM || 50,
                  left: process.env.POSTMARK_PDF_MARGIN_LEFT || 50
               }
            },
            header: {
               enabled: true,
               content: 'header.json',
               height: process.env.POSTMARK_PDF_HEADER_HEIGHT || 50
            },
            footer: {
               enabled: true,
               content: 'footer.json',
            },
            templates: {
               invoice: 'createInvoice.json',
               credit_note: process.env.POSTMARK_PDF_CREDIT_NOTE_TEMPLATE || undefined,
               return_invoice: process.env.POSTMARK_PDF_RETURN_INVOICE_TEMPLATE || undefined
            }
         },
      }
      for (const orderId of orderIds) {
         const data = await getOrderData(orderService, totalsService, orderId)
         try {
            if ((options?.pdf?.enabled ?? false) && pdfGen && pdfGen.createInvoice) {
               const base64 = await pdfGen.createInvoice(
                   options,
                   data
               )
               // attachments.push({
               //     name: "invoice.pdf",
               //     base64,
               //     type: "application/pdf",
               // })
               // res.type('application/pdf');
               // res.header('Content-Disposition', `attachment; filename="${orderId}.pdf"`);
               // res.send(Buffer.from(base64, 'base64'));
               // write tot file as real pdf, not base64
               const dir = path.join(__dirname, '..', '..', 'pdf');
               if (!fs.existsSync(dir)){
                  fs.mkdirSync(dir);
               }
               console.log(dir)
               const filename = path.join(dir, orderId + '.pdf');
               fs.writeFile(filename, Buffer.from(base64, 'base64'), (err) => {
                  if (err) throw err;
                  console.log('The file has been saved!');
               });
            }
         } catch (err) {

            console.log('error ?', err)
            console.error(err)
         }
      }
      res.json({
         message: "Welcome to My Store!",
      })
   })

   const getOrderData = async(orderService, totalsService, orderId) => {
      const order = await orderService.retrieve(orderId, {
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
             i.totals = await totalsService.getLineItemTotals(i, order, {
                include_tax: true,
                use_tax_lines: true,
             })
             i.thumbnail = normalizeThumbUrl_(i.thumbnail)
             i.discounted_price = `${humanPrice_(
                 i.totals.total / i.quantity,
                 currencyCode
             )} ${currencyCode}`
             i.price = `${humanPrice_(
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

      const locale = 'nl'

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
         subtotal_ex_tax: `${humanPrice_(
             subtotal_ex_tax,
             currencyCode
         )} ${currencyCode}`,
         subtotal: `${humanPrice_(subtotal, currencyCode)} ${currencyCode}`,
         gift_card_total: `${humanPrice_(
             gift_card_total,
             currencyCode
         )} ${currencyCode}`,
         tax_total: `${humanPrice_(tax_total, currencyCode)} ${currencyCode}`,
         discount_total: `${humanPrice_(
             discountTotal,
             currencyCode
         )} ${currencyCode}`,
         shipping_total: `${humanPrice_(
             shipping_total,
             currencyCode
         )} ${currencyCode}`,
         shipping_total_inc: `${humanPrice_(
             order?.shipping_methods[0]?.price || shipping_total,
             currencyCode
         )} ${currencyCode}`,
         total: `${humanPrice_(total, currencyCode)} ${currencyCode}`,
      }
   }

   const humanPrice_ = (amount, currency) => {
      if (!amount)
         return "0.00"
      const normalized = humanizeAmount(amount, currency)
      return normalized.toFixed(
          zeroDecimalCurrencies.includes(currency.toLowerCase()) ? 0 : 2
      )
   }

   const  normalizeThumbUrl_ = (url) => {
      if (!url)
         return 
      else if (url.startsWith("http"))
         return url
      else if (url.startsWith("//"))
         return `https:${url}`
      return url
   }

   routes(app)

   return app
}
