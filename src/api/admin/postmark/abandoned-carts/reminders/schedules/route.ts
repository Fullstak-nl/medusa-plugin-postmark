import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { ABANDONED_CART_MODULE } from "../../../../../../modules/abandoned-cart"

export const CreateAbandonedCartReminderScheduleSchema = z.object({
  enabled: z.boolean(),
  template_id: z.string(),
  offset_hours: z.array(z.string())
})

type CreateReminderSchedule = z.infer<typeof CreateAbandonedCartReminderScheduleSchema>

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const abandonedCartModuleService = req.scope.resolve(ABANDONED_CART_MODULE)
  const schedules = await abandonedCartModuleService.listReminderSchedules()
  res.json({ schedules })
}

export async function POST(req: MedusaRequest<CreateReminderSchedule>, res: MedusaResponse) {
  const abandonedCartModuleService = req.scope.resolve(ABANDONED_CART_MODULE)
  const schedules = await abandonedCartModuleService.createReminderSchedules(req.validatedBody)
  res.json({ schedules })
}
