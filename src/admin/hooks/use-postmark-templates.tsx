import { useQuery } from "@tanstack/react-query"
import { sdk } from "../lib/sdk"
import { PostmarkTemplate } from "../../types/templates"

type TemplatesResponse = {
    TotalCount: number
    Templates: PostmarkTemplate[]
}

export const usePostmarkTemplates = (queryParams?: {
    limit?: number
    offset?: number
    q?: string
    order?: string
}) => {
    const { data, ...rest } = useQuery({
        queryKey: ["postmark", "templates", queryParams],
        queryFn: async (): Promise<TemplatesResponse> => {
            const searchParams = new URLSearchParams()

            if (queryParams?.limit) {
                searchParams.append("limit", queryParams.limit.toString())
            }
            if (queryParams?.offset) {
                searchParams.append("offset", queryParams.offset.toString())
            }
            if (queryParams?.q) {
                searchParams.append("q", queryParams.q)
            }
            if (queryParams?.order) {
                searchParams.append("order", queryParams.order)
            }

            return sdk.client.fetch(`/admin/postmark/templates?${searchParams.toString()}`, {
                method: "GET",
            })
        }
    })
    return { ...data, ...rest }
}
