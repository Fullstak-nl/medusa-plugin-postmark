import { Container } from "../../../components/general/container"
import { Header } from "../../../components/general/header"
import { useMutation } from "@tanstack/react-query"
import { Badge, Text, Tooltip, toast } from "@medusajs/ui"
import { MedusaError } from "@medusajs/framework/utils"
import { sdk } from "../../../lib/sdk"
import _ from "lodash"

export const ValidateTemplatesSection = () => {
  const { mutateAsync, isPending, data } = useMutation({
    mutationFn: async () => {
      return await sdk.admin.postmark.reminderSchedules.validate()
    },
    onError: (err: MedusaError) => {
      toast.error("Validation Error", { description: err.message })
    }
  })

  return (
    <Container>
      <Header
        title="Validate Notification Data"
        actions={[
          ...(data ? [{
            type: "custom" as const,
            children: data.success ? (
              <Tooltip content={data.message}>
                <Badge color="green" size="small">
                  All Valid
                </Badge>
              </Tooltip>
            ) : (
              <Tooltip content={data.message}>
                <Badge color="red" size="small">
                  Missing Data ({data?.results?.length})
                </Badge>
              </Tooltip>
            )
          }] : []),
          {
            type: "button",
            props: {
              onClick: () => mutateAsync(),
              disabled: isPending,
              children: isPending ? "Validating..." : "Validate Templates",
              variant: "secondary"
            }
          }
        ]}
      />
      {data?.results && data.results.length > 0 && (
        <div className="px-6 py-4 space-y-3">
          {data.results.map((result) => (
            <div key={result.templateId} className="border rounded-md p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Text weight="plus">{result.templateName || "Unknown Template"}</Text>
                {result.templateId && (
                  <Text size="xsmall" className="text-ui-fg-subtle">
                    ID: {result.templateId}
                  </Text>
                )}
              </div>

              {result.missingVariables && Object.keys(result.missingVariables).length > 0 && (
                <div>
                  <Text size="small" weight="plus" className="text-ui-fg-subtle mb-1">
                    Missing Variables:
                  </Text>
                  <div className="flex flex-wrap gap-1">
                    {renderMissingVariables(result.missingVariables)}
                  </div>
                </div>
              )}

              {result.providedData && (
                <details className="text-sm">
                  <summary className="cursor-pointer text-ui-fg-subtle hover:text-ui-fg-base">
                    View Provided Data
                  </summary>
                  <pre className="mt-2 p-2 bg-ui-bg-subtle rounded text-xs overflow-auto max-h-48">
                    {JSON.stringify(result.providedData, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </Container >
  )
}

// Helper function to render missing variables object as a nested structure
const renderMissingVariables = (obj: Record<string, any>, prefix = ""): JSX.Element[] => {
  const elements: JSX.Element[] = []
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key

    if (value === null) {
      // Primitive missing value
      elements.push(
        <Badge key={fullKey} size="small" color="red">
          {fullKey}
        </Badge>
      )
    } else if (Array.isArray(value)) {
      // Array with missing nested values
      elements.push(
        <Badge key={fullKey} size="small" color="red">
          {fullKey}[0]
        </Badge>
      )
      if (value.length > 0 && typeof value[0] === 'object') {
        elements.push(...renderMissingVariables(value[0], `${fullKey}[0]`))
      }
    } else if (typeof value === 'object') {
      // Nested object with missing values
      elements.push(...renderMissingVariables(value, fullKey))
    }
  }

  return elements
}
