import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { ABANDONED_CART_MODULE } from "../../../../../../../modules/abandoned-cart"

export const UpdateAbandonedCartReminderScheduleSchema = z.object({
    enabled: z.boolean().optional(),
    template_id: z.string().optional(),
    offset_hours: z.array(z.string()).optional()
})

type UpdateReminderSchedule = z.infer<typeof UpdateAbandonedCartReminderScheduleSchema>

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
