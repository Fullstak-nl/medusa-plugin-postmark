import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    try {
        // Get Postmark configuration from plugin options
        const postmarkModuleService = req.scope.resolve("postmarkModuleService")
        const pluginOptions = postmarkModuleService?.getOptions?.()
        if (!pluginOptions) {
            return res.status(404).json({
                error: "Postmark module options not found"
            })
        }

        res.json(pluginOptions)
    } catch (error) {
        console.error("Error getting Postmark options:", error)

        res.status(500).json({
            error: "Failed to get Postmark options",
            message: error instanceof Error ? error.message : "Unknown error"
        })
    }
}
