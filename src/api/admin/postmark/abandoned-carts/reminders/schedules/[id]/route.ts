import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { ABANDONED_CART_MODULE } from "../../../../../../../modules/abandoned-cart"
import {
    UpdateReminderSchedule
} from "../../../../../../../types/reminder-schedules"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    const { id } = req.params
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    const { data: [schedule] } = await query.graph(
        {
            entity: "reminder_schedule",
            ...req.queryConfig,
            filters: {
                id,
            },
        },
        {
            cache: {
                enable: true,
                ttl: 5,
            },
        }
    )

    res.json({ schedule })
}

export async function POST(req: MedusaRequest<UpdateReminderSchedule>, res: MedusaResponse) {
    const { id } = req.params
    const abandonedCartModuleService = req.scope.resolve(ABANDONED_CART_MODULE)
    const schedule = await abandonedCartModuleService.updateReminderSchedules({ id, ...req.validatedBody })

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

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
    const { id } = req.params
    const abandonedCartModuleService = req.scope.resolve(ABANDONED_CART_MODULE)
    await abandonedCartModuleService.deleteReminderSchedules(id)
    res.json({ success: true })
}
