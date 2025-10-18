import { MedusaService } from "@medusajs/framework/utils"
import { ServerClient, Models } from "postmark"

export type PostmarkModuleOptions = {
    server_api?: string
}

class PostmarkModuleService extends MedusaService({}) {
    protected client: ServerClient
    protected serverId: Promise<number>

    constructor({ postmarkClient }: { postmarkClient: ServerClient }) {
        super(arguments)
        this.client = postmarkClient
        this.serverId = this.client.getServer().then(s => s.ID)
    }

    async getServerId() {
        return { server_id: await this.serverId }
    }

    async getTemplates(params?: {
        count?: number
        offset?: number
        templateType?: Models.TemplateTypes
    }) {
        return await this.client.getTemplates(params)
    }

    async getTemplate(templateId: number) {
        return await this.client.getTemplate(templateId)
    }

    async deleteTemplate(templateId: number) {
        return await this.client.deleteTemplate(templateId)
    }

    async validateTemplate(params: {
        Subject: string
        HtmlBody: string
        TextBody: string
        TestRenderModel: Record<string, any>
    }) {
        return await this.client.validateTemplate(params)
    }

    async list(filter: { template_id: string | string[] }) {
        const ids = Array.isArray(filter.template_id)
            ? filter.template_id
            : [filter.template_id]

        const templates = await Promise.all(
            ids.map(async (id) => {
                try {
                    // Template IDs can be numeric or alias strings
                    const numericId = parseInt(id, 10)
                    const template = isNaN(numericId)
                        ? await this.client.getTemplate(id)
                        : await this.client.getTemplate(numericId)

                    return {
                        ...template,
                        template_id: id,
                    }
                } catch (error) {
                    console.warn(`Template with ID ${id} not found:`, error)
                    return null
                }
            })
        )

        return templates.filter((t) => t !== null)
    }
}


export default PostmarkModuleService
