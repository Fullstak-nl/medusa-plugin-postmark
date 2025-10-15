import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Models } from "postmark"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    const { count = 100, offset = 0 } = req.query

    const postmarkModuleService = req.scope.resolve("postmarkModuleService")

    const layouts = await postmarkModuleService.getTemplates({
        count: parseInt(count as string),
        offset: parseInt(offset as string),
        templateType: Models.TemplateTypes.Layout
    })
    res.json(layouts)
}
