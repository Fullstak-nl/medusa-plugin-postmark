# Configuration

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
            bcc: process.env.POSTMARK_BCC || null,
            pdf: {
                enabled: process.env.POSTMARK_PDF_ENABLED || false,
                settings: {
                    font: process.env.POSTMARK_PDF_FONT || 'Helvetica', 
                    // [{file: 'yourfont.ttf', name: 'yourfont'},{file: 'yourfont-bold.ttf', name: 'yourfontbold'}]
                    format: process.env.POSTMARK_PDF_FORMAT || 'A4', 
                    // see supported formats here: https://pdfkit.org/docs/paper_sizes.html
                    margin: {
                        top: process.env.POSTMARK_PDF_MARGIN_TOP || '50',
                        right: process.env.POSTMARK_PDF_MARGIN_RIGHT || '50',
                        bottom: process.env.POSTMARK_PDF_MARGIN_BOTTOM || '50',
                        left: process.env.POSTMARK_PDF_MARGIN_LEFT || '50'
                    },
                    empty: "" // what to show if variable can't be found. Defaults to __UNDEFINED__
                },
                header: {
                    enabled: process.env.POSTMARK_PDF_HEADER_ENABLED || false,
                    content: process.env.POSTMARK_PDF_HEADER_CONTENT || null,
                    // loads empty header if null, otherwise loads the file from `POSTMARK_PDF_HEADER_CONTENT`
                    height: process.env.POSTMARK_PDF_HEADER_HEIGHT || '50'
                },
                footer: {
                    enabled: process.env.POSTMARK_PDF_FOOTER_ENABLED || false,
                    content: process.env.POSTMARK_PDF_FOOTER_CONTENT || null,
                    // loads empty footer if null, otherwise loads the file from `POSTMARK_PDF_FOOTER_CONTENT`
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
                    created: process.env.POSTMARK_USER_CREATED || null,
                    password_reset: process.env.POSTMARK_USER_PASSWORD_RESET || null,
                },
                auth: {
                    password_reset: process.env.POSTMARK_AUTH_PASSWORD_RESET || null,
                    verify_account: process.env.POSTMARK_AUTH_VERIFY_ACCOUNT || null,
                },
                activity: {
                    inactive_user: process.env.POSTMARK_ACTIVITY_INACTIVE_USER || null,
                    inactive_customer: process.env.POSTMARK_ACTIVITY_INACTIVE_CUSTOMER || null,
                }
            },
            upsell: {
                enabled: process.env.POSTMARK_UPSELL_ENABLED || false,
                template: process.env.POSTMARK_UPSELL_TEMPLATE || null, // if you supply multiple templates (comma seperated), the plugin will pick one at random
                delay: process.env.POSTMARK_UPSELL_DELAY || 9, // delay in days
                valid: process.env.POSTMARK_UPSELL_VALID || 30, // valid in days
                collection: process.env.POSTMARK_UPSELL_COLLECTION || null,
            },
            abandoned_cart: {
                enabled: process.env.POSTMARK_ABANDONED_CART_ENABLED || false,
                first: {
                    delay: process.env.POSTMARK_ABANDONED_CART_FIRST_DELAY || 1, // delay in hours
                    template: process.env.POSTMARK_ABANDONED_CART_FIRST_TEMPLATE || null, // if you supply multiple templates (comma seperated), the plugin will pick one at random
                },
                second: {
                    delay: process.env.POSTMARK_ABANDONED_CART_SECOND_DELAY || 24, // delay in hours
                    template: process.env.POSTMARK_ABANDONED_CART_SECOND_TEMPLATE || null, // if you supply multiple templates (comma seperated), the plugin will pick one at random
                },
                third: {
                    delay: process.env.POSTMARK_ABANDONED_CART_THIRD_DELAY || 48, // delay in hours
                    template: process.env.POSTMARK_ABANDONED_CART_THIRD_TEMPLATE || null, // if you supply multiple templates (comma seperated), the plugin will pick one at random
                },
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
