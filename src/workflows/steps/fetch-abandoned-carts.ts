import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { Reminder } from "../../types/abandoned-cart"
import { CartDTO, CustomerDTO } from "@medusajs/framework/types"

type FetchAbandonedCartsStepInput = {
    reminders: Array<Reminder>
    pagination: { limit: number, offset: number }
}

export const fetchAbandonedCarts = createStep(
    "fetch-abandoned-carts",
    async ({ reminders, pagination }: FetchAbandonedCartsStepInput, { container }) => {
        const query = container.resolve("query")

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
        return new StepResponse({ carts: Array.from(groupedCarts.entries() as unknown as Map<Reminder, (CartDTO & { customer: CustomerDTO })[]>), totalCount })
    }
)
