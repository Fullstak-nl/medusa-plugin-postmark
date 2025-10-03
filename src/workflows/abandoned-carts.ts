import {
    createWorkflow,
    WorkflowResponse,
    transform,
    createHook,
    when,
} from "@medusajs/framework/workflows-sdk"
import { sendAbandonedNotificationsStep } from "./steps/send-abandoned-notifications"
import { updateCartsStep } from "@medusajs/medusa/core-flows"
import zod from "zod"
import { fetchAbandonedCarts } from "./steps/fetch-abandoned-carts"
import { Reminder } from "../types/reminder-schedules"
import { defaultAbandonedCartData } from "./steps/default-hooks/abandoned-cart"

export type SendAbandonedCartsWorkflowInput = {
    reminders: Reminder[]
    pagination: { limit: number, offset: number }
}

export const sendAbandonedCartsWorkflow = createWorkflow(
    "send-abandoned-carts",
    function (input: SendAbandonedCartsWorkflowInput) {
        const { carts, totalCount } = fetchAbandonedCarts(input)

        const notificationDataHook = createHook(
            "abandonedCartNotificationData",
            { carts },
            {
                resultValidator: zod.array(zod.object({
                    to: zod.string(),
                    channel: zod.string(),
                    template: zod.string(),
                    data: zod.record(zod.any()).default({}),
                    attachments: zod.array(zod.any()).optional(),
                }))
            }
        )
        const notificationDataHookResult = notificationDataHook.getResult()

        const defaultData = when({ notificationDataHookResult }, ({ notificationDataHookResult }) => !notificationDataHookResult)
            .then(() => defaultAbandonedCartData(carts))

        const notificationData = transform(
            { notificationDataHookResult, defaultData },
            (data) => {
                return data.notificationDataHookResult ?? data.defaultData
            }
        )

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

        return new WorkflowResponse({ updatedCarts, pagination: { totalCount } }, { hooks: [notificationDataHook] })
    }
)
