import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { ReminderSchedule } from "../../types/reminder-schedules"
import { CartDTO, CustomerDTO } from "@medusajs/framework/types"
import { Temporal } from "temporal-polyfill"
import {
  computeCartReferenceTimestamp,
  getSentNotification,
} from "../../types/abandoned-cart-tracking"

type FetchAbandonedCartsStepInput = {
  reminderSchedules: Array<ReminderSchedule>
  pagination: { limit: number, offset: number }
}

/**
 * Represents a reminder with computed delay
 */
interface ProcessedReminder {
  delay: Temporal.Duration
  delayIso: string // original ISO duration
  template: string
  schedule: ReminderSchedule
}

/**
 * Check if a cart should receive a specific reminder
 */
function shouldSendReminder(
  cart: CartDTO,
  reminder: ProcessedReminder,
  currentReferenceInstant: Temporal.Instant,
  now: Temporal.Instant
): boolean {
  const { schedule, delayIso, delay } = reminder

  // Calculate time elapsed since cart's reference timestamp
  const elapsed = now.since(currentReferenceInstant)
  const currentReferenceDate = Temporal.ZonedDateTime.from(currentReferenceInstant.toZonedDateTimeISO("UTC"))

  // Check if enough time has passed for this delay
  if (Temporal.Duration.compare(elapsed, delay, { relativeTo: currentReferenceDate }) < 0) {
    return false
  }

  // Check if this notification was already sent
  const sentNotification = getSentNotification(cart, schedule.id, delayIso)

  if (!sentNotification) {
    // If reset_on_cart_update is true and the cart has been updated since any previous send, allow sending all reminders again (including missed ones)
    if (schedule.reset_on_cart_update) {
      // Check if any notification for this schedule was sent before
      const tracking = (typeof cart.metadata?.abandoned_cart_tracking === 'object' && cart.metadata?.abandoned_cart_tracking !== null)
        ? ((cart.metadata.abandoned_cart_tracking as any).sent_notifications || {})
        : {}
      const schedulePrefix = `${schedule.id}:`
      let anySent = false
      let lastCartReferenceAtSend = null
      for (const key of Object.keys(tracking)) {
        if (key.startsWith(schedulePrefix)) {
          anySent = true
          const notif = tracking[key]
          if (!lastCartReferenceAtSend || notif.cart_reference_at_send > lastCartReferenceAtSend) {
            lastCartReferenceAtSend = notif.cart_reference_at_send
          }
        }
      }
      if (anySent && lastCartReferenceAtSend) {
        // If cart has been updated since last send, allow sending all reminders again
        const cartReferenceAtSendInstant = Temporal.Instant.from(lastCartReferenceAtSend)
        if (Temporal.Instant.compare(currentReferenceInstant, cartReferenceAtSendInstant) > 0) {
          return true
        }
      }
    }
    // Never sent before - this could be a newly added delay

    // Prevent sending a notification for a smaller delay if a bigger one was already sent for the same schedule
    // Find all sent notifications for this schedule
    const tracking = (typeof cart.metadata?.abandoned_cart_tracking === 'object' && cart.metadata?.abandoned_cart_tracking !== null)
      ? ((cart.metadata.abandoned_cart_tracking as any).sent_notifications || {})
      : {}
    const schedulePrefix = `${schedule.id}:`
    let biggerDelaySent = false
    for (const key of Object.keys(tracking)) {
      if (key.startsWith(schedulePrefix)) {
        const sentDelayIso = key.slice(schedulePrefix.length)
        try {
          const sentDelay = Temporal.Duration.from(sentDelayIso)
          if (Temporal.Duration.compare(sentDelay, delay, { relativeTo: currentReferenceDate }) > 0) {
            biggerDelaySent = true
            break
          }
        } catch { }
      }
    }
    if (biggerDelaySent) {
      return false
    }

    if (schedule.updated_at) {
      const scheduleUpdatedInstant = Temporal.Instant.from(new Date(schedule.updated_at).toISOString())
      const cartCreatedInstant = Temporal.Instant.from(new Date(cart.created_at!).toISOString())

      // If notify_existing is false, only carts created after schedule update are eligible
      if (!schedule.notify_existing) {
        if (Temporal.Instant.compare(cartCreatedInstant, scheduleUpdatedInstant) < 0) {
          return false
        }
        // For newly added delays: cart reference must also be after schedule update
        if (Temporal.Instant.compare(currentReferenceInstant, scheduleUpdatedInstant) < 0) {
          return false
        }
      } else {
        // If notify_existing is true, allow carts created before schedule update
        // But for newly added delays, only allow if the delay existed at the time the cart became eligible
        // So, skip the reference check for notify_existing=true
      }
    }
    return true
  }

  // Already sent once - check reset_on_cart_update behavior
  if (schedule.reset_on_cart_update) {
    // Reset mode: resend if cart was updated after last send
    const cartReferenceAtSendInstant = Temporal.Instant.from(sentNotification.cart_reference_at_send)
    const cartChangedSinceLastSend = Temporal.Instant.compare(
      currentReferenceInstant,
      cartReferenceAtSendInstant
    ) > 0

    if (cartChangedSinceLastSend) {
      // Cart was updated, check if enough time has passed since the update
      return Temporal.Duration.compare(elapsed, delay, { relativeTo: currentReferenceDate }) >= 0
    }
  }

  // Either reset is disabled or cart hasn't changed - don't resend
  return false
}

