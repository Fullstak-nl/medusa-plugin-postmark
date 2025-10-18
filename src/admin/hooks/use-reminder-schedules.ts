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
import { HttpTypes } from "@medusajs/framework/types"

const POSTMARK_REMINDER_SCHEDULES_QUERY_KEY = "postmark_reminder_schedules" as const

const postmarkReminderSchedulesQueryKeys = {
    all: [POSTMARK_REMINDER_SCHEDULES_QUERY_KEY] as const,
    schedules: (query?: Record<string, any>) => [...postmarkReminderSchedulesQueryKeys.all, "schedules", query ? { query } : undefined].filter(
        (k) => !!k
    ),
    schedule: (id: string, query?: Record<string, any>) => [...postmarkReminderSchedulesQueryKeys.schedules(), id, query ? { query } : undefined].filter(
        (k) => !!k
    )
}

export const useReminderSchedules = (
    query?: HttpTypes.FindParams,
    options?: UseQueryOptions<ReminderScheduleListResponse, FetchError>
) => {
    const { data, ...rest } = useQuery({
        queryFn: async () => sdk.admin.postmark.reminderSchedules.list(query),
        queryKey: postmarkReminderSchedulesQueryKeys.schedules(query),
        placeholderData: keepPreviousData,
        ...options,
    })

    return { ...data, ...rest }
}

export const useReminderSchedule = (
    id: string,
    query?: Record<string, any>,
    options?: UseQueryOptions<ReminderScheduleResponse, FetchError>
) => {
    const { data, ...rest } = useQuery({
        queryFn: async () => sdk.admin.postmark.reminderSchedules.retrieve(id, query),
        queryKey: postmarkReminderSchedulesQueryKeys.schedule(id, query),
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
