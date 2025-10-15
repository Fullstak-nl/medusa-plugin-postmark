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
}


export default PostmarkModuleService
