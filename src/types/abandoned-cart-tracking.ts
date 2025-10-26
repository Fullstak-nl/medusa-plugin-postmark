import { CartDTO } from "@medusajs/framework/types"

/**
 * Record of a sent notification for a specific delay in a schedule
 */
export interface SentNotification {
    sent_at: string // ISO timestamp when notification was sent
    cart_reference_at_send: string // ISO timestamp of cart's reference time when sent
}

/**
 * Tracking data stored in cart metadata
 */
export interface AbandonedCartTracking {
    sent_notifications: {
        [key: string]: SentNotification // Key format: "schedule_id:delay_iso"
    }
}

/**
 * Compute the reference timestamp for a cart
 * This is the most recent of: cart.created_at or any item.updated_at
 */
export function computeCartReferenceTimestamp(cart: CartDTO): number {
    const timestamps = [
        new Date(cart.created_at!).getTime(),
        ...(cart.items?.map(item => new Date(item!.updated_at!).getTime()) || [])
    ]
    return Math.max(...timestamps)
}

/**
 * Get sent notification record for a specific schedule and delay
 */
export function getSentNotification(
    cart: CartDTO,
    scheduleId: string,
    delayIso: string
): SentNotification | null {
    const tracking = cart.metadata?.abandoned_cart_tracking as AbandonedCartTracking | null
    if (!tracking) return null

    const key = `${scheduleId}:${delayIso}`
    return tracking.sent_notifications?.[key] || null
}
