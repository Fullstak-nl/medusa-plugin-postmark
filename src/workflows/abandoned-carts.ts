import {
    createWorkflow,
    WorkflowResponse,
    transform,
} from "@medusajs/framework/workflows-sdk"
import { sendAbandonedNotificationsStep } from "./steps/send-abandoned-notifications"
import { updateCartsStep } from "@medusajs/medusa/core-flows"
import { fetchAbandonedCarts } from "./steps/fetch-abandoned-carts"
import { ReminderSchedule } from "../types/reminder-schedules"
import { notificationDataWorkflow } from "./notification-data"

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

        sendAbandonedNotificationsStep({ data: notificationData })

        const updateCartsData = transform(carts, groupedCarts => {
            return groupedCarts.flatMap(([_, carts]) =>
                carts.map((cart) => ({
                    id: cart.id,
                    metadata: {
                        ...cart.metadata,
                        abandoned_notification: new Date().toISOString(),
                    },
                })))
        })

        const updatedCarts = updateCartsStep(updateCartsData)

        return new WorkflowResponse({ updatedCarts, pagination: { totalCount } })
    }
)
