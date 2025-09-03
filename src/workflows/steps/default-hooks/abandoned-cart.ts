import { CartDTO, CustomerDTO } from "@medusajs/framework/types"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { Reminder } from "../../../types/abandoned-cart"

export const defaultAbandonedCartData = createStep(
    "default-notification-data",
    async (carts: Array<[Reminder, (CartDTO & { customer: CustomerDTO })[]]>) => {
        const result = carts.flatMap(([reminder, carts]) =>
            carts.map((cart) => ({
                to: cart.email!,
                channel: "email",
                template: reminder.template,
                data: {
                    customer: {
                        first_name: cart.customer?.first_name || cart.shipping_address?.first_name,
                        last_name: cart.customer?.last_name || cart.shipping_address?.last_name,
                    },
                    cart_id: cart.id,
                    items: cart.items?.map((item) => ({
                        product_title: item.title,
                        quantity: item.quantity,
                        unit_price: item.unit_price,
                        thumbnail: item.thumbnail,
                    })),
                }
            }))
        )
        return new StepResponse(result)
    }
)
