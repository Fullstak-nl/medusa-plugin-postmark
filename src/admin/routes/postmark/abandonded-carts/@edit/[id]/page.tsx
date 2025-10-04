import { Heading } from "@medusajs/ui"
import { RouteDrawer } from "../../../../../components/modals/route-drawer"
import { EditReminderScheduleForm } from "./edit-form"
import { useReminderSchedule } from "../../../../../hooks/use-reminder-schedules"
import { useParams } from "react-router-dom"

const EditAbandonedCartPage = () => {
    const { id = "" } = useParams()
    const { schedule, isPending } = useReminderSchedule(id)
    return (
        <RouteDrawer>
            <RouteDrawer.Header>
                <RouteDrawer.Title asChild>
                    <Heading>Edit schedule</Heading>
                </RouteDrawer.Title>
                <RouteDrawer.Description className="sr-only">
                    Edit the reminder schedule for abandoned carts
                </RouteDrawer.Description>
            </RouteDrawer.Header>
            {schedule && !isPending && <EditReminderScheduleForm schedule={schedule} />}
        </RouteDrawer>
    )
}
export default EditAbandonedCartPage

