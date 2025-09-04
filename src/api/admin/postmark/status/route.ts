import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ServerClient } from "postmark"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    try {
        // Get Postmark configuration from plugin options
        const pluginOptions = req.scope.resolve("postmarkModuleService")?.getOptions?.()
        const serverToken = pluginOptions?.server_api || process.env.POSTMARK_SERVER_TOKEN || process.env.POSTMARK_SERVER_API

        if (!serverToken) {
            return res.status(400).json({
                error: "Postmark server token not configured",
                connected: false,
                message: "Please configure the Postmark server token in your plugin options"
            })
        }

        const client = new ServerClient(serverToken)

        // Test connection by getting server info
        const server = await client.getServer()

        res.json({
            connected: true,
            server: {
                name: server.Name,
                id: server.ID,
                color: server.Color,
                bounceHookUrl: server.BounceHookUrl,
                inboundHookUrl: server.InboundHookUrl,
                postFirstOpenOnly: server.PostFirstOpenOnly,
                rawEmailEnabled: server.RawEmailEnabled,
                deliveryHookUrl: server.DeliveryHookUrl,
                inboundSpamThreshold: server.InboundSpamThreshold
            }
        })
    } catch (error) {
        console.error("Error checking Postmark connection:", error)

        // Handle specific Postmark API errors
        if (error instanceof Error && error.message.includes("401")) {
            return res.status(401).json({
                error: "Invalid Postmark server token",
                connected: false,
                message: "Please check your Postmark server token configuration"
            })
        }

        res.status(500).json({
            error: "Failed to connect to Postmark",
            connected: false,
            message: error instanceof Error ? error.message : "Unknown error"
        })
    }
}
