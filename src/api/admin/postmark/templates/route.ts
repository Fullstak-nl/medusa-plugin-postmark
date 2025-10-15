import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Models } from "postmark"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    const { limit: count, offset, q, order } = req.query as { q: string, order: string, limit: string, offset: string }

    const postmarkModuleService = req.scope.resolve("postmarkModuleService")

    const queryParams: any = {
        count: parseInt(count),
        offset: parseInt(offset),
        templateType: Models.TemplateTypes.Standard
    }

    const templates = await postmarkModuleService.getTemplates(queryParams)
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

}
