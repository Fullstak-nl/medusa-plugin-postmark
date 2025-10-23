import { Heading } from "@medusajs/ui"
import { RouteDrawer } from "../../../../components/modals/route-drawer"
import { CreateReminderScheduleForm } from "./create-form"
import { useTranslation } from "react-i18next"

const CreateAbandonedCartPage = () => {
    const { t } = useTranslation("postmark")
    return (
        <RouteDrawer>
            <RouteDrawer.Header>
                <RouteDrawer.Title asChild>
                    <Heading>{t("reminder_schedules.create_title")}</Heading>
                </RouteDrawer.Title>
                <RouteDrawer.Description className="sr-only">
                    {t("reminder_schedules.create_description")}
                </RouteDrawer.Description>
            </RouteDrawer.Header>
            <CreateReminderScheduleForm />
        </RouteDrawer>
    )
}
export default CreateAbandonedCartPage
