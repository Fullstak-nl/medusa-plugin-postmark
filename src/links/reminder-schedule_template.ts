import { defineLink } from "@medusajs/framework/utils"
import AbandonedCartModule from "../modules/abandoned-cart"
import { POSTMARK_MODULE } from "../modules/postmark"

export default defineLink(
  {
    linkable: AbandonedCartModule.linkable.reminderSchedule,
    field: "template_id",
  },
  {
    linkable: {
      serviceName: POSTMARK_MODULE,
      alias: "template",
      primaryKey: "template_id",
    },
  },
  {
    readOnly: true,
  }
)
