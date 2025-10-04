import { defineMiddlewares, validateAndTransformBody } from "@medusajs/framework/http"
import {
    CreateReminderScheduleSchema,
    UpdateReminderScheduleSchema
} from "../types/reminder-schedules"

export default defineMiddlewares({
    routes: [
        {
            matcher: "/admin/postmark/abandoned-carts/reminders/schedules",
            methods: ["POST"],
            middlewares: [
                validateAndTransformBody(CreateReminderScheduleSchema),
            ],
        },
        {
            matcher: "/admin/postmark/abandoned-carts/reminders/schedules/:id",
            methods: ["POST"],
            middlewares: [
                validateAndTransformBody(UpdateReminderScheduleSchema),
            ],
        },
    ],
})
