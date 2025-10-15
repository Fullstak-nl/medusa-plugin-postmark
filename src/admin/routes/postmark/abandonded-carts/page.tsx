import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Outlet } from "react-router-dom"
import { SingleColumnLayout } from "../../../components/single-column-layout"
import ReminderSchedulesTable from "./reminder-schedules-table"
import { ValidateTemplatesSection } from './validate-templates-section'

const AbandonedCartsPage = () => {
  return (
    <SingleColumnLayout>
      <ReminderSchedulesTable />
      <ValidateTemplatesSection />
      <Outlet />
    </SingleColumnLayout>
  )
}

export default AbandonedCartsPage

export const config = defineRouteConfig({
  label: "Abandoned Carts",
})
