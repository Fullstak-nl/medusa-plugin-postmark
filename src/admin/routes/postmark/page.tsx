import { defineRouteConfig } from "@medusajs/admin-sdk"
import {
  Button,
  Container,
  createDataTableColumnHelper,
  DataTable,
  DataTablePaginationState,
  DataTableSortingState,
  Tabs,
  toast,
  useDataTable,
} from "@medusajs/ui"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { sdk } from "../../lib/sdk"
import { PencilSquare, Trash, SquareTwoStack } from "@medusajs/icons"
import React, { useState, useMemo, useCallback } from "react"
import { t } from "@mikro-orm/core"
import { Link, useNavigate } from "react-router-dom"

type PostmarkTemplate = {
  Name: string
  Alias: string
  TemplateType: string
  LayoutTemplate: string | null
  TemplateId: number
}

const columnHelper = createDataTableColumnHelper<PostmarkTemplate>()
// const filterHelper = createDataTableFilterHelper<PostmarkTemplate>()

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

// const filters = []

// const layoutFilters = [
//   filterHelper.accessor("Name", {
//     type: "select",
//     label: "Name",
//     options: [],
//   }),
// ]
const limit = 15

const PostmarkPage = () => {
  const [activeTab, setActiveTab] = useState<string>("templates")

  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: limit,
    pageIndex: 0,
  })
  const [search, setSearch] = useState<string>("")
  //const [filtering, setFiltering] = useState<DataTableFilteringState>({})
  const [sorting, setSorting] = useState<DataTableSortingState | null>(null)
  const offset = useMemo(() => {
    return pagination.pageIndex * limit
  }, [pagination])

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
  const { data, isPending, refetch } = useQuery<{ Templates: PostmarkTemplate[], TotalCount: number }>({
    queryFn: () => sdk.client.fetch("/admin/postmark/templates", {
      query: {
        limit,
        offset,
        q: search,
        order: sorting ? `${sorting.desc ? "-" : ""}${sorting.id}` : undefined,
      }
    }),
    placeholderData: keepPreviousData,
    queryKey: [["postmark-templates", limit, offset, search, sorting?.id, sorting?.desc]],
  })

  const { data: layoutData, isPending: isLayoutPending, refetch: refetchLayouts } = useQuery<{ Templates: PostmarkTemplate[], TotalCount: number }>({
    queryFn: () => sdk.client.fetch("/admin/postmark/layouts", {
      query: {
        limit,
        offset,
        q: search,
        order: sorting ? `${sorting.desc ? "-" : ""}${sorting.id}` : undefined,
      }
    }),
    placeholderData: keepPreviousData,
    queryKey: [["postmark-layouts", limit, offset, search, sorting?.id, sorting?.desc]],
  })
  const columns = createColumns(handleDeleteTemplate)

  const rowHref = (row) => `${row.id}`
  const navigate = useNavigate()
  const onRowClick = useCallback(
    (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>, row) => {
      if (!rowHref) {
        return
      }

      const href = rowHref(row)

      if (event.metaKey || event.ctrlKey || event.button === 1) {
        window.open(href, "_blank", "noreferrer")
        return
      }

      if (event.shiftKey) {
        window.open(href, undefined, "noreferrer")
        return
      }

      navigate(href)
    },
    [navigate, rowHref]
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
    // filtering: {
    //   state: filtering,
    //   onFilteringChange: setFiltering,
    // },
    // filters,
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
    onRowClick,
    // filters: layoutFilters,
    // filtering: { state: layoutFiltering, onFilteringChange: setLayoutFiltering },
    // sorting: { state: layoutSorting, onSortingChange: setLayoutSorting },
    // search: { state: layoutSearch, onSearchChange: setLayoutSearch },
    // pagination: { state: layoutPagination, onPaginationChange: setLayoutPagination },
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
    search: {
      state: search,
      onSearchChange: setSearch,
    },
    // filtering: {
    //   state: filtering,
    //   onFilteringChange: setFiltering,
    // },
    // filters,
    sorting: {
      // Pass the pagination state and updater to the table instance
      state: sorting,
      onSortingChange: setSorting,
    },
    isLoading: isLayoutPending,
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
              <DataTable.Search placeholder={activeTab === "templates" ? "Jump to a template" : "Jump to a layout"} />
              <DataTable.SortingMenu tooltip="Sort" />
              {/* <DataTable.FilterMenu tooltip="Filter" /> */}
              <DataTableAction
                label={("actions.create")}
                to={"create"}
              />
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

type DataTableActionProps = {
  label: string
  disabled?: boolean
} & (
    | {
      to: string
    }
    | {
      onClick: () => void
    }
  )

const DataTableAction = ({
  label,
  disabled,
  ...props
}: DataTableActionProps) => {
  const buttonProps = {
    size: "small" as const,
    disabled: disabled ?? false,
    type: "button" as const,
    variant: "secondary" as const,
  }

  if ("to" in props) {
    return (
      <Button {...buttonProps} asChild>
        <Link to={props.to}>{label}</Link>
      </Button>
    )
  }

  return (
    <Button {...buttonProps} onClick={props.onClick}>
      {label}
    </Button>
  )
}

