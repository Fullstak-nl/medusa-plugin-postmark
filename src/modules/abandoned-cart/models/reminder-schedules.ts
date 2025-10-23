import { model } from "@medusajs/framework/utils"

const ReminderSchedule = model.define("reminder_schedule", {
  id: model.id().primaryKey(),
  enabled: model.boolean(),
  template_id: model.text().unique(),
  delays_iso: model.array(),
  notify_existing: model.boolean().default(false),
})

export default ReminderSchedule
