import {
  Badge,
  createDataTableColumnHelper,
  DataTable,
  Heading,
  toast,
  useDataTable,
  usePrompt,
} from "@medusajs/ui"
import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { PencilSquare, Trash } from "@medusajs/icons"
import { useTranslation } from "react-i18next"
import { DataTableAction } from "../../../components/data-table-action"
import { ReminderSchedule } from "../../../../types/reminder-schedules"
import { useDeleteReminderSchedules, useReminderSchedulesWithNames } from "../../../hooks/use-reminder-schedules"
import { Container } from "../../../components/general/container"

const ReminderSchedulesTable = () => {
  const { t } = useTranslation()

  const { schedules = [], isPending } = useReminderSchedulesWithNames()
  const columns = useColumns()

  const table = useDataTable({
    columns,
    data: schedules,
    getRowId: (row) => row.id,
    rowCount: schedules?.length || 0,
    isLoading: isPending,
  })

  return (
    <Container>
      <DataTable instance={table}>
        <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <Heading>{t("reminderSchedules")}</Heading>
          <DataTableAction
            label={t("actions.create")}
            to="create"
          />
        </DataTable.Toolbar>
        <DataTable.Table />
      </DataTable>
    </Container>
  )
}

export default ReminderSchedulesTable

const columnHelper = createDataTableColumnHelper<ReminderSchedule>()

const useColumns = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const prompt = usePrompt()

  const { mutateAsync } = useDeleteReminderSchedules()

  const handleDelete = async (schedule: ReminderSchedule) => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("delete.confirmation"),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(schedule.id, {
      onSuccess: () => {
        toast.success(
          t("delete.successToast")
        )
      },
      onError: (e) => {
        toast.error(e.message)
      },
    })
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor("template_name", {
        header: t("template_name"),
      }),
      columnHelper.accessor("offset_hours", {
        header: t("offset_hours")
      }),
      columnHelper.accessor("enabled", {
        header: t("enabled"),
        cell: ({ getValue }) => {
          const enabled = getValue()
          return (
            <Badge color={enabled ? "green" : "grey"} size="xsmall">
              {enabled ? "Enabled" : "Disabled"}
            </Badge>
          )
        },
      }),
      columnHelper.action({
        actions: [
          {
            label: t("actions.edit"),
            icon: <PencilSquare />,
            onClick: (ctx) => {
              navigate(`edit/${ctx.row.original.id}`)
            },
          },
          {
            label: t("actions.delete"),
            icon: <Trash />,
            onClick: async (ctx) => {
              await handleDelete(ctx.row.original)
            },
          },
        ],
      }),
    ],
    [t, navigate]
  )
  return columns
}
