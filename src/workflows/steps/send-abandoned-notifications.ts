import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import { CreateNotificationDTO } from "@medusajs/framework/types"

type SendAbandonedNotificationsStepInput = { data: CreateNotificationDTO[] }

export const sendAbandonedNotificationsStep = createStep(
  "send-abandoned-notifications",
  async (input: SendAbandonedNotificationsStepInput, { container }) => {
    const notificationModuleService = container.resolve(Modules.NOTIFICATION)
    const notifications = await notificationModuleService.createNotifications(input.data)

    return new StepResponse({ notifications })
  }
)
