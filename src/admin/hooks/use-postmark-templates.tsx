import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query"
import { sdk } from "../lib/sdk"
import { PostmarkTemplate } from "../../types/templates"
import { HttpTypes } from "@medusajs/framework/types"
import { FetchError } from "@medusajs/js-sdk"

type TemplatesResponse = {
    TotalCount: number
    Templates: PostmarkTemplate[]
}

type QueryInput = HttpTypes.FindParams & {
    id?: string
    q?: string
    templateType?: "Standard" | "Layout"
}

const POSTMARK_TEMPLATES_QUERY_KEY = "postmark_templates" as const

const postmarkTemplatesQueryKeys = {
    all: [POSTMARK_TEMPLATES_QUERY_KEY] as const,
    templates: (query?: Record<string, any>) => [...postmarkTemplatesQueryKeys.all, "templates", query ? { query } : undefined].filter(
        (k) => !!k
    ),
    template: (id: string, query?: Record<string, any>) => [...postmarkTemplatesQueryKeys.templates(), id, query ? { query } : undefined].filter(
        (k) => !!k
    )
}

export const usePostmarkTemplates = (
    query?: QueryInput,
    options?: Omit<
        UseQueryOptions<
            TemplatesResponse,
            FetchError,
            TemplatesResponse,
            QueryKey
        >,
        "queryFn" | "queryKey"
    >) => {
    const { data, ...rest } = useQuery({
        queryKey: postmarkTemplatesQueryKeys.templates(query),
        queryFn: () => sdk.admin.postmark.templates.list(query),
        ...options
    })
    return { ...data, ...rest }
}
