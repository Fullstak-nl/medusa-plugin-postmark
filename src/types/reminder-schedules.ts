import { z } from "zod"
import { PostmarkTemplate } from "./templates"
import { Temporal } from "temporal-polyfill"

/**
 * Base reminder schedule entity - represents the database model
 */
export interface ReminderSchedule {
    id: string
    enabled: boolean
    template_id: string
    template?: PostmarkTemplate
    delays_iso: string[] // ISO 8601 duration strings (e.g., "PT1H", "PT24H", "P1D")
    notify_existing: boolean // Whether to notify for carts created before the last schedule update
    created_at?: Date
    updated_at?: Date
    deleted_at?: Date | null
}


/**
 * Request payload for creating a new reminder schedule
 */
export interface CreateReminderScheduleRequest {
    enabled: boolean
    template_id: string
    delays_iso: string[] // ISO 8601 duration strings
    notify_existing: boolean // Whether to notify for carts created before the last schedule update
}

/**
 * Request payload for updating an existing reminder schedule
 */
export interface UpdateReminderScheduleRequest {
    enabled?: boolean
    template_id?: string
    delays_iso?: string[] // ISO 8601 duration strings
    notify_existing?: boolean // Whether to notify for carts created before the last schedule update
}

/**
 * API response for listing reminder schedules
 */
export interface ReminderScheduleListResponse {
    schedules: ReminderSchedule[]
}

/**
 * API response for single reminder schedule operations
 */
export interface ReminderScheduleResponse {
    schedule: ReminderSchedule
}

/**
 * Zod schema for creating reminder schedules
 */
export const CreateReminderScheduleSchema = z.object({
    enabled: z.boolean(),
    template_id: z.string().nonempty(),
    delays_iso: z.array(
        z.string().duration()
    ).nonempty(),
    notify_existing: z.boolean().default(false)
})

/**
 * Zod schema for updating reminder schedules
 */
export const UpdateReminderScheduleSchema = z.object({
    enabled: z.boolean().optional(),
    template_id: z.string().nonempty().optional(),
    delays_iso: z.array(
        z.string().duration()
    ).nonempty().optional(),
    notify_existing: z.boolean().optional()
})

/**
 * Inferred types from Zod schemas
 */
export type CreateReminderSchedule = z.infer<typeof CreateReminderScheduleSchema>
export type UpdateReminderSchedule = z.infer<typeof UpdateReminderScheduleSchema>
