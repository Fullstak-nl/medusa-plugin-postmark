import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ServerClient, Models } from "postmark"

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({
                error: "Template ID is required"
            })
        }

        // Validate template ID is a number
        const templateId = parseInt(id as string)
        if (isNaN(templateId)) {
            return res.status(400).json({
                error: "Invalid template ID",
                message: "Template ID must be a valid number"
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

        // Delete template from Postmark
        await client.deleteTemplate(templateId)

        res.json({ success: true, message: "Template deleted successfully" })
    } catch (error) {
        console.error("Error deleting Postmark template:", error)

        // Handle specific Postmark API errors
        if (error instanceof Error && error.message.includes("401")) {
            return res.status(401).json({
                error: "Invalid Postmark server token",
                message: "Please check your Postmark server token configuration"
            })
        }

        if (error instanceof Error && error.message.includes("404")) {
            return res.status(404).json({
                error: "Template not found",
                message: "The specified template does not exist"
            })
        }

        res.status(500).json({
            error: "Failed to delete template",
            message: error instanceof Error ? error.message : "Unknown error"
        })
    }
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({
                error: "Template ID is required"
            })
        }

        // Validate template ID is a number
        const templateId = parseInt(id as string)
        if (isNaN(templateId)) {
            return res.status(400).json({
                error: "Invalid template ID",
                message: "Template ID must be a valid number"
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

        // Get template details from Postmark
        const template = await client.getTemplate(templateId)

        res.json(template)
    } catch (error) {
        console.error("Error fetching Postmark template:", error)

        // Handle specific Postmark API errors
        if (error instanceof Error && error.message.includes("401")) {
            return res.status(401).json({
                error: "Invalid Postmark server token",
                message: "Please check your Postmark server token configuration"
            })
        }

        if (error instanceof Error && error.message.includes("404")) {
            return res.status(404).json({
                error: "Template not found",
                message: "The specified template does not exist"
            })
        }

        res.status(500).json({
            error: "Failed to fetch template",
            message: error instanceof Error ? error.message : "Unknown error"
        })
    }
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
    try {
        const { id } = req.params
        const { Name, Alias, Subject, HtmlBody, TextBody, TemplateType, LayoutTemplate } = req.body as {
            Name: string
            Alias?: string
            Subject: string
            HtmlBody: string
            TextBody?: string
            TemplateType?: string
            LayoutTemplate?: string
        }

        if (!id) {
            return res.status(400).json({
                error: "Template ID is required"
            })
        }

        // Validate template ID is a number
        const templateId = parseInt(id as string)
        if (isNaN(templateId)) {
            return res.status(400).json({
                error: "Invalid template ID",
                message: "Template ID must be a valid number"
            })
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

        // Update template in Postmark
        const template = await client.editTemplate(templateId, {
            Name,
            Alias,
            Subject,
            HtmlBody,
            TextBody,
            TemplateType: (TemplateType as Models.TemplateTypes) || Models.TemplateTypes.Standard,
            LayoutTemplate
        })

        res.json(template)
    } catch (error) {
        console.error("Error updating Postmark template:", error)

        // Handle specific Postmark API errors
        if (error instanceof Error && error.message.includes("401")) {
            return res.status(401).json({
                error: "Invalid Postmark server token",
                message: "Please check your Postmark server token configuration"
            })
        }

        if (error instanceof Error && error.message.includes("404")) {
            return res.status(404).json({
                error: "Template not found",
                message: "The specified template does not exist"
            })
        }

        res.status(500).json({
            error: "Failed to update template",
            message: error instanceof Error ? error.message : "Unknown error"
        })
    }
}
