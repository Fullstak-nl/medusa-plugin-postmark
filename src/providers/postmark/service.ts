import { Logger, NotificationTypes } from "@medusajs/framework/types"
import { AbstractNotificationProviderService, MedusaError } from "@medusajs/framework/utils"
import { ServerClient, TemplatedMessage } from "postmark"

type Options = {
  apiKey: string,
  default: {
    from: string,
    bcc?: string
  }
}

class PostmarkProviderService extends AbstractNotificationProviderService {
  static identifier = "postmark"
  protected client: ServerClient
  protected options: Options
  protected logger: Logger

  constructor({ logger }: { logger: Logger }, options: Options) {
    super();
    this.options = options
    this.client = new ServerClient(options.apiKey)
    this.logger = logger
  }

  async send(notification: NotificationTypes.ProviderSendNotificationDTO): Promise<NotificationTypes.ProviderSendNotificationResultsDTO> {
    const templateId = parseInt(notification.template)

    const sendOptions: TemplatedMessage = {
      From: notification.from ?? this.options.default.from,
      To: notification.to,
      TemplateId: templateId,
      TemplateModel: {
        ...notification.data
      }
    }

    if (this.options?.default?.bcc)
      sendOptions.Bcc = this.options.default.bcc

    if (notification.attachments?.length) {
      sendOptions.Attachments = notification.attachments.map((a) => {
        return {
          Content: a.content,
          Name: a.filename,
          ContentType: a.content_type ?? "",
          ContentID: `cid:${a.id}`,
        }
      })
    }

    return await this.client.sendEmailWithTemplate(sendOptions)
      .then((res) => ({ id: res.MessageID }))
      .catch((error) => {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, error)
      })
  }

  static validateOptions(options: Record<any, any>) {
    if (!options.apiKey) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Postmark API key is required in the provider's options."
      )
    }
    if (!options.default?.from) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "'From' email address is required in the provider's options."
      )
    }
  }
}


export default PostmarkProviderService
