import { DataTablePaginationState, DataTableSortingState, toast, useDataTable, createDataTableColumnHelper } from "@medusajs/ui"
import { useState, useMemo, useCallback } from "react"
import { sdk } from "../lib/sdk"
import { Trash } from "@medusajs/icons"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { PostmarkTemplate } from "../../types/templates"
import { useTranslation } from "react-i18next"

type UsePostmarkDataTableProps = {
    type: "template" | "layout"
    serverId?: string
}

export const usePostmarkDataTable = ({ type, serverId }: UsePostmarkDataTableProps) => {
    const [pagination, setPagination] = useState<DataTablePaginationState>({
        pageSize: limit,
        pageIndex: 0,
    })
    const [search, setSearch] = useState<string>("")
    const [sorting, setSorting] = useState<DataTableSortingState | null>(null)

    const offset = useMemo(() => {
        return pagination.pageIndex * limit
    }, [pagination])

    const { t } = useTranslation("postmark")

    const endpoint = type === "template" ? "/admin/postmark/templates" : "/admin/postmark/layouts"
    const queryKey = type === "template" ? "postmark-templates" : "postmark-layouts"

    const { data, isPending, refetch } = useQuery<{ Templates: PostmarkTemplate[], TotalCount: number }>({
        queryFn: () => sdk.client.fetch(endpoint, {
            query: {
                limit,
                offset,
                q: search,
                order: sorting ? `${sorting.desc ? "-" : ""}${sorting.id}` : undefined,
            }
        }),
        placeholderData: keepPreviousData,
        queryKey: [[queryKey, limit, offset, search, sorting?.id, sorting?.desc]],
    })

    const handleDeleteTemplate = async (templateId: number) => {
        try {
            await sdk.client.fetch(
                `/admin/postmark/templates/${templateId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Accept": "application/json",
                    },
                }
            )

            toast.success("Template deleted successfully")
            // Refresh the data
            refetch()
        } catch (error) {
            toast.error("Failed to delete template", {
                description: error instanceof Error ? error.message : "An unexpected error occurred",
            })
        }
    }

    const columns = useMemo(() => [
        columnHelper.accessor("Name", { header: t("fields.name"), enableSorting: true }),
        columnHelper.accessor("LayoutTemplate", { header: t("fields.layout"), enableSorting: true }),
        columnHelper.action({
            actions: [
                {
                    label: t("actions.delete"),
                    icon: <Trash />,
                    onClick: async (ctx) => {
                        await handleDeleteTemplate(ctx.row.original.TemplateId)
                    },
                },
            ]
        }),
    ], [t, handleDeleteTemplate])


    const onRowClick = useCallback(
        (_: unknown, row: any) => {
            if (!serverId) {
                return
            }
            const editUrl = `https://account.postmarkapp.com/servers/${serverId}/templates/${row.id}/edit`
            // Always open in a new tab regardless of modifier keys
            window.open(editUrl, "_blank", "noopener noreferrer")
        },
        [serverId]
    )

    const table = useDataTable<PostmarkTemplate>({
        columns,
        data: data?.Templates || [],
        getRowId: (row) => row.TemplateId.toString(),
        rowCount: data?.TotalCount || 0,
        isLoading: isPending,
        onRowClick,
        pagination: {
            state: pagination,
            onPaginationChange: setPagination,
        },
        search: {
            state: search,
            onSearchChange: setSearch,
        },
        sorting: {
            state: sorting,
            onSortingChange: setSorting,
        },
    })

    return {
        table,
        refetch,
    }
}

const limit = 15
const columnHelper = createDataTableColumnHelper<PostmarkTemplate>()

