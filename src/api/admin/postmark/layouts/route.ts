import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ServerClient, Models } from "postmark"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    try {
        const { count = 100, offset = 0 } = req.query

        // Get Postmark configuration from plugin options
        const pluginOptions = req.scope.resolve("postmarkModuleService")?.getOptions?.()
        const serverToken = pluginOptions?.server_api || process.env.POSTMARK_SERVER_TOKEN || process.env.POSTMARK_SERVER_API

        if (!serverToken) {
            return res.status(400).json({
                error: "Postmark server token not configured",
                message: "Please configure the Postmark server token in your plugin options or environment variables"
            })
        }

        const client = new ServerClient(serverToken)

        // Fetch layout templates from Postmark
        const layouts = await client.getTemplates({
            count: parseInt(count as string),
            offset: parseInt(offset as string),
            templateType: Models.TemplateTypes.Layout
        })

        res.json(layouts)
    } catch (error) {
        console.error("Error fetching Postmark layouts:", error)

        // Handle specific Postmark API errors
        if (error instanceof Error && error.message.includes("401")) {
            return res.status(401).json({
                error: "Invalid Postmark server token",
                message: "Please check your Postmark server token configuration"
            })
        }

        res.status(500).json({
            error: "Failed to fetch layouts",
            message: error instanceof Error ? error.message : "Unknown error"
        })
    }
}
