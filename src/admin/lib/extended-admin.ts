import { Client } from "@medusajs/js-sdk"
import {
    CreateReminderScheduleRequest,
    UpdateReminderScheduleRequest,
    ReminderScheduleListResponse,
    ReminderScheduleResponse
} from "../../types/reminder-schedules"
import { PostmarkTemplate } from "../../types/templates"
import { ValidationResponse } from "../../types/validation"
import { HttpTypes } from "@medusajs/framework/types"


class ReminderSchedules {
    private client: Client

    constructor(client: Client) {
        this.client = client
    }

    async list(query?: { id?: string; q?: string } & HttpTypes.FindParams) {
        return this.client.fetch<ReminderScheduleListResponse>(
            "/admin/postmark/abandoned-carts/reminders/schedules",
            {
                query
            }
        )
    }

    async retrieve(id: string, query?: HttpTypes.SelectParams) {
        return this.client.fetch<ReminderScheduleResponse>(
            `/admin/postmark/abandoned-carts/reminders/schedules/${id}`,
            {
                query
            }
        )
    }

    async create(data: CreateReminderScheduleRequest) {
        return this.client.fetch<ReminderScheduleResponse>(
            "/admin/postmark/abandoned-carts/reminders/schedules",
            {
                method: "POST",
                body: data,
            }
        )
    }

    async update(id: string, data: UpdateReminderScheduleRequest) {
        return this.client.fetch<ReminderScheduleResponse>(
            `/admin/postmark/abandoned-carts/reminders/schedules/${id}`,
            {
                method: "POST",
                body: data,
            }
        )
    }

    async delete(id: string) {
        return this.client.fetch<{ success: boolean }>(
            `/admin/postmark/abandoned-carts/reminders/schedules/${id}`,
            {
                method: "DELETE",
            }
        )
    }

    async validate() {
        return this.client.fetch<ValidationResponse>(
            "/admin/postmark/abandoned-carts/reminders/validate",
            {
                method: "POST",
            }
        )
    }
}
class Templates {
    private client: Client

    constructor(client: Client) {
        this.client = client
    }
    async list(query?: HttpTypes.FindParams & {
        id?: string
        q?: string
        templateType?: "Standard" | "Layout"
    }) {
        return this.client.fetch<{ Templates: PostmarkTemplate[], TotalCount: number, offset: number, limit: number, count: number }>(
            "/admin/postmark/templates",
            {
                method: "GET",
                query
            }
        )
    }
}

class Postmark {
    public reminderSchedules: ReminderSchedules
    public templates: Templates

    constructor(client: Client) {
        this.reminderSchedules = new ReminderSchedules(client)
        this.templates = new Templates(client)
    }
}

export class ExtendedAdmin {
    public postmark: Postmark

    constructor(client: Client) {
        this.postmark = new Postmark(client)
    }
}
