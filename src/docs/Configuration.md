# Configuration

The plugin requires several configuration options and environment variables to function correctly.

## Environment Variables
- `POSTMARK_API_KEY`: Your Postmark server token
- `POSTMARK_FROM`: Default sender email address
- `POSTMARK_BCC`: Default bcc email address


## Setup
1. Install the plugin and its dependencies.
2. Add the plugin to your Medusa configuration.
3. Set the required environment variables.
4. Configure reminder schedules and templates as needed.

## Example: Plugin Registration

Add the plugin to your `medusa-config.ts`:

```ts
defineConfig({
	// ...
	plugins: [
    // ...
		{
			resolve: "medusa-plugin-postmark",
			options: {
				apiKey: process.env.POSTMARK_API_KEY!,
			}
		},
	]
})
```

## Example: Adding the Postmark Notification Provider

To use Postmark as a notification provider, add it to the `modules` property in your Medusa config:

```ts
defineConfig({
	// ...
	modules: [
		{
			resolve: "@medusajs/medusa/notification",
			options: {
				providers: [
					{
						resolve: "medusa-plugin-postmark/providers/postmark",
						id: "postmark",
						options: {
							channels: ["email"],
							apiKey: process.env.POSTMARK_API_KEY!,
              default: {
                  from: process.env.POSTMARK_FROM,
                  bcc: process.env.POSTMARK_BCC,
              }
						},
					},
				],
			},
		},
	],
})
```

Only one provider can be set per channel (e.g., "email").

## Options
- **Reminder Schedules**: Configure delays, template associations, and flags.
- **Templates**: Manage templates and layouts through the admin interface or API.

Refer to the other documentation sections for details on each configuration area.
