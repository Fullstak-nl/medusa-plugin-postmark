import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    const postmarkModuleService = req.scope.resolve("postmarkModuleService")
    res.json(await postmarkModuleService.getServerId())
}
