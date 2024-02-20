# medusa-plugin-postmark

[![stars - medusa-plugin-postmark](https://img.shields.io/github/stars/Fullstak-nl/medusa-plugin-postmark?style=social)](https://github.com/Fullstak-nl/medusa-plugin-postmark)
[![forks - medusa-plugin-postmark](https://img.shields.io/github/forks/Fullstak-nl/medusa-plugin-postmark?style=social)](https://github.com/Fullstak-nl/medusa-plugin-postmark)

[![GitHub tag](https://img.shields.io/github/tag/Fullstak-nl/medusa-plugin-postmark?include_prereleases=&sort=semver&color=blue)](https://github.com/Fullstak-nl/medusa-plugin-postmark/releases/)
[![License](https://img.shields.io/badge/License-MIT-blue)](#license)
[![issues - medusa-plugin-postmark](https://img.shields.io/github/issues/Fullstak-nl/medusa-plugin-postmark)](https://github.com/Fullstak-nl/medusa-plugin-postmark/issues)

Notifications plugin for Medusa ecommerce server that sends transactional emails via [PostMark](https://postmarkapp.com/).

## Features

- Uses the email templating features built into Postmark
- You can import/use tools like [stripo.email](https://stripo.email)
- The plugin is in active development. If you have any feature requests, please open an issue.
- Create PDF invoices and credit notes and attach them to the email
- Send out upsell emails to customers that have recently placed an order with certain collections
- Send out automated abandoned cart emails to customers that have abandoned their cart (based on last updated date of cart)

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


### Events

Events can be specified statically, as they are in the above example, or they can be specified dynamically using an `async` function.

For example, if you have an entity tracking email templates created in Postmark, you may use something like this:

```js
// get-event-mappings.js
export async function getEventMappings() {
  const emailTemplateRepo = getRepository(EmailTemplate);
  const templates = await emailTemplateRepo.find();

  const mappings = {};
  for (const template of templates) {
    if (template.event) {
      mappings[template.event] = template.id;
    }
  }

  return mappings;
}
```

```js
import { getEventMappings } from './get-event-mappings';

{
  // ...
  events: getEventMappings,
}
```

### Templates

The plugin uses the Postmark template system for emails. For attachments the plugin relies on the [pdfkit](https://pdfkit.org/) library.  
In your JSON templates you can use several types (and [variables](#variables)):
- `image` for (**local**) images
- `text` for simple words, (long) sentences, paragraphs and links
- `moveDown` for moving the cursor down one line
- `hr` for a horizontal line
- `tableRow` for a table(-like) row
- `itemLoop` for looping over items in an order
- `itemLoopEnd` for ending the item loop

**Example:**
```json
[
  {
    "type": "image",
    "image": "image.png",
    "x": 100,
    "y": 100,
    "fit": [200, 50]
  },
  {
    "type": "text",
    "text": "This is a text",
    "size": 20
  },
  {
    "type": "moveDown",
    "lines": 2
  },
  {
    "type": "hr"
  },
  {
    "type": "moveDown",
    "lines": 2
  },
  {
    "type": "text",
    "text": "Another text"
  }
]
```

#### image

Images are stored in `/src/images/` and can be used in the template like this:
```json
{
    "type": "image",
    "image": "image.png",
    "x": 100,
    "y": 100,
    "fit": [200, 50]
}
```
`fit` has multiple options, see [here](https://pdfkit.org/docs/images.html#fitting-images-to-a-frame) for more info.  

##### Optional: 
- `align` horizontally align the image, the possible values are `left`, `center`, or `right`
- `valign` vertically align the image, the possible values are `top`, `center`, or `bottom`

#### text

Text can be used for words, sentences, paragraphs and links.  
```json
{
    "type": "text",
    "text": "This is a text"
}
```
If you use [`moveDown`](#movedown) correct you won't need to use `x` and `y` for the text.
##### Optional:
These options can be used to style the text or to position it.
- `x` the x position of the text
- `y` the y position of the text
- `font` the font of the text
- `size` the font size of the text
- `color` the color of the text (Hex codes `#ff0000`)
- `width` the width of the text
- `align` the alignment of the text, the possible values are `left`, `center`, `right`, or `justify`.  

For more styling options, see [here](https://pdfkit.org/docs/text.html#text_styling) for more info.

#### moveDown

This is used to move the cursor down one or more line(s).  
```json
{
    "type": "moveDown",
    "lines": 1
}
```

#### hr

This is used to draw a horizontal line.  
```json
{
    "type": "hr"
}
```

##### Optional:
- `color` the color of the line (Hex codes `#ff0000`)
- `width` the width of the line if you don't want it to be the full width of the page
- `height` the height of the line element, including padding
- `y` the y position of the line if you can not rely on the cursor (affected by [`moveDown`](#movedown))

#### tableRow

This is used to draw a table row.  
```json
{
    "type": "tableRow",
    "columns": [
        {
            "text": "Column 1",
            "width": 200
        },
        {
            "text": "Column 2",
            "width": 150
        }
    ]
}
```
##### Optional:
You can use the same options as for `text` to style the text in the table row. If you want a special column styled, you can add the options to the column object.

#### itemLoop

This is used to start the loop of items in an order.  
To access item variables, use the `item` object, for example `{{ item.title }}`.
```json
{
    "type": "itemLoop"
}
```

#### itemLoopEnd

This is used to end the loop of items in an order.  
```json
{
    "type": "itemLoopEnd"
}
```

### Variables

In the template you can use variables. These are replaced by the plugin with the correct value.  
To use a variable, use the following syntax: `{{ variable_name }}`, for example `{{ order.customer.first_name }}`.  
Order item variables are available inside the `itemLoop` and `itemLoopEnd` elements, for example `{{ item.title }}`.  
If you want to include (simple) if statements, use the following syntax: `{{ if variable_name }}...{{ endif }}`, or as a negative `{{ if not variable_name }}...{{ endif }}`.  
**Possible variables depend on your notification system.**
You can use the `options` object and every template has his own `data` object.   
Depending on the plugin you use, _(almost)_ every plugin **that supports attachments** based on `medusa-plugin-sendgrid` has the same variable `order` after the `options` variable which holds all the plugin variables.  
More information on the possible values that `order` can have can be found [here](https://docs.medusajs.com/add-plugins/sendgrid/#template-reference).

#### Variable functions

At the moment the only variable you can use functions with is dates and currency.   
- **Dates** are formatted using the `toLocaleDateString` function and can be used like this: `{{ order.placed_at | date('en-US',{'year': 'numeric', 'month': 'long', 'day': 'numeric'}) }}`.  
- **Currency** is formatted using the `new Intl.NumberFormat()` function and can be used like this: `{{ order.total_price | currency('en-US') }}`.
- **Country** can be formatted from ISO to the full country name and can be used like this: `{{ order.shipping_address.country_code | country }}`.  
**Please make sure that the options are wrapped in single quotes.**

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

## Default templates

We've created a few default templates _(thanks to [pdfkit invoice example](https://github.com/PSPDFKit-labs/pdfkit-invoice/tree/master))_ which can be altered to your needs:
`header.json`
```json
[
  {
    "type": "text",
    "text": "ACME Inc.",
    "size": 20,
    "color": "#444444"
  },
  {
    "type": "text",
    "text": "ACME Inc.",
    "size": 10,
    "color": "#444444",
    "align": "right",
    "x": 200
  },
  {
    "type": "moveDown"
  },
  {
    "type": "text",
    "text": "123 Main Street",
    "size": 10,
    "color": "#444444",
    "align": "right",
    "x": 200
  },
  {
    "type": "moveDown"
  },
  {
    "type": "text",
    "text": "New York, NY, 10025",
    "size": 10,
    "color": "#444444",
    "align": "right",
    "x": 200
  }
]

```

`createInvoice.json`

```json
[
  {
    "type": "text",
    "text": "Invoice",
    "size": 20,
    "color": "#444444"
  },
  {
    "type": "moveDown"
  },
  {
    "type": "hr"
  },
  {
    "type": "text",
    "text": "Invoice Number:",
    "size": 10
  },
  {
    "type": "text",
    "font": "Helvetica-Bold",
    "text": "#{{ order.display_id }}",
    "size": 10,
    "x": 100
  },
  {
    "type": "text",
    "font": "Helvetica-Bold",
    "text": "{{ order.shipping_address.first_name }} {{ order.shipping_address.last_name }}",
    "size": 10,
    "x": 300
  },
  {
    "type": "moveDown"
  },
  {
    "type": "text",
    "font": "Helvetica",
    "text": "Invoice Date:",
    "size": 10
  },
  {
    "type": "text",
    "text": "{{ order.created_at | date('en-US',{'year': 'numeric', 'month': 'long', 'day': 'numeric'}) }}",
    "size": 10,
    "x": 100
  },
  {
    "type": "text",
    "text": "{{ order.shipping_address.address_1 }} {{ order.shipping_address.address_2 }}",
    "size": 10,
    "x": 300
  },
  {
    "type": "moveDown"
  },
  {
    "type": "text",
    "text": "{{ order.shipping_address.postal_code }}, {{ order.shipping_address.city }}, {{ order.shipping_address.country_code }}",
    "size": 10,
    "x": 300
  },
  {
    "type": "moveDown"
  },
  {
    "type": "hr"
  },
  {
    "type": "moveDown",
    "lines": 1
  },
  {
    "type": "tableRow",
    "font": "Helvetica-Bold",
    "columns": [
      {
        "text": "Item",
        "width": 200
      },
      {
        "text": "Quantity",
        "width": 50
      },
      {
        "text": "Price",
        "width": 50
      },
      {
        "text": "Total",
        "width": 50
      }
    ]
  },
  {
    "type": "hr"
  },
  {
    "type": "itemLoop"
  },
  {
    "type": "tableRow",
    "font": "Helvetica",
    "columns": [
      {
        "text": "{{ item.title }}",
        "width": 200
      },
      {
        "text": "{{ item.quantity }}",
        "width": 50
      },
      {
        "text": "{{ item.unit_price | currency('en-US') }}",
        "width": 50
      },
      {
        "text": "{{ item.totals.total | currency('en-US') }}",
        "width": 50
      }
    ]
  },
  {
    "type": "hr"
  },
  {
    "type": "itemLoopEnd"
  },
  {
    "type": "tableRow",
    "columns": [
      {
        "text": "",
        "width": 200
      },
      {
        "text": "",
        "width": 50
      },
      {
        "text": "Subtotal",
        "width": 50
      },
      {
        "text": "{{ order.subtotal | currency('en-US') }}",
        "width": 50
      }
    ]
  },
  {
    "type": "tableRow",
    "columns": [
      {
        "text": "",
        "width": 200
      },
      {
        "text": "",
        "width": 50
      },
      {
        "text": "Shipping",
        "width": 50
      },
      {
        "text": "{{ order.shipping_total | currency('en-US') }}",
        "width": 50
      }
    ]
  },
  {
    "type": "tableRow",
    "columns": [
      {
        "text": "",
        "width": 200
      },
      {
        "text": "",
        "width": 50
      },
      {
        "text": "TAX",
        "width": 50
      },
      {
        "text": "{{ order.tax_total | currency('en-US') }}",
        "width": 50
      }
    ]
  },
  {
    "type": "tableRow",
    "font": "Helvetica-Bold",
    "columns": [
      {
        "text": "",
        "width": 200
      },
      {
        "text": "",
        "width": 50
      },
      {
        "text": "Total",
        "width": 50
      },
      {
        "text": "{{ order.total | currency('en-US') }}",
        "width": 50
      }
    ]
  }
]

```
`footer.json`
```json
[
  {
    "type": "text",
    "text": "Thank you for your business!",
    "size": 10,
    "color": "#444444",
    "width": "full",
    "align": "center"
  }
]

```

## Acknowledgement

This plugin is originally based on medusa-plugin-sendgrid by Oliver Juhl.
