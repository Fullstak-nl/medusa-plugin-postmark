import PDFDocument from 'pdfkit'
import getStream from "get-stream"
import fs from 'fs'

class PdfGenerator {
    constructor() {
        this.PDFDocument = PDFDocument
        this.getStream = getStream
        this.top = 0
        this.item = 0
        this.lastHeight = 0
        this.margin = { top: 0, left: 0, right: 0, bottom: 0 }
    }

    async startPdf(options) {
        const doc = new this.PDFDocument({
            size: options?.pdf?.settings?.format,
            margin: options?.pdf?.settings?.margin,
        })
        this.margin = options?.pdf?.settings?.margin
        this.top = this.margin.top
        if (options?.pdf?.settings?.font && typeof options?.pdf?.settings?.font !== 'string') {
            try {
                const fontBuffer = fs.readFileSync(`${process.cwd()}/src/fonts/${options?.pdf?.settings?.font?.file}`)
                doc.registerFont(options?.pdf?.settings?.font?.name, fontBuffer)
            }catch (e) {
                console.log("Font error: ",e)
            }
        }
        return doc
    }

    async generateHeader(doc, options) {
        const header = options?.pdf?.header;
        if (header && header?.enabled) {
            try {
                let layout = []
                if(header?.content) {
                    const layoutJSON = fs.readFileSync(`${process.cwd()}/src/layouts/${header.content}`)
                    layout = JSON.parse(layoutJSON)
                }
                layout.forEach((layoutItem) => this.generateElement(doc,layoutItem))
                this.top += header?.height??50
            }catch (e) {
                console.log("Header error: ",e)
                return
            }
        }
    }

    async generateFooter(doc, options) {
        const footer = options?.pdf?.footer;
        if (footer && footer?.enabled) {
            try {
                let layout = []
                if(footer?.content) {
                    const layoutJSON = fs.readFileSync(`${process.cwd()}/src/layouts/${footer.content}`)
                    layout = JSON.parse(layoutJSON)
                }
                layout.forEach((layoutItem) => this.generateElement(doc,layoutItem))
                this.top += footer?.height??50
            }catch (e) {
                console.log("Footer error: ",e)
                return
            }
        }
    }

