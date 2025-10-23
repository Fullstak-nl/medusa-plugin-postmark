import { useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, DataTable, Tabs } from "@medusajs/ui"
import { usePostmarkOptions } from "../../hooks/use-postmark-options"
import { usePostmarkDataTable } from "../../hooks/use-postmark-table"
import { DataTableAction } from "../../components/data-table-action"
import { useTranslation } from "react-i18next"

const PostmarkPage = () => {
  const { t } = useTranslation("postmark")
  const { options: { server_id: serverId } = {} } = usePostmarkOptions()
  const templatesTable = usePostmarkDataTable({ type: "template", serverId })
  const layoutsTable = usePostmarkDataTable({ type: "layout", serverId })

  const [activeTab, setActiveTab] = useState<string>("template")
  const currentTable = activeTab === "template" ? templatesTable : layoutsTable

  const createUrl = serverId
    ? `https://account.postmarkapp.com/servers/${serverId}/templates/starter/new-${activeTab}`
    : "#"

  const paginationTranslations = {
    of: t("general.of"),
    results: t("general.results"),
    pages: t("general.pages"),
    prev: t("general.prev"),
    next: t("general.next"),
  }

  return (
    <Container className="p-0">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <DataTable instance={currentTable.table}>
          <DataTable.Toolbar>
            <Tabs.List>
              <Tabs.Trigger value="template">{t("templates.title")}</Tabs.Trigger>
              <Tabs.Trigger value="layout">{t("layouts.title")}</Tabs.Trigger>
            </Tabs.List>
            <div className="flex gap-2 ml-auto">
              <DataTable.Search placeholder={t("filters.searchLabel")} />
              <DataTableAction
                label={t("actions.create")}
                onClick={() => window.open(createUrl, "_blank")}
              />
            </div>
          </DataTable.Toolbar>
          <DataTable.Table />
          <DataTable.Pagination translations={paginationTranslations} />
        </DataTable>
      </Tabs>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Postmark Templates",
})

export default PostmarkPage

