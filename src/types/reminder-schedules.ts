import { z } from "zod"

/**
 * Base reminder schedule entity - represents the database model
 */
export interface ReminderSchedule {
    id: string
    enabled: boolean
    template_id: string
    offset_hours: string[]
    created_at: string
    updated_at: string
    deleted_at?: string
}

/**
 * Simplified reminder type for workflows - represents delay in hours and template
 */
export interface Reminder {
    delay: number
    template: string
}

/**
 * Request payload for creating a new reminder schedule
 */
export interface CreateReminderScheduleRequest {
    enabled: boolean
    template_id: string
    offset_hours: string[]
}

/**
 * Request payload for updating an existing reminder schedule
 */
export interface UpdateReminderScheduleRequest {
    enabled?: boolean
    template_id?: string
    offset_hours?: string[]
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
    schedules: ReminderSchedule
}

/**
 * Zod schema for creating reminder schedules
 */
export const CreateAbandonedCartReminderScheduleSchema = z.object({
    enabled: z.boolean(),
    template_id: z.string(),
    offset_hours: z.array(z.string())
})

/**
 * Zod schema for updating reminder schedules
 */
export const UpdateAbandonedCartReminderScheduleSchema = z.object({
    enabled: z.boolean().optional(),
    template_id: z.string().optional(),
    offset_hours: z.array(z.string()).optional()
})

/**
 * Inferred types from Zod schemas
 */
export type CreateReminderSchedule = z.infer<typeof CreateAbandonedCartReminderScheduleSchema>
export type UpdateReminderSchedule = z.infer<typeof UpdateAbandonedCartReminderScheduleSchema>
