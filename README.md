# medusa-plugin-postmark

[![stars - medusa-plugin-postmark](https://img.shields.io/github/stars/Fullstak-nl/medusa-plugin-postmark?style=social)](https://github.com/Fullstak-nl/medusa-plugin-postmark)
[![forks - medusa-plugin-postmark](https://img.shields.io/github/forks/Fullstak-nl/medusa-plugin-postmark?style=social)](https://github.com/Fullstak-nl/medusa-plugin-postmark)
[![CodeQL](https://github.com/Fullstak-nl/medusa-plugin-postmark/actions/workflows/codeql.yml/badge.svg)](https://github.com/Fullstak-nl/medusa-plugin-postmark/actions/workflows/codeql.yml)

[![NPM Version (with dist tag)](https://img.shields.io/npm/v/medusa-plugin-postmark/latest)](https://www.npmjs.com/package/medusa-plugin-postmark)
[![License](https://img.shields.io/badge/License-MIT-blue)](#license)
[![issues - medusa-plugin-postmark](https://img.shields.io/github/issues/Fullstak-nl/medusa-plugin-postmark)](https://github.com/Fullstak-nl/medusa-plugin-postmark/issues)

> **Postmark notification plugin for Medusa v2**

This plugin provides robust transactional email support for MedusaJS using [Postmark](https://postmarkapp.com/). It supports advanced workflows for abandoned cart reminders, template management, PDF attachments, and more.

---

## Features

- **Transactional Emails**: Send order, customer, and workflow notifications via Postmark.
- **Abandoned Cart Reminders**: Automated, configurable reminder schedules for abandoned carts.
- **Template Management**: CRUD and validation for Postmark templates, including layouts.
- **PDF Attachments**: Attach PDF invoices/credit notes to emails.
- **Admin UI**: Manage templates, reminder schedules, and validate data from the Medusa admin panel.

---

## Installation & Setup

### 1. Install

```sh
yarn add medusa-plugin-postmark 
npm install medusa-plugin-postmark 
```

### 2. Configure Plugin

Add to your `medusa-config.ts` as a notification provider and as a plugin to enable UI and abandoned carts:

```ts
defineConfig({
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
              },
            },
          },
        ],
      },
    },
  ],

  plugins: [
    {
      resolve: "medusa-plugin-postmark",
      options: {
        apiKey: process.env.POSTMARK_API_KEY!,
      },
    },
  ],
})
```

### 3. Environment Variables

- `POSTMARK_API_KEY`: Your Postmark server token
- `POSTMARK_FROM`: Default sender email address (must be verified in Postmark)
- `POSTMARK_BCC`: (Optional) Default BCC address

---

## Workflows

- **Abandoned Cart Workflow**: Triggers reminders based on schedule and cart state.
- **Template Validation**: Ensures all required variables are present before sending.

## Reminder Schedules

- Define when and how reminders are sent for abandoned carts.
- Use ISO 8601 durations for delays (e.g., `PT1H`, `P1D`).
- Link schedules to specific Postmark templates.
- Control notification behavior with flags (e.g., notify existing carts, reset on update).

## License

MIT License © 2023 Bram Hammer


## Acknowledgement

This plugin is originally based on medusa-plugin-sendgrid by Oliver Juhl.
