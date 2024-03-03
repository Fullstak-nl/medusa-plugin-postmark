# Default templates

We've created a few default templates _(thanks to [pdfkit invoice example](https://github.com/PSPDFKit-labs/pdfkit-invoice/tree/master))_ which can be altered to your needs:

## header.json

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

## createInvoice.json

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

## footer.json

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
