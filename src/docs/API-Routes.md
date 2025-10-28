# API Routes

The plugin exposes several API endpoints for managing reminder schedules, templates, layouts, and sending emails through Postmark. All routes are proxied through the Medusa server for security and consistency.

## Reminder Schedules
- `GET /admin/postmark/abandoned-carts/reminders/schedules` — List all reminder schedules
- `GET /admin/postmark/abandoned-carts/reminders/schedules/:id` — Get a reminder schedule by id
- `POST /admin/postmark/abandoned-carts/reminders/schedules` — Create a new reminder schedule
- `POST /admin/postmark/abandoned-carts/reminders/schedules/:id` — Update a reminder schedule
- `DELETE /admin/postmark/abandoned-carts/reminders/schedules/:id` — Delete a reminder schedule

## Templates
- `GET /admin/postmark/templates` — List all templates
- `GET /admin/postmark/templates/:id` — Get a template by ID
- `POST /admin/postmark/templates` — Create a new template
- `POST /admin/postmark/templates/:id` — Update a template
- `DELETE /admin/postmark/templates/:id` — Delete a template

## Options
- `GET /admin/postmark/options` — Returns configuration options about the postmark server, currently just returns the server's ID.

## Validation
- `POST /admin/postmark/abandoned-carts/reminders/validate` — Validate reminder schedules against template data,to make sure that no template misses any data.
