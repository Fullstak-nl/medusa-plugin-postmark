import { sdk } from "../../lib/sdk"
import { useQuery } from "@tanstack/react-query"

type PostmarkServerOptions = {
    server_id: string
}

export const usePostmarkOptions = () => {
    const { data, isPending, error } = useQuery<PostmarkServerOptions>({
        queryFn: () => sdk.client.fetch("/admin/postmark/options"),
        queryKey: ["postmark-options"],
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    return {
        options: data,
        isLoading: isPending,
        error,
    }
}
