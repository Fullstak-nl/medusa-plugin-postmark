import { FetchError } from "@medusajs/js-sdk"
import {
    UseMutationOptions,
    UseQueryOptions,
    useMutation,
    useQuery,
    useQueryClient,
    keepPreviousData,
} from "@tanstack/react-query"
import { sdk } from "../lib/sdk"
import { CreateReminderScheduleRequest, ReminderScheduleListResponse, ReminderScheduleResponse, UpdateReminderScheduleRequest } from "../../types/reminder-schedules"
import { usePostmarkTemplates } from "./use-postmark-templates"
import { useMemo } from "react"

const POSTMARK_REMINDER_SCHEDULES_QUERY_KEY = "postmark_reminder_schedules" as const

export const postmarkReminderSchedulesQueryKeys = {
    all: [POSTMARK_REMINDER_SCHEDULES_QUERY_KEY] as const,
    schedules: () => [...postmarkReminderSchedulesQueryKeys.all, "schedules"] as const,
    schedule: (id: string) => [...postmarkReminderSchedulesQueryKeys.schedules(), id] as const,
}

const useReminderSchedules = (
    options?: UseQueryOptions<ReminderScheduleListResponse, FetchError>
) => {
    const { data, ...rest } = useQuery({
        queryFn: async () => sdk.admin.postmark.reminderSchedules.list(),
        queryKey: postmarkReminderSchedulesQueryKeys.schedules(),
        placeholderData: keepPreviousData,
        ...options,
    })

    return { ...data, ...rest }
}

export const useReminderSchedulesWithNames = (
    options?: UseQueryOptions<ReminderScheduleListResponse, FetchError>
) => {
    const { schedules, isPending: isSchedulesPending, ...rest } = useReminderSchedules(options)
    const { Templates: templates, isPending: isTemplatesPending } = usePostmarkTemplates()

    const schedulesWithNames = useMemo(() => {
        if (!schedules || !templates) return []

        return schedules.map(schedule => {
            const template = templates.find(t => t.TemplateId.toString() === schedule.template_id)
            return {
                ...schedule,
                template_name: template?.Name || template?.TemplateId.toString() || "-",
            }
        })
    }, [schedules, templates])

    return { schedules: schedulesWithNames, isPending: isSchedulesPending || isTemplatesPending, ...rest }
}

export const useReminderSchedule = (
    id: string,
    options?: UseQueryOptions<ReminderScheduleResponse, FetchError>
) => {
    const { data, ...rest } = useQuery({
        queryFn: async () => sdk.admin.postmark.reminderSchedules.get(id),
        queryKey: postmarkReminderSchedulesQueryKeys.schedule(id),
        placeholderData: keepPreviousData,
        ...options,
    })

    return { ...data, ...rest }
}

export const useCreateReminderSchedules = (
    options?: UseMutationOptions<
        ReminderScheduleResponse,
        FetchError,
        CreateReminderScheduleRequest
    >
) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: CreateReminderScheduleRequest) => sdk.admin.postmark.reminderSchedules.create(payload),
        onSuccess: async (data, variables, context) => {
            await queryClient.invalidateQueries({
                queryKey: postmarkReminderSchedulesQueryKeys.schedules(),
            })
            options?.onSuccess?.(data, variables, context)
        },
        ...options,
    })
}

export const useUpdateReminderSchedules = (
    id: string,
    options?: UseMutationOptions<
        ReminderScheduleResponse,
        FetchError,
        UpdateReminderScheduleRequest
    >
) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: UpdateReminderScheduleRequest) => sdk.admin.postmark.reminderSchedules.update(id, payload),
        onSuccess: async (data, variables, context) => {
            await queryClient.invalidateQueries({
                queryKey: postmarkReminderSchedulesQueryKeys.schedules(),
            })
            options?.onSuccess?.(data, variables, context)
        },
        ...options,
    })
}

export const useDeleteReminderSchedules = (
    options?: UseMutationOptions<
        { success: boolean },
        FetchError,
        string
    >
) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => sdk.admin.postmark.reminderSchedules.delete(id),
        onSuccess: async (data, variables, context) => {
            await queryClient.invalidateQueries({
                queryKey: postmarkReminderSchedulesQueryKeys.schedules(),
            })
            options?.onSuccess?.(data, variables, context)
        },
        ...options,
    })
}
