import { MedusaError } from "medusa-core-utils"
import EmailTemplate from "../../../../models/email-template"
import { GetEmailTemplatesRequest, GetEmailTemplatesResponse } from "../../../../types/email-template"
import { DeepPartial, EntityManager, Not, IsNull } from "typeorm"
import { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import { Client as PostmarkClient } from 'postmark';

export const GET = async (
    req: GetEmailTemplatesRequest,
    res: GetEmailTemplatesResponse
) => {
    const manager: EntityManager = req.scope.resolve("manager")
    const emailTemplateRepo = manager.getRepository(EmailTemplate)

    res.json({
        templates: await emailTemplateRepo.find({ withDeleted: true, where: { deleted_at: Not(IsNull()) } }),
    })
}

