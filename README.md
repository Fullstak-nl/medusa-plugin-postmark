# medusa-plugin-postmark

## `Work in progress!!`

Notifications plugin for Medusa ecommerce server that sends transactional emails via [PostMark](https://postmarkapp.com/).

## Features

- Uses the email templating features built into Postmark
- You can import/use tools like [stripo.email](https://stripo.email)
- The plugin is in active development. If you have any feature requests, please open an issue.
- Create PDF invoices and credit notes and attach them to the email

## Configuration

Enable in your medusa-config.js file similar to other plugins:  

###### More events? (work in progress within the plugin!) [See here](https://docs.medusajs.com/advanced/backend/subscribers/events-list)

```js
const plugins = [
    // ... other plugins
    {
        resolve: `medusa-plugin-postmark`,
        options: {
            server_api: process.env.POSTMARK_SERVER_API,
            from: process.env.POSTMARK_FROM,
            pdf: {
                enabled: process.env.POSTMARK_PDF_ENABLED || false,
                settings: {
                    font: process.env.POSTMARK_PDF_FONT || 'Helvetica', 
                    // [{file: 'yourfont.ttf', name: 'yourfont'},{file: 'yourfont-bold.ttf', name: 'yourfontbold'}]
                    format: process.env.POSTMARK_PDF_FORMAT || 'A4', 
                    // see supported formats here: https://pdfkit.org/docs/paper_sizes.html
                    margin: {
                        top: process.env.POSTMARK_PDF_MARGIN_TOP || '10mm',
                        right: process.env.POSTMARK_PDF_MARGIN_RIGHT || '10mm',
                        bottom: process.env.POSTMARK_PDF_MARGIN_BOTTOM || '10mm',
                        left: process.env.POSTMARK_PDF_MARGIN_LEFT || '10mm'
                    }
                },
                header: {
                    enabled: process.env.POSTMARK_PDF_HEADER_ENABLED || false,
                    content: process.env.POSTMARK_PDF_HEADER_CONTENT || null,
                    // loads default header if null, otherwise loads the file from `POSTMARK_PDF_HEADER_CONTENT`
                    height: process.env.POSTMARK_PDF_HEADER_HEIGHT || '50'
                },
                templates: {
                    invoice: process.env.POSTMARK_PDF_INVOICE_TEMPLATE || null,
                    credit_note: process.env.POSTMARK_PDF_CREDIT_NOTE_TEMPLATE || null,
                    return_invoice: process.env.POSTMARK_PDF_RETURN_INVOICE_TEMPLATE || null
                }
            },
            events: {
                order: {
                    placed: process.env.POSTMARK_ORDER_PLACED || null,
                    canceled: process.env.POSTMARK_ORDER_CANCELED || null,
                    shipment_created: process.env.POSTMARK_ORDER_SHIPMENT_CREATED || null,
                },
                customer: {
                    created: process.env.POSTMARK_CUSTOMER_CREATED || null,
                    password_reset: process.env.POSTMARK_CUSTOMER_PASSWORD_RESET || null,
                },
                user: {
                    password_reset: process.env.POSTMARK_USER_PASSWORD_RESET || null,
                }
            },
            default_data: {
                // ... default data to be passed to the email template
                product_url: process.env.POSTMARK_PRODUCT_URL || '',
                product_name: process.env.POSTMARK_PRODUCT_NAME || '',
                company_name: process.env.POSTMARK_COMPANY_NAME || '',
                company_address: process.env.POSTMARK_COMPANY_ADDRESS || '',
            }
        }
    }
]
```

### Localisation

Want separate templates for different languages?
Alter medusa-config.js plugin options:

```js
// medusa config including the postmark plugin
events: {
    order: {
        placed: { nl: 1234, en: 1235 },
// rest of the events...
```

The api key and templates are pulled from env variables.  
```
POSTMARK_SERVER_API=""
POSTMARK_FROM=""
POSTMARK_ORDER_PLACED=1234
```

The `POSTMARK_FROM` email address must be a verified sender in your Postmark account.

## Acknowledgement

This plugin borrows extensively from medusa-plugin-sendgrid by Oliver Juhl.
