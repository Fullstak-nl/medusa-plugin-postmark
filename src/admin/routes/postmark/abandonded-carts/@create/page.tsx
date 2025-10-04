import { Heading } from "@medusajs/ui"
import { RouteDrawer } from "../../../../components/modals/route-drawer"
import { CreateReminderScheduleForm } from "./create-form"

const CreateAbandonedCartPage = () => {
    return (
        <RouteDrawer>
            <RouteDrawer.Header>
                <RouteDrawer.Title asChild>
                    <Heading>Create schedule</Heading>
                </RouteDrawer.Title>
                <RouteDrawer.Description className="sr-only">
                    Create a new reminder schedule for abandoned carts
                </RouteDrawer.Description>
            </RouteDrawer.Header>
            <CreateReminderScheduleForm />
        </RouteDrawer>
    )
}
export default CreateAbandonedCartPage
