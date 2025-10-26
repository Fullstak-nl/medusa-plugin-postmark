import {
    createWorkflow,
    WorkflowResponse,
    transform,
} from "@medusajs/framework/workflows-sdk"
import { sendNotificationsStep, updateCartsStep } from "@medusajs/medusa/core-flows"
import { fetchAbandonedCarts } from "./steps/fetch-abandoned-carts"
import { ReminderSchedule } from "../types/reminder-schedules"
import { notificationDataWorkflow } from "./notification-data"
import { computeCartReferenceTimestamp } from "../types/abandoned-cart-tracking"
import { deepMerge } from "@medusajs/utils"

export type SendAbandonedCartsWorkflowInput = {
    reminderSchedules: ReminderSchedule[]
    pagination: { limit: number, offset: number }
}

export const sendAbandonedCartsWorkflow = createWorkflow(
    "send-abandoned-carts",
    function (input: SendAbandonedCartsWorkflowInput) {
        const { carts, totalCount } = fetchAbandonedCarts(input)

        const { notificationData } = notificationDataWorkflow.runAsStep({
            input: { carts }
        })

        sendNotificationsStep(notificationData)

        const updateCartsData = transform(carts, cartReminderGroups => {
            const now = new Date()
            return cartReminderGroups.map(({ cart, reminders }) => {
                const cartReferenceAtSend = new Date(computeCartReferenceTimestamp(cart))

                // Build a sent_notifications object for all reminders
                const sent_notifications = Object.fromEntries(
                    reminders.map(reminder => [
                        `${reminder.schedule.id}:${reminder.delayIso}`,
                        {
                            sent_at: now.toISOString(),
                            cart_reference_at_send: cartReferenceAtSend.toISOString()
                        }
                    ])
                )
                
                return {
                    id: cart.id,
                    metadata: deepMerge(cart.metadata, { abandoned_cart_tracking: { sent_notifications } })
                }
            })
        })

        const updatedCarts = updateCartsStep(updateCartsData)

        return new WorkflowResponse({ updatedCarts, pagination: { totalCount } })
    }
)
