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
}

/**
 * Request payload for updating an existing reminder schedule
 */
export interface UpdateReminderScheduleRequest {
    enabled?: boolean
    template_id?: string
    delays_iso?: string[] // ISO 8601 duration strings
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

// ISO 8601 duration regex pattern
const ISO_DURATION_REGEX = /^P(?:\d+Y)?(?:\d+M)?(?:\d+D)?(?:T(?:\d+H)?(?:\d+M)?(?:\d+(?:\.\d+)?S)?)?$/

/**
 * Zod schema for creating reminder schedules
 */
export const CreateReminderScheduleSchema = z.object({
    enabled: z.boolean(),
    template_id: z.string().nonempty(),
    delays_iso: z.array(
        z.string().regex(ISO_DURATION_REGEX, "Invalid ISO 8601 duration format")
    ).nonempty()
})

/**
 * Zod schema for updating reminder schedules
 */
export const UpdateReminderScheduleSchema = z.object({
    enabled: z.boolean().optional(),
    template_id: z.string().nonempty().optional(),
    delays_iso: z.array(
        z.string().regex(ISO_DURATION_REGEX, "Invalid ISO 8601 duration format")
    ).nonempty().optional()
})

/**
 * Inferred types from Zod schemas
 */
export type CreateReminderSchedule = z.infer<typeof CreateReminderScheduleSchema>
export type UpdateReminderSchedule = z.infer<typeof UpdateReminderScheduleSchema>
