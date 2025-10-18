import { ArrayProperty, ComputedProperty, model, EntityBuilder, BaseProperty } from "@medusajs/framework/utils"
import { Temporal } from "temporal-polyfill"

const ReminderSchedule = model.define("reminder_schedule", {
  id: model.id().primaryKey(),
  enabled: model.boolean(),
  template_id: model.text().unique(),
  delays_iso: model.array(),
})

export default ReminderSchedule
