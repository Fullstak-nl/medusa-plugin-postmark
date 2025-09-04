import React, { useMemo, useState } from "react"
import { Container, Heading, DataTable, DropdownMenu, IconButton, useDataTable, createDataTableColumnHelper, createDataTableFilterHelper, Tabs, toast } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { sdk } from "../../lib/sdk"
import type { DataTableFilteringState, DataTablePaginationState, DataTableSortingState } from "@medusajs/ui"
import { PencilSquare, Trash, SquareTwoStack } from "@medusajs/icons"

type PostmarkTemplate = {
  Name: string
  Alias: string
  TemplateType: string
  LayoutTemplate: string | null
  TemplateId: number
}

const columnHelper = createDataTableColumnHelper<PostmarkTemplate>()
const filterHelper = createDataTableFilterHelper<PostmarkTemplate>()

const createColumns = (onDelete: (templateId: number) => void) => [
  columnHelper.accessor("Name", { header: "Name", enableSorting: true }),
  columnHelper.accessor("LayoutTemplate", { header: "Layout", enableSorting: true }),
  columnHelper.action({
    actions: [
      {
        label: ("actions.edit"),
        icon: <PencilSquare />,
        onClick: (ctx) => {
          //navigate(`${ctx.row.original.id}/edit`)
        },
      },
      {
        label: ("actions.duplicate"),
        icon: <SquareTwoStack />,
        onClick: (ctx) => {
          //navigate(`${ctx.row.original.id}/edit`)
        },
      },
      {
        label: ("actions.delete"),
        icon: <Trash />,
        onClick: async (ctx) => {
          await onDelete(ctx.row.original.TemplateId)
        },
      },
    ]
  }),
]

const filters = []

const layoutFilters = [
  filterHelper.accessor("Name", {
    type: "select",
    label: "Name",
    options: [],
  }),
]

const PostmarkPage = () => {
  const [activeTab, setActiveTab] = useState<string>("templates")

  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: limit,
    pageIndex: 0,
  })
  const [search, setSearch] = useState<string>("")
  const [filtering, setFiltering] = useState<DataTableFilteringState>({})
  const [sorting, setSorting] = useState<DataTableSortingState | null>(null)
  const offset = useMemo(() => {
    return pagination.pageIndex * limit
  }, [pagination])

  // Layout table state
  const [layoutPagination, setLayoutPagination] = useState<DataTablePaginationState>({
    pageSize: limit,
    pageIndex: 0,
  })
  const [layoutSearch, setLayoutSearch] = useState<string>("")
  const [layoutFiltering, setLayoutFiltering] = useState<DataTableFilteringState>({})
  const [layoutSorting, setLayoutSorting] = useState<DataTableSortingState | null>(null)
  const layoutOffset = useMemo(() => {
    return layoutPagination.pageIndex * limit
  }, [layoutPagination])


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
      if (activeTab === "templates") {
        refetch()
      } else {
        refetchLayouts()
      }
    } catch (error) {
      toast.error("Failed to delete template", {
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    }
  }

  const { data, isLoading, refetch } = useQuery<{ Templates: PostmarkTemplate[], TotalCount: number }>({
    queryFn: () => sdk.client.fetch("/admin/postmark/templates", {
      query: {
        limit,
        offset,
        q: search,
        order: sorting ? `${sorting.desc ? "-" : ""}${sorting.id}` : undefined,
      },
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    }),
    
    queryKey: ["postmark-templates"],
  })

  const { data: layoutData, isLoading: isLayoutLoading, refetch: refetchLayouts } = useQuery<{ Templates: PostmarkTemplate[], TotalCount: number }>({
    queryFn: () => sdk.client.fetch("/admin/postmark/layouts", {
      query: {
        limit,
        offset: layoutOffset,
        q: layoutSearch,
        order: layoutSorting ? `${layoutSorting.desc ? "-" : ""}${layoutSorting.id}` : undefined,
      },
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    }),
    queryKey: ["postmark-layouts"],

  })
  const columns = createColumns(handleDeleteTemplate)

  const table = useDataTable<PostmarkTemplate>({
    columns,
    data: data?.Templates || [],
    getRowId: (row) => row.TemplateId.toString(),
    rowCount: data?.TotalCount || 0,
    isLoading,
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
    search: {
      state: search,
      onSearchChange: setSearch,
    },
    filtering: {
      state: filtering,
      onFilteringChange: setFiltering,
    },
    filters,
    sorting: {
      // Pass the pagination state and updater to the table instance
      state: sorting,
      onSortingChange: setSorting,
    },
  })

  const layoutTable = useDataTable<PostmarkTemplate>({
    columns,
    data: layoutData?.Templates || [],
    getRowId: (row) => row.TemplateId.toString(),
    rowCount: layoutData?.TotalCount || 0,
    filters: layoutFilters,
    filtering: { state: layoutFiltering, onFilteringChange: setLayoutFiltering },
    sorting: { state: layoutSorting, onSortingChange: setLayoutSorting },
    search: { state: layoutSearch, onSearchChange: setLayoutSearch },
    pagination: { state: layoutPagination, onPaginationChange: setLayoutPagination },
    isLoading: isLayoutLoading,
  })

  return (
    <Container className="p-0">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <DataTable instance={activeTab === "templates" ? table : layoutTable}>
          <DataTable.Toolbar>
            <Tabs.List>
              <Tabs.Trigger value="templates">Templates</Tabs.Trigger>
              <Tabs.Trigger value="layouts">Layouts</Tabs.Trigger>
            </Tabs.List>
            <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
              {/* <DataTable.FilterMenu tooltip="Filter" /> */}
              <DataTable.SortingMenu tooltip="Sort" />
              <DataTable.Search placeholder={activeTab === "templates" ? "Jump to a template" : "Jump to a layout"} />
            </div>
          </DataTable.Toolbar>
          <DataTable.Table />
          <DataTable.Pagination />
        </DataTable>
      </Tabs>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Postmark Templates",
})

export default PostmarkPage


const limit = 15
