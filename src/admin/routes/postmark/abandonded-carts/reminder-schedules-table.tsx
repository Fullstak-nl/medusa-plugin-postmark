import {
  Badge,
  createDataTableColumnHelper,
  DataTable,
  Heading,
  toast,
  useDataTable,
  usePrompt,
} from "@medusajs/ui"
import { useLocale } from "react-aria"
import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { PencilSquare, Trash } from "@medusajs/icons"
import { useTranslation } from "react-i18next"
import { DataTableAction } from "../../../components/data-table-action"
import { ReminderSchedule } from "../../../../types/reminder-schedules"
import { useDeleteReminderSchedules, useReminderSchedules } from "../../../hooks/use-reminder-schedules"
import { Container } from "../../../components/general/container"
import { DurationFormat } from "@formatjs/intl-durationformat"
import { Temporal } from "temporal-polyfill"

const ReminderSchedulesTable = () => {
  const { t } = useTranslation("postmark")

  const { schedules = [], isPending } = useReminderSchedules({ fields: "+template.*" })
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
          <Heading>{t("reminder_schedules.title")}</Heading>
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
  const { t } = useTranslation("postmark")
  const { locale } = useLocale()
  const formatter = useMemo(() => {
    return new DurationFormat(locale, { style: 'long' })
  }, [locale])
  const navigate = useNavigate()
  const prompt = usePrompt()

  const { mutateAsync } = useDeleteReminderSchedules()

  const handleDelete = async (schedule: ReminderSchedule) => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("reminder_schedules.delete.confirmation"),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(schedule.id, {
      onSuccess: () => {
        toast.success(
          t("reminder_schedules.delete.successToast")
        )
      },
      onError: (e) => {
        toast.error(e.message)
      },
    })
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor("template.Name", {
        header: t("fields.template"),
      }),
      columnHelper.accessor("delays_iso", {
        header: t("reminder_schedules.delays"),
        cell: ({ getValue }) => {
          const delays_iso = getValue()
          if (!delays_iso || delays_iso.length === 0) return '-'

          return (
            <div className="flex flex-wrap gap-1">
              {delays_iso.sort().map((duration, index) => (
                <Badge key={index} size="small" color="grey">
                  {formatter.format(Temporal.Duration.from(duration))}
                </Badge>
              ))}
            </div>
          )
        }
      }),
      columnHelper.accessor("enabled", {
        header: t("fields.status"),
        cell: ({ getValue }) => {
          const enabled = getValue()
          return (
            <Badge color={enabled ? "green" : "grey"} size="xsmall">
              {enabled ? t("statuses.enabled") : t("statuses.disabled")}
            </Badge>
          )
        },
      }),
      columnHelper.accessor("notify_existing", {
        header: t("reminder_schedules.notify_existing"),
        cell: ({ getValue }) => {
          const notifyExisting = getValue()
          return (
            <Badge color={notifyExisting ? "orange" : "grey"} size="xsmall">
              {notifyExisting ? t("filters.radio.yes") : t("filters.radio.no")}
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
