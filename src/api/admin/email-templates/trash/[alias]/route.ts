import { MedusaError } from "medusa-core-utils"
import EmailTemplate from "../../../../../models/email-template"
import { GetEmailTemplatesRequest, GetEmailTemplatesResponse } from "../../../../../types/email-template"
import { DeepPartial, EntityManager, Not, IsNull } from "typeorm"
import { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import { Client as PostmarkClient } from 'postmark';

export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const alias = req.params.alias
    const manager: EntityManager = req.scope.resolve("manager")
    const emailTemplateRepo = manager.getRepository(EmailTemplate)
    const template = await emailTemplateRepo.findOne({ withDeleted: true, where: { alias: alias, deleted_at: Not(IsNull()) } })
    await emailTemplateRepo.recover(template)

    const postmarkClient = new PostmarkClient(process.env.POSTMARK_SERVER_TOKEN);
    const result = await postmarkClient.createTemplate({
        Alias: template.alias,
        Name: template.name,
        HtmlBody: template.html_body,
        TextBody: "placeholder",
        Subject: template.subject,
    });
    template.postmark_id = result.TemplateId
    await emailTemplateRepo.save(template)
    res.status(201).json()
}

export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const alias = req.params.alias
    const manager: EntityManager = req.scope.resolve("manager")
    const emailTemplateRepo = manager.getRepository(EmailTemplate)
    const template = await emailTemplateRepo.findOne({ withDeleted: true, where: { alias: alias, deleted_at: Not(IsNull()) } })

    if (!template) {
        throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Email template with alias ${alias} was not found`
        )
    }

    await emailTemplateRepo.remove(template)
    res.status(204).json({})
}
