# Reminder Schedules: Behaviour Specification

## 1. Overview

A **reminder schedule** defines when and how abandoned cart notifications are sent to customers. Each schedule can specify multiple delays (e.g., 1 minute, 1 hour), a single unique template, and options for handling cart updates and existing carts.

---

## 2. Notification Logic

### 2.1. Eligibility
- **A cart is eligible for reminders if:**
  - It has an email address.
  - It contains at least one item.

### 2.2. Reminder Delays
- Each schedule can have one or more delays (e.g., `PT1M`, `PT2H`).
- A notification is sent when the time since the cart's last relevant update (see below) exceeds the delay.

### 2.3. Sending Reminders
- For each eligible cart and schedule:
  - Only the **latest** applicable reminder is sent (if multiple delays are passed, only the largest is sent).
  - No duplicate notifications are sent for the same schedule/delay.

#### Example
> If a schedule has delays of 1 minute and 2 minutes, and a cart is abandoned for 2.5 minutes, only the 2-minute reminder is sent.

### 2.4. Outdated Notifications
- If a cart becomes eligible for a longer delay, shorter (missed) reminders are **not** sent retroactively.

#### Example
> If a cart is abandoned for 30 minutes and the schedule is updated to add a 10-minute delay, the 10-minute reminder is **not** sent if the 30-minute one was already sent.

---

## 3. Cart Updates and Reminder Cycle


### 3.1. Resetting the Cycle

- **By default** (`reset_on_cart_update: true`):
  - Updating cart items resets the reminder cycle for all delays.
  - All reminders (even those already sent) become eligible to be sent again, starting from the new update time.

- If `reset_on_cart_update` is **false**:
  - The timer for all remaining (not-yet-sent) delays is always based on the latest item update time.
  - However, delays that have already been sent will **not** be sent again after an update.
  - This means only new, not-yet-sent delays are considered after each update, and their timer is always relative to the most recent update.

#### Example (Reset = true)
> Cart abandoned at 12:00, 10-min reminder sent at 12:10. If items are updated at 12:12, the 10-min reminder will be sent again at 12:22 (since all delays are re-eligible).

#### Example (Reset = false)
> Cart abandoned at 12:00, 10-min reminder sent at 12:10. If items are updated at 12:12, the 10-min reminder will **not** be sent again. If there is a 15-min delay, it will be sent at 12:27 (15 minutes after the latest update), but the 10-min one is never re-sent.

---

## 4. Existing Carts

### 4.1. Notifying Existing Carts
- If `notify_existing` is **true**, reminders are sent to carts that were created before the schedule was last edited.
- If `notify_existing` is **false**, only carts created after the schedule is edited are notified.

#### Example
> A cart abandoned before a new delay is added to a schedule:
> - If `notify_existing: true`, it will receive reminders.
> - If `notify_existing: false`, it will not.

## 5. Best Practices
- Use `notify_existing` carefully to avoid spamming old carts.

---
