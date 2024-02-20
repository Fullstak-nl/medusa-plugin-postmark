import type {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/medusa"
import EmailTemplate from "../../../../models/email-template"
import { EntityManager } from "typeorm"
import { MedusaError } from "@medusajs/utils"
import { GetEmailTemplateRequest, GetEmailTemplateResponse, UpdateEmailTemplateRequest, UpdateEmailTemplateRequestBody, UpdateEmailTemplateResponse } from "../../../../types/email-template"
import { Client as PostmarkClient } from 'postmark';
import { NotificationEvent } from "../../../../types/email-template"

export const GET = async (
    req: GetEmailTemplateRequest,
    res: GetEmailTemplateResponse
) => {
    const alias = req.params.alias
    const manager: EntityManager = req.scope.resolve("manager")
    const emailTemplateRepo = manager.getRepository(EmailTemplate)
    const taken_events: string[] = await emailTemplateRepo.createQueryBuilder("email_template").select(["email_template.notification_event"]).distinct(true).getRawMany();
    const available_events = Object.values(NotificationEvent).filter((event) => !taken_events.includes(event));
    const template = await emailTemplateRepo.findOneBy({ alias: alias })
    if (!template) {
        throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Email template with alias ${alias} was not found`
        )
    }
    res.json({
        template: template,
        available_events: available_events
    })
}

export const POST = async (
    req: UpdateEmailTemplateRequest,
    res: UpdateEmailTemplateResponse
) => {
    const manager: EntityManager = req.scope.resolve("manager")
    const emailTemplateRepo = manager.getRepository(EmailTemplate)
    const options = req.body['template']
    const template = await emailTemplateRepo.findOneBy({ alias: options['alias'] })

    Object.assign(template, options)

    // Ensure that this object passes db validation before sending to Postmark.
    await emailTemplateRepo.save(template)
    const postmarkClient = new PostmarkClient(process.env.POSTMARK_SERVER_TOKEN);
    const result = await postmarkClient.editTemplate(template.alias, {
        Name: template.name,
        HtmlBody: template.html_body,
        Subject: template.subject,
    });
    template.postmark_id = result.TemplateId
    await emailTemplateRepo.save(template)
    res.status(204).json({})
}

export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const alias = req.params.alias
    const manager: EntityManager = req.scope.resolve("manager")
    const emailTemplateRepo = manager.getRepository(EmailTemplate)
    const template = await emailTemplateRepo.findOneBy({ alias: alias })
    if (!template) {
        throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Email template with alias ${alias} was not found`
        )
    }
    const postmarkClient = new PostmarkClient(process.env.POSTMARK_SERVER_TOKEN);
    await postmarkClient.deleteTemplate(template.postmark_id);
    await emailTemplateRepo.softRemove(template);
    await emailTemplateRepo.save(template)
    res.status(204).json({})
}
