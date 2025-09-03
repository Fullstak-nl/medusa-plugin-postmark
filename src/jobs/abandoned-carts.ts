import { MedusaContainer } from "@medusajs/framework/types"
import { sendAbandonedCartsWorkflow } from "../workflows/abandoned-carts"
import { defineFileConfig, MedusaError } from "@medusajs/framework/utils"
import { POSTMARK_MODULE } from "../modules/postmark"

export default async function abandonedCartJob(
    container: MedusaContainer
) {
    const logger = container.resolve("logger")

    const limit = 100
    let offset = 0
    let totalCount = 0
    let abandonedCartsCount = 0

    const postmarkService = container.resolve(POSTMARK_MODULE)
    const options = postmarkService.getOptions()

    if (!options.abandoned_cart?.reminders?.length)
        throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, "Abandoned cart reminders are enabled but not configured")


    do {
        try {
            const { result: { updatedCarts, pagination } } = await sendAbandonedCartsWorkflow(container).run({
                input: {
                    reminders: options.abandoned_cart.reminders,
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
    schedule: "0 * * * *", // Run every hour
}

defineFileConfig({
    isDisabled: () => process.env.PLUGIN_POSTMARK_ABANDONED_CART_ENABLE !== "true",
})
