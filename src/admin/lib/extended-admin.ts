import { Client } from "@medusajs/js-sdk"
import {
    CreateReminderScheduleRequest,
    UpdateReminderScheduleRequest,
    ReminderScheduleListResponse,
    ReminderScheduleResponse
} from "../../types/reminder-schedules"
import { PostmarkTemplate } from "../../types/templates";


class ReminderSchedules {
    private client: Client

    constructor(client: Client) {
        this.client = client
    }

    async list(query?: { offset?: number; limit?: number; id?: string; q?: string }) {
        return this.client.fetch<ReminderScheduleListResponse>(
            "/admin/postmark/abandoned-carts/reminders/schedules",
            {
                method: "GET",
                query
            }
        )
    }

    async get(id: string) {
        return this.client.fetch<ReminderScheduleResponse>(
            `/admin/postmark/abandoned-carts/reminders/schedules/${id}`
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
}
class Templates {
    private client: Client

    constructor(client: Client) {
        this.client = client
    }
    async list(query?: { offset?: number; limit?: number; id?: string; q?: string }) {
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
