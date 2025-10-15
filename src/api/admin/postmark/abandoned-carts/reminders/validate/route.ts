import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { notificationDataWorkflow } from "../../../../../../workflows/notification-data"
import { ABANDONED_CART_MODULE } from "../../../../../../modules/abandoned-cart"
import { ValidationResponse, ValidationResult } from "../../../../../../types/validation"
import { MedusaError } from "@medusajs/framework/utils"

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
                delay: parseInt(schedule.offset_hours[0] || "24"),
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
            const templateDetails = await postmarkModuleService.getTemplate(template.TemplateId)
            const validationResponse = await postmarkModuleService.validateTemplate({
                Subject: templateDetails.Subject || "",
                HtmlBody: templateDetails.HtmlBody || "",
                TextBody: templateDetails.TextBody || "",
                TestRenderModel: notification.data || {}
            })

            const missingVariables = filterMissing(validationResponse.SuggestedTemplateModel, notification.data)

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
        logger.error("Error validating templates:", error)
        throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, `Failed to validate templates: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
}

const filterMissing = (suggestedObj: Record<string, any>, providedObj: Record<string, any> | undefined | null): Record<string, any> => {
    const result: Record<string, any> = {}

    for (const key in suggestedObj) {
        const suggestedValue = suggestedObj[key]
        const providedValue = providedObj?.[key]

        if (suggestedValue && typeof suggestedValue === 'object' && !Array.isArray(suggestedValue)) {
            // It's a nested object
            const nestedMirror = filterMissing(suggestedValue, providedValue)
            if (Object.keys(nestedMirror).length > 0 || providedValue === undefined || providedValue === null) {
                result[key] = Object.keys(nestedMirror).length > 0 ? nestedMirror : null
            }
        } else if (Array.isArray(suggestedValue)) {
            // It's an array
            if (!Array.isArray(providedValue) || providedValue.length === 0) {
                result[key] = null
            } else if (suggestedValue.length > 0 && typeof suggestedValue[0] === 'object') {
                // Compare first element of array if it's an object
                const nestedMirror = filterMissing(suggestedValue[0], providedValue[0])
                if (Object.keys(nestedMirror).length > 0) {
                    result[key] = [nestedMirror]
                }
            }
        } else {
            // It's a primitive value
            // Check if the value exists in provided data
            if (providedValue === undefined || providedValue === null) {
                result[key] = null
            }
        }
    }

    return result
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
