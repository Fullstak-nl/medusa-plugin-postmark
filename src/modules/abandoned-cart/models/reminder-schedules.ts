import { model } from "@medusajs/framework/utils"

const ReminderSchedule = model.define("reminder_schedule", {
  id: model.id().primaryKey(),
  enabled: model.boolean(),
  template_id: model.text().unique(),
  offset_hours: model.array(),
})

export default ReminderSchedule
