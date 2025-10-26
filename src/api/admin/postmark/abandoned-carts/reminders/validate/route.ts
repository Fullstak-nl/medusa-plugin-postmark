import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { notificationDataWorkflow } from "../../../../../../workflows/notification-data"
import { ABANDONED_CART_MODULE } from "../../../../../../modules/abandoned-cart"
import { ValidationResponse, ValidationResult } from "../../../../../../types/validation"
import { MedusaError } from "@medusajs/framework/utils"
import { Temporal } from "temporal-polyfill"

export async function POST(req: MedusaRequest, res: MedusaResponse<ValidationResponse>) {
    const logger = req.scope.resolve("logger")
    const abandonedCartModuleService = req.scope.resolve(ABANDONED_CART_MODULE)
    const postmarkModuleService = req.scope.resolve("postmarkModuleService")

    try {
        // Get all reminder schedules
        const schedules = await abandonedCartModuleService.listReminderSchedules()

        if (!schedules?.length) {
            return res.json({
                success: true,
                message: "No reminder schedules found to validate",
                results: []
            })
        }

        const { Templates: templates } = await postmarkModuleService.getTemplates({ count: 500 })

        // Create mock notification data for each schedule
        const mockCartsGrouped = schedules.map((schedule) => [
            {
                delay: Temporal.Duration.from(schedule.delays_iso[0]).total({ unit: "hours", relativeTo: Temporal.Now.plainDateISO() }),
                template: schedule.template_id,
                schedule
            },
            [mockCart]
        ])

        // Run the notification data workflow with mock data
        const { result } = await notificationDataWorkflow(req.scope).run({
            input: { carts: mockCartsGrouped as any }
        })

        const notificationData = result.notificationData

        // Validate each notification against its template
        const validationResults: ValidationResult[] = []

        for (const notification of notificationData) {
            const template = templates.find(
                (t) => t.Alias === notification.template || t.TemplateId.toString() === notification.template
            )

            if (!template) {
                throw new MedusaError(MedusaError.Types.INVALID_DATA, `Template with ID or Alias '${notification.template}' not found in Postmark`)
            }

            // Use Postmark's validation endpoint
            // Pass an empty object to get ALL required variables in SuggestedTemplateModel
            const templateDetails = await postmarkModuleService.getTemplate(template.TemplateId)
            const { SuggestedTemplateModel } = await postmarkModuleService.validateTemplate({
                Subject: templateDetails.Subject || "",
                HtmlBody: templateDetails.HtmlBody || "",
                TextBody: templateDetails.TextBody || "",
                TestRenderModel: {}
            })

            const missingVariables = filterMissing(SuggestedTemplateModel, notification.data)

            if (Object.keys(missingVariables).length > 0)
                validationResults.push({
                    templateId: template.TemplateId.toString(),
                    templateName: template.Name,
                    missingVariables,
                    providedData: notification.data,
                })
        }

        const allValid = validationResults.length === 0

        res.json({
            success: allValid,
            message: allValid
                ? "All templates have the required data from the notification workflow"
                : "Some templates are missing required data",
            results: validationResults,
        })

    } catch (error) {
        logger.error("medusa-plugin-postmark: Error validating templates:", error)
        throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, `Failed to validate templates: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
}

/**
 * Recursively compares a suggested template model with provided data
 * Returns only the keys that are missing or have missing nested values
 */
const filterMissing = (suggested: Record<string, any>, provided: Record<string, any> | undefined | null): Record<string, any> => {
    const missing: Record<string, any> = {}

    // If provided data is not an object, all suggested keys are missing
    if (!provided || typeof provided !== 'object' || Array.isArray(provided)) {
        const result = Object.keys(suggested).reduce((acc, key) => ({ ...acc, [key]: null }), {})
        return result
    }

    for (const key in suggested) {
        const suggestedVal = suggested[key]
        const providedVal = provided[key]
        // Check if the key exists in provided data (undefined or null means missing)
        const keyIsMissing = providedVal === undefined || providedVal === null

        if (Array.isArray(suggestedVal)) {
            // Handle arrays
            if (keyIsMissing || !Array.isArray(providedVal) || providedVal.length === 0) {
                missing[key] = null
            } else if (suggestedVal.length > 0 && typeof suggestedVal[0] === 'object' && !Array.isArray(suggestedVal[0])) {
                // Check nested object in array
                const nestedMissing = filterMissing(suggestedVal[0], providedVal[0])
                if (Object.keys(nestedMissing).length > 0) {
                    missing[key] = [nestedMissing]
                }
            }
        } else if (suggestedVal && typeof suggestedVal === 'object') {
            // Handle nested objects
            if (keyIsMissing) {
                // When parent is missing, recurse with null to get full nested structure
                const nestedMissing = filterMissing(suggestedVal, null)
                missing[key] = nestedMissing
            } else if (typeof providedVal !== 'object' || Array.isArray(providedVal)) {
                // Provided value is not an object when we expect one
                const nestedMissing = filterMissing(suggestedVal, null)
                missing[key] = nestedMissing
            } else {
                // Recursively check nested properties
                const nestedMissing = filterMissing(suggestedVal, providedVal)
                if (Object.keys(nestedMissing).length > 0) {
                    missing[key] = nestedMissing
                }
            }
        } else {
            // Handle primitive values
            if (keyIsMissing) {
                missing[key] = null
            }
        }
    }

    return missing
}

const mockCart: Record<string, any> = {
    id: "cart_mock_123",
    email: "customer@example.com",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    customer: {
        id: "cus_mock_123",
        email: "customer@example.com",
        first_name: "John",
        last_name: "Doe"
    },
    shipping_address: {
        first_name: "John",
        last_name: "Doe",
        address_1: "123 Main St",
        city: "New York",
        country_code: "US",
        postal_code: "10001"
    },
    items: [
        {
            id: "item_1",
            title: "Sample Product",
            quantity: 2,
            unit_price: 1999,
            thumbnail: "https://via.placeholder.com/150"
        },
        {
            id: "item_2",
            title: "Another Product",
            quantity: 1,
            unit_price: 2999,
            thumbnail: "https://via.placeholder.com/150"
        }
    ]
}
