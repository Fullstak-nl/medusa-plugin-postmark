import { NotificationDataWorkflowInput } from "../../notification-data"

export const defaultAbandonedCartData =
    async (carts: NotificationDataWorkflowInput["carts"]) =>
        carts.flatMap(([reminder, carts]) =>
            carts.map((cart) => ({
                to: cart.email!,
                channel: "feed",
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

