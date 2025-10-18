import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { ABANDONED_CART_MODULE } from "../../../../../../modules/abandoned-cart"
import {
  CreateReminderSchedule
} from "../../../../../../types/reminder-schedules"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: schedules } = await query.graph(
    {
      entity: "reminder_schedule",
      ...req.queryConfig,
    },
    {
      cache: {
        enable: true,
        ttl: 5,
      },
    }
  )

  res.json({ schedules })
}

export async function POST(req: MedusaRequest<CreateReminderSchedule>, res: MedusaResponse) {
  const abandonedCartModuleService = req.scope.resolve(ABANDONED_CART_MODULE)
  const schedule = await abandonedCartModuleService.createReminderSchedules(req.validatedBody)

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: schedules } = await query.graph({
    entity: "reminder_schedule",
    fields: [
      "*",
      "template.*",
    ],
    filters: {
      id: schedule.id,
    },
  })

  res.json({ schedules })
}
