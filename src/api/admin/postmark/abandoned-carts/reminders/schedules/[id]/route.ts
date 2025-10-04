import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ABANDONED_CART_MODULE } from "../../../../../../../modules/abandoned-cart"
import {
    UpdateReminderSchedule
} from "../../../../../../../types/reminder-schedules"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    const { id } = req.params
    const abandonedCartModuleService = req.scope.resolve(ABANDONED_CART_MODULE)
    const schedule = await abandonedCartModuleService.retrieveReminderSchedule(id)
    res.json({ schedule })
}

export async function POST(req: MedusaRequest<UpdateReminderSchedule>, res: MedusaResponse) {
    const { id } = req.params
    const abandonedCartModuleService = req.scope.resolve(ABANDONED_CART_MODULE)
    const schedules = await abandonedCartModuleService.updateReminderSchedules({ id, ...req.validatedBody })
    res.json({ schedules })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
    const { id } = req.params
    const abandonedCartModuleService = req.scope.resolve(ABANDONED_CART_MODULE)
    await abandonedCartModuleService.deleteReminderSchedules(id)
    res.json({ success: true })
}
