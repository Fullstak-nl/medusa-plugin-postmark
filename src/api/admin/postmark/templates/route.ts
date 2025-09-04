import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ServerClient, Models } from "postmark"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    try {
        const { limit: count, offset, q, order } = req.query as { q: string, order: string, limit: string, offset: string }

        // Get Postmark configuration from plugin options
        const pluginOptions = req.scope.resolve("postmarkModuleService")?.getOptions?.()
        const serverToken = pluginOptions?.server_api || process.env.POSTMARK_SERVER_TOKEN || process.env.POSTMARK_SERVER_API

        if (!serverToken) {
            return res.status(400).json({
                error: "Postmark server token not configured",
                message: "Please configure the Postmark server token in your plugin options"
            })
        }

        const client = new ServerClient(serverToken)

        // Build query parameters
        const queryParams: any = {
            count: parseInt(count),
            offset: parseInt(offset),
            templateType: Models.TemplateTypes.Standard
        }

        // Fetch templates from Postmark
        const templates = await client.getTemplates(queryParams)
        if (q)
            templates.Templates = templates.Templates.filter(
                (template) => template.Name.toLowerCase().includes((q as string).toLowerCase())
            )
        if (order)
            templates.Templates.sort((a, b) => {
                const ascending = !order?.startsWith("-")
                const field = order?.replace("-", "")
                if (ascending) {
                    return a[field]?.localeCompare(b[field])
                } else {
                    return b[field]?.localeCompare(a[field])
                }
            })

        res.json(templates)
    } catch (error) {
        console.error("Error fetching Postmark templates:", error)

        // Handle specific Postmark API errors
        if (error instanceof Error && error.message.includes("401")) {
            return res.status(401).json({
                error: "Invalid Postmark server token",
                message: "Please check your Postmark server token configuration"
            })
        }

        res.status(500).json({
            error: "Failed to fetch templates",
            message: error instanceof Error ? error.message : "Unknown error"
        })
    }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
    try {
        const { Name, Alias, Subject, HtmlBody, TextBody, TemplateType, LayoutTemplate } = req.body as {
            Name: string
            Alias?: string
            Subject: string
            HtmlBody: string
            TextBody?: string
            TemplateType?: string
            LayoutTemplate?: string
        }

        // Validate required fields
        if (!Name || !Subject || !HtmlBody) {
            return res.status(400).json({
                error: "Missing required fields",
                message: "Name, Subject, and HtmlBody are required"
            })
        }

        // Get Postmark configuration from plugin options
        const pluginOptions = req.scope.resolve("postmarkModuleService")?.getOptions?.()
        const serverToken = pluginOptions?.server_api || process.env.POSTMARK_SERVER_TOKEN || process.env.POSTMARK_SERVER_API

        if (!serverToken) {
            return res.status(400).json({
                error: "Postmark server token not configured",
                message: "Please configure the Postmark server token in your plugin options"
            })
        }

        const client = new ServerClient(serverToken)

        // Create template in Postmark
        const template = await client.createTemplate({
            Name,
            Alias,
            Subject,
            HtmlBody,
            TextBody,
            TemplateType: (TemplateType as Models.TemplateTypes) || Models.TemplateTypes.Standard,
            LayoutTemplate
        })

        res.status(201).json(template)
    } catch (error) {
        console.error("Error creating Postmark template:", error)

        // Handle specific Postmark API errors
        if (error instanceof Error && error.message.includes("401")) {
            return res.status(401).json({
                error: "Invalid Postmark server token",
                message: "Please check your Postmark server token configuration"
            })
        }

        res.status(500).json({
            error: "Failed to create template",
            message: error instanceof Error ? error.message : "Unknown error"
        })
    }
}
