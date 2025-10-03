import { MedusaService } from "@medusajs/framework/utils"
import ReminderSchedule from "./models/reminder-schedules"

class AbandonedCartModuleService extends MedusaService({
  ReminderSchedule,
}) { }

export default AbandonedCartModuleService
