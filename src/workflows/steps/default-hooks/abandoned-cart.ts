import { NotificationDataWorkflowInput } from "../../notification-data"

export const defaultAbandonedCartData =
    async (carts: NotificationDataWorkflowInput["carts"]) =>
        carts.flatMap(([reminder, carts]) =>
            carts.map((cart) => ({
                to: cart.email!,
                channel: "feed",
                template: reminder.template,
                data: {
                    cart
                }
            }))
        )

