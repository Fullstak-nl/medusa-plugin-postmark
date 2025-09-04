import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ServerClient } from "postmark"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
    try {
        const {
            To,
            From,
            Subject,
            HtmlBody,
            TextBody,
            TemplateId,
            TemplateModel,
            Attachments
        } = req.body as {
            To: string
            From: string
            Subject?: string
            HtmlBody?: string
            TextBody?: string
            TemplateId?: string | number
            TemplateModel?: Record<string, any>
            Attachments?: any[]
        }

        // Validate required fields
        if (!To || !From || (!Subject && !TemplateId)) {
            return res.status(400).json({
                error: "Missing required fields",
                message: "To, From, and either Subject or TemplateId are required"
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

        let result

        if (TemplateId) {
            // Send templated email
            result = await client.sendEmailWithTemplate({
                From,
                To,
                TemplateId: parseInt(TemplateId.toString()),
                TemplateModel: TemplateModel || {},
                Attachments: Attachments || []
            })
        } else {
            // Send simple email
            result = await client.sendEmail({
                From,
                To,
                Subject: Subject || "",
                HtmlBody: HtmlBody || "",
                TextBody,
                Attachments: Attachments || []
            })
        }

        res.json({
            success: true,
            messageId: result.MessageID,
            message: "Email sent successfully"
        })
    } catch (error) {
        console.error("Error sending email via Postmark:", error)

        // Handle specific Postmark API errors
        if (error instanceof Error && error.message.includes("401")) {
            return res.status(401).json({
                error: "Invalid Postmark server token",
                message: "Please check your Postmark server token configuration"
            })
        }

        if (error instanceof Error && error.message.includes("422")) {
            return res.status(422).json({
                error: "Invalid email data",
                message: "Please check your email parameters"
            })
        }

        res.status(500).json({
            error: "Failed to send email",
            message: error instanceof Error ? error.message : "Unknown error"
        })
    }
}
