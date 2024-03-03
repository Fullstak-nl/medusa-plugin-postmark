# Templates

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

## image

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

### Optional: 
- `align` horizontally align the image, the possible values are `left`, `center`, or `right`
- `valign` vertically align the image, the possible values are `top`, `center`, or `bottom`

## text

Text can be used for words, sentences, paragraphs and links.  
```json
{
    "type": "text",
    "text": "This is a text"
}
```
If you use [`moveDown`](#movedown) correct you won't need to use `x` and `y` for the text.
### Optional:
These options can be used to style the text or to position it.
- `x` the x position of the text
- `y` the y position of the text
- `font` the font of the text
- `size` the font size of the text
- `color` the color of the text (Hex codes `#ff0000`)
- `width` the width of the text
- `align` the alignment of the text, the possible values are `left`, `center`, `right`, or `justify`.  

For more styling options, see [here](https://pdfkit.org/docs/text.html#text_styling) for more info.

## moveDown

This is used to move the cursor down one or more line(s).  
```json
{
    "type": "moveDown",
    "lines": 1
}
```

## hr

This is used to draw a horizontal line.  
```json
{
    "type": "hr"
}
```

### Optional:
- `color` the color of the line (Hex codes `#ff0000`)
- `width` the width of the line if you don't want it to be the full width of the page
- `height` the height of the line element, including padding
- `y` the y position of the line if you can not rely on the cursor (affected by [`moveDown`](#movedown))

## tableRow

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
### Optional:
You can use the same options as for `text` to style the text in the table row. If you want a special column styled, you can add the options to the column object.

## itemLoop

This is used to start the loop of items in an order.  
To access item variables, use the `item` object, for example `{{ item.title }}`.
```json
{
    "type": "itemLoop"
}
```

## itemLoopEnd

This is used to end the loop of items in an order.  
```json
{
    "type": "itemLoopEnd"
}
```