    parseVariables(text, data) {
        const regex = /{{\s(.*?)(?=\s}})\s}}/ig
        return text.replace(regex, (match, key)=>{
            let [keys, filter] = key.split(' | ')
            keys = keys.split('.')
            let value = keys[0]==='item'?data?.items[this.item]:data
            keys.shift()
            keys.forEach(k=>value=value[k]??'__UNDEFINED__')
            if(filter) {
                if(filter.startsWith('date')) {
                    const dateRegex = /date\(['"]([^'"]+)['"][\,\s]{0,2}([^))]*)\)/i
                    const [_, locale, format] = dateRegex.exec(filter)
                    value = new Date(value).toLocaleDateString(locale, JSON.parse(format.replaceAll("'",'"'))??{})
                }else if(filter.startsWith('currency')) {
                    const numberRegex = /currency\(['"]([^'"]+)['"]\)/i
                    const [_, locale] = numberRegex.exec(filter)
                    if(typeof value === 'string')
                        value = parseFloat(value.replace(data?.currency_code.toUpperCase(),''))
                    value = new Intl.NumberFormat(locale, {style:'currency',currency: data?.currency_code.toUpperCase()}).format(value/100)
                }
            }
            return value??'__UNDEFINED__'
        })
    }

    generateElement(doc, layoutItem, data) {
        switch (layoutItem.type) {
            case 'image':
                const imageOptions = {"fit":layoutItem?.fit}
                if(layoutItem?.align)
                    imageOptions.align = layoutItem?.align
                if(layoutItem?.valign)
                    imageOptions.valign = layoutItem?.valign
                doc.image(`${process.cwd()}/src/images/${layoutItem.image}`, layoutItem.x, this.margin.left+layoutItem.y, imageOptions)
                break;
            case 'text':
                if(layoutItem?.color)
                    doc.fillColor(layoutItem?.color)
                if(layoutItem?.font)
                    doc.font(layoutItem?.font)
                if(layoutItem?.size)
                    doc.fontSize(layoutItem?.size)
                if(layoutItem?.width && typeof layoutItem?.width === 'string')
                    layoutItem.width = parseInt(doc.page.width - this.margin.left - this.margin.right)
                else if(layoutItem?.width && typeof layoutItem?.width === 'number')
                    layoutItem.width = parseInt(layoutItem?.width)
                const parsedText = this.parseVariables(layoutItem?.text, data)
                const textOptions = Object.fromEntries(Object.entries(layoutItem).filter(([key]) => !['type','color','font','size','text', 'x', 'y'].includes(key)))
                this.lastHeight = doc.heightOfString(parsedText,textOptions)
                if(layoutItem?.x||layoutItem?.y)
                    doc.text(this.parseVariables(layoutItem?.text, data), this.margin.left + (layoutItem?.x??0), layoutItem?.y??this.top, textOptions)
                else
                    doc.text(this.parseVariables(layoutItem?.text, data), this.margin.left, this.top, textOptions)
                //this.top += textHeight
                break;
            case 'moveDown':
                //doc.moveDown(layoutItem?.lines??1)
                // fake movedown by altering this.top + last fontsize * 1.5 or use measured height
                if(layoutItem?.useMeasure)
                    this.top += parseInt(this.lastHeight)
                else
                    this.top += (parseInt(doc._fontSize) * 1.5) * (layoutItem?.lines??1)
                break;
            case 'hr':
                doc
                    .strokeColor(layoutItem?.color??'#aaaaaa')
                    .lineWidth(layoutItem?.width??1)
                    .moveTo(layoutItem?.x??this.margin.left, layoutItem?.y??this.top)
                    .lineTo(layoutItem?.width??(doc.page.width-this.margin.right), layoutItem?.y??this.top)
                    .stroke()
                this.top += layoutItem?.height??10
                break;
            case 'tableRow':
                if(layoutItem?.color)
                    doc.fillColor(layoutItem?.color)
                if(layoutItem?.font)
                    doc.font(layoutItem?.font)
                if(layoutItem?.size)
                    doc.fontSize(layoutItem?.size)
                let xPos = this.margin.left+(layoutItem?.x??0)
                layoutItem?.columns?.forEach((column) => {
                    if(column?.color)
                        doc.fillColor(column?.color)
                    if(column?.font)
                        doc.font(column?.font)
                    if(column?.size)
                        doc.fontSize(column?.size)
                    if(column?.width && typeof column?.width === 'string')
                        column.width = parseInt(doc.page.width - this.margin.left - this.margin.right)
                    else if(column?.width && typeof column?.width === 'number')
                        column.width = parseInt(column?.width)
                    const parsedText = this.parseVariables(column?.text, data)
                    const columnOptions = Object.fromEntries(Object.entries(column).filter(([key]) => !['type','color','font','size','text', 'x', 'y'].includes(key)))
                    doc.text(parsedText, xPos, column?.y??this.top, columnOptions)
                    if(column?.width)
                        xPos += column?.width
                    else
                        xPos += doc.widthOfString(parsedText, columnOptions)
                })
                this.top += doc._fontSize * 1.5
                break;
            default:
                break;
        }
    }

    async createInvoice(options, order){

        const doc = await this.startPdf(options)
        await this.generateHeader(doc, options)
        try{
            const layoutJSON = fs.readFileSync(`${process.cwd()}/src/layouts/${options?.pdf?.templates?.invoice}`)
            const layout = JSON.parse(layoutJSON)
            let itemLayout = []
            let itemLayoutRunning = false;
            Object.values(layout).forEach((layoutItem) => {
                if(layoutItem?.type==='itemLoop'||(itemLayoutRunning === true&&layoutItem?.type!=='itemLoopEnd')) {
                    itemLayoutRunning = true
                    itemLayout.push(layoutItem)
                }else if(layoutItem?.type==='itemLoopEnd') {
                    itemLayoutRunning = false
                    order.items.forEach((item, index) => {
                        this.item = index
                        itemLayout.forEach((layoutItem) => this.generateElement(doc,layoutItem, order))
                    })
                }else
                    this.generateElement(doc, layoutItem, order)
            })
        }catch (e) {
            console.log("Invoice error: ",e)
        }
        await this.generateFooter(doc, options)
        try{
            doc.end()
            const docBuffer = await this.getStream.buffer(doc)
            return docBuffer.toString('base64')
        }catch (e) {
            console.log("Invoice error: ",e)
            return null
        }
    }

    async createReturnInvoice(order, returnItems) {
        const doc = new this.PDFDocument({
            size: 'A4',
            margin: 50
        });

        const {shipping_address, billing_address} = order;

        doc
            .font('Helvetica-Bold')
            .fontSize(25)
            .text('Return Invoice', 50, 50);
        doc
            .font('Helvetica')
            .fontSize(12)
            .text(`Return ID: ${order.id}`, 50, 80);
        doc
            .font('Helvetica')
            .fontSize(12)
            .text(`Order ID: ${order.id}`, 50, 100);
        doc
            .font('Helvetica')
            .fontSize(12)
            .text(`Return Date: ${new Date().toISOString()}`, 50, 120);
        doc
            .font('Helvetica')
            .fontSize(12)
            .text(`Billing Address: ${billing_address.first_name} ${billing_address.last_name}`, 50, 140);
        doc
            .font('Helvetica')
            .fontSize(12)
            .text(`Shipping Address: ${shipping_address.first_name} ${shipping_address.last_name}`, 50, 160);
        doc
            .font('Helvetica')
            .fontSize(12)
            .text(`Email: ${order.email}`, 50, 180);
        doc
            .font('Helvetica')
            .fontSize(12)
            .text(`Phone: ${order.phone}`, 50, 200);
        doc
            .font('Helvetica')
            .fontSize(12)
            .text(`Items:`, 50, 220);
        let y = 240;
        for (const item of returnItems) {
            doc
                .font('Helvetica')
                .fontSize(12)
                .text(`${item.quantity} x ${item.title}`, 50, y);
            y += 20;
        }
        doc.end()
        const docBuffer = await this.getStream.buffer(doc)
        return docBuffer.toString('base64')
    }
}

export default PdfGenerator;
