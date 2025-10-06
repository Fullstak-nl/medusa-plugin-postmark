import { useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, DataTable, Tabs } from "@medusajs/ui"
import { usePostmarkOptions } from "../../hooks/use-postmark-options"
import { usePostmarkDataTable } from "../../hooks/use-postmark-table"
import { DataTableAction } from "../../components/data-table-action"
import { useTranslation } from "react-i18next"

const PostmarkPage = () => {
  const { t } = useTranslation()
  const { options: { server_id: serverId } = {} } = usePostmarkOptions()
  const templatesTable = usePostmarkDataTable({ type: "template", serverId })
  const layoutsTable = usePostmarkDataTable({ type: "layout", serverId })

  const [activeTab, setActiveTab] = useState<string>("template")
  const currentTable = activeTab === "template" ? templatesTable : layoutsTable

  const createUrl = serverId
    ? `https://account.postmarkapp.com/servers/${serverId}/templates/starter/new-${activeTab}`
    : "#"

  return (
    <Container className="p-0">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <DataTable instance={currentTable.table}>
          <DataTable.Toolbar>
            <Tabs.List>
              <Tabs.Trigger value="template">Templates</Tabs.Trigger>
              <Tabs.Trigger value="layout">Layouts</Tabs.Trigger>
            </Tabs.List>
            <div className="flex gap-2 ml-auto">
              <DataTable.Search placeholder={activeTab === "template" ? "Jump to a template" : "Jump to a layout"} />
              <DataTableAction
                label={t("actions.create")}
                onClick={() => window.open(createUrl, "_blank")}
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

