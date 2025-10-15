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

export type NotificationDataWorkflowInput = {
    carts: Array<[{ delay: number, template: string, schedule: ReminderSchedule }, (CartDTO & { customer: CustomerDTO })[]]>
}

export const notificationDataWorkflow = createWorkflow(
    "notification-data",
    function (input: NotificationDataWorkflowInput) {
        const { carts } = input

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

        const notificationData: CreateNotificationDTO[] = transform(
            { notificationDataHookResult, carts },
            async ({ notificationDataHookResult, carts }) => {
                if (notificationDataHookResult)
                    return notificationDataHookResult

                return await defaultAbandonedCartData(carts)
            }
        )

        return new WorkflowResponse({ notificationData }, { hooks: [notificationDataHook] })
    }
)
