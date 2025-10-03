import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ABANDONED_CART_MODULE } from "../../../../../../modules/abandoned-cart"
import {
  CreateReminderSchedule
} from "../../../../../../types/reminder-schedules"

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
