import { MedusaContainer } from "@medusajs/framework/types"
import { sendAbandonedCartsWorkflow } from "../workflows/abandoned-carts"
import { defineFileConfig } from "@medusajs/framework/utils"
import { ABANDONED_CART_MODULE } from "../modules/abandoned-cart"

export default async function abandonedCartJob(
    container: MedusaContainer
) {
    const logger = container.resolve("logger")

    const limit = 100
    let offset = 0
    let totalCount = 0
    let abandonedCartsCount = 0

    const abandonedCartService = container.resolve(ABANDONED_CART_MODULE)
    const reminderSchedules = await abandonedCartService.listReminderSchedules({
        enabled: true
    })

    if (!reminderSchedules?.length) {
        logger.info("No enabled reminder schedules found")
        return
    }

    do {
        try {
            const { result: { updatedCarts, pagination } } = await sendAbandonedCartsWorkflow(container).run({
                input: {
                    reminderSchedules,
                    pagination: { limit, offset },
                },
            })
            abandonedCartsCount += updatedCarts.length
            totalCount = pagination.totalCount ?? 0
        } catch (error) {
            logger.error(
                `Failed to send abandoned cart notification: ${error.message}`
            )
        }

        offset += limit
    } while (offset < totalCount)

    logger.info(`Sent ${abandonedCartsCount} abandoned cart notifications`)
}

export const config = {
    name: "abandoned-cart-notification",
    schedule: process.env.PLUGIN_POSTMARK_ABANDONED_CART_SCHEDULE || "0 * * * *", // Run every hour by default
}

defineFileConfig({
    isDisabled: () => process.env.PLUGIN_POSTMARK_ABANDONED_CART_ENABLE === "false",
})
