import PDFDocument from 'pdfkit'
import getStream from "get-stream"
import fs from 'fs'
class PdfGenerator {
    constructor() {
        this.PDFDocument = PDFDocument;
        this.getStream = getStream;
        this.top = 0;
        this.item = 0;
    }

    async startPdf(options) {
        const doc = new this.PDFDocument({
            size: options?.pdf?.settings?.format,
            margin: options?.pdf?.settings?.margin,
        });
        if (options?.pdf?.settings?.font && typeof options?.pdf?.settings?.font !== 'string') {
            try {
                const font = await fetch(`./../../src/fonts/${options?.pdf?.settings?.font?.file}`)
                const arrayBuffer = await font.arrayBuffer()
                doc.registerFont(options?.pdf?.settings?.font?.name, arrayBuffer)
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
                    const layoutJSON = await fetch(`./../../src/layouts/${header?.content}`)
                    layout = await layoutJSON.json()
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
                    const layoutJSON = await fetch(`./../../src/layouts/${footer?.content}`)
                    layout = await layoutJSON.json()
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
        const regex = /{{\s([^{]+)\s}}/gi
        return text.replace(regex, (match, key)=>{
            const keys = key.split('.')
            let value = keys[0]==='item'?data?.items[this.item]:data
            keys.shift()
            keys.forEach(k=>value=value[k]??'__UNDEFINED__')
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
                doc.image(`./../../src/images/${layoutItem.image}`, layoutItem.x, layoutItem.y, imageOptions)
                break;
            case 'text':
                const textOptions = {}
                for(const key in layoutItem) {
                    if(['type','color','font','size','text', 'x', 'y'].includes(key))
                        continue
                    textOptions[key] = layoutItem[key]
                }
                if(layoutItem?.color)
                    doc.fillColor(layoutItem?.color)
                if(layoutItem?.font)
                    doc.font(layoutItem?.font)
                if(layoutItem?.size)
                    doc.fontSize(layoutItem?.size)
                if(layoutItem?.x&&layoutItem?.y)
                    doc.text(this.parseVariables(layoutItem?.text, data), layoutItem?.x, layoutItem?.y, Object.fromEntries(Object.entries(layoutItem).filter(([key]) => !['type','color','font','size','text', 'x', 'y'].includes(key))))
                else
                    doc.text(this.parseVariables(layoutItem?.text, data), Object.fromEntries(Object.entries(layoutItem).filter(([key]) => !['type','color','font','size','text', 'x', 'y'].includes(key))))
                break;
            case 'moveDown':
                doc.moveDown(layoutItem?.lines??1)
                this.top += doc._fontSize * (layoutItem?.lines??1)
                break;
            case 'hr':
                doc
                    .strokeColor(layoutItem?.color??'#aaaaaa')
                    .lineWidth(layoutItem?.width??1)
                    .moveTo(0, layoutItem?.y??this.top)
                    .lineTo(layoutItem?.width??doc.page.width, layoutItem?.y??this.top)
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
                layoutItem?.columns?.forEach((column) => {
                    if(column?.color)
                        doc.fillColor(column?.color)
                    if(column?.font)
                        doc.font(column?.font)
                    if(column?.size)
                        doc.fontSize(column?.size)
                    doc.text(this.parseVariables(column?.text, data), column?.x, column?.y??this.top, Object.fromEntries(Object.entries(column).filter(([key]) => !['type','color','font','size','text', 'x', 'y'].includes(key))))
                })
                break;
            default:
                break;
        }
    }

    async createInvoice(options, order){

        const doc = await this.startPdf(options)
        await this.generateHeader(doc, options)
        try{
            const layoutJSON = await fetch(`./../../src/layouts/${options?.templates?.invoice}`)
            const layout = await layoutJSON.json()
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
                        itemLayout.forEach((layoutItem) => this.generateElement(doc,layoutItem, data))
                    })
                }else
                    this.generateElement(doc, layoutItem, {order})
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
