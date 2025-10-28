import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
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

    const postmarkModuleService = req.scope.resolve("postmarkModuleService")
    const cache = req.scope.resolve("caching")

    await postmarkModuleService.deleteTemplate(templateId)
    await cache?.clear({ tags: ["PostmarkTemplate:list:*"] })

    res.json({ success: true, message: "Template deleted successfully" })
}
