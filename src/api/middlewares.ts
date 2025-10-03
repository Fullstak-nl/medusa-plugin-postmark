import { defineMiddlewares, validateAndTransformBody } from "@medusajs/framework/http"
import {
    CreateAbandonedCartReminderScheduleSchema,
    UpdateAbandonedCartReminderScheduleSchema
} from "../types/reminder-schedules"

export default defineMiddlewares({
    routes: [
        {
            matcher: "/admin/postmark/abandoned-carts/reminders/schedules",
            methods: ["POST"],
            middlewares: [
                validateAndTransformBody(CreateAbandonedCartReminderScheduleSchema),
            ],
        },
        {
            matcher: "/admin/postmark/abandoned-carts/reminders/schedules/:id",
            methods: ["POST"],
            middlewares: [
                validateAndTransformBody(UpdateAbandonedCartReminderScheduleSchema),
            ],
        },
    ],
})