export const fetchAbandonedCarts = createStep(
  "fetch-abandoned-carts",
  async ({ reminderSchedules, pagination }: FetchAbandonedCartsStepInput, { container }) => {
    const query = container.resolve("query")

    // Filter out disabled schedules
    const enabledSchedules = reminderSchedules.filter(s => s.enabled !== false)
    // Transform enabled reminder schedules into a flat array of reminders with delay and template
    const reminders: ProcessedReminder[] = enabledSchedules.flatMap(schedule =>
      schedule.delays_iso.map(delayIso => ({
        delay: Temporal.Duration.from(delayIso),
        delayIso,
        template: schedule.template_id,
        schedule: schedule
      }))
    ).sort((a, b) => Temporal.Duration.compare(a.delay, b.delay, { relativeTo: Temporal.Now.plainDateTimeISO() }))

    if (!reminders.length) {
      return new StepResponse({ carts: [], totalCount: 0 })
    }

    // Use the shortest delay to filter carts - we need carts old enough for at least one delay
    const shortestDelay = reminders[0].delay
    const now = Temporal.Now.instant()
    const cutoffInstant = now.subtract(shortestDelay)

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
        "created_at",
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

    // Build an array of { cart, reminders: ProcessedReminder[] } for all eligible reminders for each cart
    const eligible: Array<{ cart: CartDTO & { customer: CustomerDTO }, reminders: ProcessedReminder[] }> = []

    for (const cart of abandonedCarts) {
      // Skip carts without items
      if (!cart.items?.length) {
        continue
      }

      // Compute the cart's reference timestamp (most recent update)
      const currentReferenceTimestamp = computeCartReferenceTimestamp(cart as unknown as CartDTO)
      const currentReferenceInstant = Temporal.Instant.fromEpochMilliseconds(currentReferenceTimestamp)

      // Check if cart is old enough for any reminder
      if (Temporal.Instant.compare(currentReferenceInstant, cutoffInstant) > 0) {
        continue
      }

      // For each reminder, check eligibility
      const eligibleReminders: ProcessedReminder[] = []
      // Group reminders by schedule to select one per schedule
      const remindersBySchedule = new Map<string, ProcessedReminder[]>()
      for (const reminder of reminders) {
        const scheduleId = reminder.schedule.id
        if (!remindersBySchedule.has(scheduleId)) {
          remindersBySchedule.set(scheduleId, [])
        }
        remindersBySchedule.get(scheduleId)!.push(reminder)
      }
      for (const [scheduleId, scheduleReminders] of remindersBySchedule) {
        let selectedReminder: ProcessedReminder | null = null
        for (const reminder of scheduleReminders.toReversed()) {
          if (shouldSendReminder(cart as unknown as CartDTO, reminder, currentReferenceInstant, now)) {
            selectedReminder = reminder
            break
          }
        }
        if (selectedReminder) {
          eligibleReminders.push(selectedReminder)
        }
      }
      if (eligibleReminders.length > 0) {
        eligible.push({ cart: cart as unknown as CartDTO & { customer: CustomerDTO }, reminders: eligibleReminders })
      }
    }

    const totalCount = metadata?.count ?? 0
    return new StepResponse({
      carts: eligible,
      totalCount
    })
  }
)
