import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { ReminderSchedule } from "../../types/reminder-schedules"
import { CartDTO, CustomerDTO } from "@medusajs/framework/types"
import { Temporal } from "temporal-polyfill"

type FetchAbandonedCartsStepInput = {
    reminderSchedules: Array<ReminderSchedule>
    pagination: { limit: number, offset: number }
}

export const fetchAbandonedCarts = createStep(
    "fetch-abandoned-carts",
    async ({ reminderSchedules, pagination }: FetchAbandonedCartsStepInput, { container }) => {
        const query = container.resolve("query")

        // Transform reminder schedules into a flat array of reminders with delay and template
        const reminders = reminderSchedules.flatMap(schedule =>
            schedule.delays_iso.map(duration => ({
                delay: Temporal.Duration.from(duration).total({ unit: "hours", relativeTo: Temporal.Now.plainDateISO() }),
                template: schedule.template_id,
                schedule: schedule
            }))
        ).sort((a, b) => a.delay - b.delay)

        if (!reminders.length) {
            return new StepResponse({ carts: [], totalCount: 0 })
        }

        const closestValidRemiderDate = new Date(Date.now() - reminders[0].delay * 60 * 60 * 1000)
        const {
            data: abandonedCarts,
            metadata,
        } = await query.graph({
            entity: "cart",
            fields: [
                "id",
                "email",
                "items.*",
                "metadata",
                "updated_at",
                "customer.*",
            ],
            filters: {
                email: {
                    $ne: null,
                },
                completed_at: null,
            },
            pagination: {
                skip: pagination.offset,
                take: pagination.limit,
            },
        })

        const cartsWithItems = abandonedCarts.filter((cart) => cart.items?.length > 0 &&
            cart.items.map((item) => new Date(item!.updated_at)).sort((a, b) => b.getTime() - a.getTime())[0] < closestValidRemiderDate)

        const groupedCarts = Map.groupBy(cartsWithItems, (cart) => {
            const mostRecentLineItemUpdate = cart.items.map((item) => new Date(item!.updated_at).getTime()).sort((a, b) => b - a)[0]
            const elapsed = (Date.now() - mostRecentLineItemUpdate) / 1000 / 3600
            const lastNotificationDelay = (new Date(cart.metadata?.abandoned_notification as string || 0).getTime() - mostRecentLineItemUpdate) / 1000 / 3600

            for (const reminder of reminders.toReversed()) {
                if (elapsed >= reminder.delay && reminder.delay > lastNotificationDelay) {
                    return reminder
                }
            }

            return "no-reminder"
        })

        if (groupedCarts.has("no-reminder")) {
            groupedCarts.delete("no-reminder")
        }

        const totalCount = metadata?.count ?? 0
        return new StepResponse({
            carts: Array.from(groupedCarts.entries() as unknown as Map<{ delay: number, template: string, schedule: ReminderSchedule }, (CartDTO & { customer: CustomerDTO })[]>),
            totalCount
        })
    }
)
