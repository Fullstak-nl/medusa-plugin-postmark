import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Models } from "postmark"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    const { limit: count, offset, q, order, templateType } = req.query as { q: string, order: string, limit: string, offset: string, templateType: string }

    const postmarkModuleService = req.scope.resolve("postmarkModuleService")
    const cache = req.scope.resolve("caching")

    const queryParams: any = {
        count: parseInt(count),
        offset: parseInt(offset),
        templateType
    }

    // Dont use cache if caching module is not enabled
    const cacheKey = await cache?.computeKey(req.query)
    let templates: Models.Templates = cacheKey ? await cache.get({ key: cacheKey }) : await postmarkModuleService.getTemplates(queryParams)
    if (!templates) {
        templates = await postmarkModuleService.getTemplates(queryParams)
        await cache.set({ key: cacheKey, data: templates })
    }
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
