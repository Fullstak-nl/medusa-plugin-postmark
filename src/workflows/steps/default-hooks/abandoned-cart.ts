import { NotificationDataWorkflowInput } from "../../notification-data"

export const defaultAbandonedCartData =
    async (carts: NotificationDataWorkflowInput["carts"]) =>
        carts.flatMap(({ cart, reminders }) =>
            reminders.map(reminder => ({
                to: cart.email!,
                channel: "feed",
                template: reminder.template,
                data: {
                    cart
                }
            }))
        )

