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

### Templates

The plugin uses the Postmark template system for emails. For attachments the plugin relies on the [pdfkit](https://pdfkit.org/) library.
In your JSON templates you can use several types:
- `image` for (**local**) images
- `text` for simple words, (long) sentences, paragraphs and links
- `moveDown` for moving the cursor down one line
- `hr` for a horizontal line
- `tableRow` for a table(-like) row

#### image

Images are stored in `/src/images/` and can be used in the template like this:
```json
{
    "type": "image",
    "image": "image.png",
    "x": 100,
    "y": 100,
    "fit": [200, 50],
    "align": "center",
    "valign": "center"
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
If you use `moveDown` correct you won't need to use `x` and `y` for the text.
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
- `y` the y position of the line if you can not rely on the cursor (affected by `moveDown`)

#### tableRow

This is used to draw a table row.  
```json
{
    "type": "tableRow",
    "columns": [
        {
            "text": "Column 1",
            "x": 0
        },
        {
            "text": "Column 2",
            "x": 100
        }
    ]
}
```
##### Optional:
You can use the same options as for `text` to style the text in the table row. If you want a special column styled, you can add the options to the column object.

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
