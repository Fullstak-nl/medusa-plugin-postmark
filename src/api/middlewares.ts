import { defineMiddlewares, validateAndTransformBody, validateAndTransformQuery } from "@medusajs/framework/http"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"
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
            matcher: "/admin/postmark/abandoned-carts/reminders/schedules",
            methods: ["GET"],
            middlewares: [
                validateAndTransformQuery(createFindParams(), {
                    defaults: [
                        "id",
                        "template_id",
                        "delays_iso",
                        "enabled"
                    ],
                    isList: true,
                }),
            ],
        },
        {
            matcher: "/admin/postmark/abandoned-carts/reminders/schedules/:id",
            methods: ["POST"],
            middlewares: [
                validateAndTransformBody(UpdateReminderScheduleSchema),
            ],
        },
        {
            matcher: "/admin/postmark/abandoned-carts/reminders/schedules/:id",
            methods: ["GET"],
            middlewares: [
                validateAndTransformQuery(createFindParams(), {
                    defaults: [
                        "id",
                        "template_id",
                        "delays_iso",
                        "enabled"
                    ],
                    isList: false,
                }),
            ],
        },
    ],
})
