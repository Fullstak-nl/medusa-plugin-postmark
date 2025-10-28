# Events

The plugin uses event-driven workflows to automate abandoned cart notifications and template validation. Events are triggered by cart updates, schedule changes, and workflow executions.

## Main Events
- **Cart Abandoned**: Triggers the abandoned cart workflow to check for eligible reminders.
- **Reminder Schedule Updated**: Re-evaluates which carts are eligible for notifications.
- **Template Validated**: Ensures all required variables are present before sending.

# Workflows

## Abandoned Cart Workflow
- Fetches eligible carts based on reminder schedules.
- Determines which reminders should be sent and when.
- Triggers notification sending using the associated Postmark template.

## Notification Data Workflow
- Prepares the data required for each notification, including template variables.
- Validates that all required variables are present for the selected template.

These workflows ensure that notifications are sent reliably and only when all conditions are met.