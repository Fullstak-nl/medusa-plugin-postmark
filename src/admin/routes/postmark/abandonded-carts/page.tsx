
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Outlet } from "react-router-dom"
import { SingleColumnLayout } from "../../../components/single-column-layout"
import ReminderSchedulesTable from "./reminder-schedules-table"

const AbandonedCartsPage = () => {
  return (
    <SingleColumnLayout>
      <ReminderSchedulesTable />
      <Outlet />
    </SingleColumnLayout>
  )
}

export default AbandonedCartsPage

export const config = defineRouteConfig({
  label: "Abandoned Carts",
})
