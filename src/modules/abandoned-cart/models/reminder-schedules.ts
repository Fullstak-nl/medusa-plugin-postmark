import { model } from "@medusajs/framework/utils"

const ReminderSchedule = model.define("reminder_schedule", {
  id: model.id().primaryKey(),
  enabled: model.boolean(),
  template_id: model.text().unique(),
  delays_iso: model.array(),
  notify_existing: model.boolean().default(false),
  reset_on_cart_update: model.boolean().default(true),
})

export default ReminderSchedule
