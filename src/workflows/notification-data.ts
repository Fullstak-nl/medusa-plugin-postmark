import {
    createWorkflow,
    WorkflowResponse,
    transform,
    createHook,
} from "@medusajs/framework/workflows-sdk"
import zod from "zod"
import { defaultAbandonedCartData } from "./steps/default-hooks/abandoned-cart"
import { CartDTO, CreateNotificationDTO, CustomerDTO } from "@medusajs/framework/types"
import { ReminderSchedule } from "../types/reminder-schedules"
import { Temporal } from "temporal-polyfill"

export type NotificationDataWorkflowInput = {
    carts: Array<{ cart: CartDTO & { customer: CustomerDTO }, reminders: Array<{ delay: Temporal.Duration, delayIso: string, template: string, schedule: ReminderSchedule }> }>
}

export const notificationDataWorkflow = createWorkflow(
    "notification-data",
    function (input: NotificationDataWorkflowInput) {
        const notificationDataHook = createHook(
            "abandonedCartNotificationData",
            input,
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

        const notificationData: CreateNotificationDTO[] = transform(
            { notificationDataHookResult, carts: input.carts },
            async ({ notificationDataHookResult, carts }) => {
                if (notificationDataHookResult)
                    return notificationDataHookResult

                return await defaultAbandonedCartData(carts)
            }
        )

        return new WorkflowResponse({ notificationData }, { hooks: [notificationDataHook] })
    }
)
