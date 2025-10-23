import { Heading } from "@medusajs/ui"
import { RouteDrawer } from "../../../../../components/modals/route-drawer"
import { EditReminderScheduleForm } from "./edit-form"
import { useReminderSchedule } from "../../../../../hooks/use-reminder-schedules"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"

const EditAbandonedCartPage = () => {
    const { t } = useTranslation("postmark")
    const { id = "" } = useParams()
    const { schedule, isPending } = useReminderSchedule(id)
    return (
        <RouteDrawer>
            <RouteDrawer.Header>
                <RouteDrawer.Title asChild>
                    <Heading>{t("reminder_schedules.edit_title")}</Heading>
                </RouteDrawer.Title>
                <RouteDrawer.Description className="sr-only">
                    {t("reminder_schedules.edit_description")}
                </RouteDrawer.Description>
            </RouteDrawer.Header>
            {schedule && !isPending && <EditReminderScheduleForm schedule={schedule} />}
        </RouteDrawer>
    )
}
export default EditAbandonedCartPage

