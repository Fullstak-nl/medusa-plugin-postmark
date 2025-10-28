# Reminder Schedules

Reminder schedules define when and how abandoned cart reminder emails are sent to customers. Each schedule specifies a set of delays (in ISO 8601 duration format), the Postmark template to use, and additional flags to control notification behavior.

## Fields
- **id**: Unique identifier for the schedule.
- **enabled**: Whether the schedule is active.
- **template_id**: The Postmark template associated with this schedule.
- **delays_iso**: Array of ISO 8601 durations (e.g., `['PT1H', 'P1D']`) specifying when reminders are sent after cart abandonment.
- **notify_existing**: If true, carts created before a schedule update are eligible for notifications.
- **reset_on_cart_update**: If true, the notification cycle restarts if the cart is updated after abandonment.
- **created_at / updated_at / deleted_at**: Timestamps for schedule lifecycle management.

## Behavior
- Each schedule can be enabled or disabled.
- Multiple schedules can exist, each with its own template and delays.
- The system ensures that reminders are not sent more than once for the same delay and cart, unless `reset_on_cart_update` is enabled and the cart is updated.
- Schedules are linked to templates, and referential integrity is enforced.

## Use Case
Reminder schedules are used by the abandoned cart workflow to determine which customers should receive reminder emails and when, ensuring a flexible and robust notification strategy.