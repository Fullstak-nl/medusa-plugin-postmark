import PDFDocument from 'pdfkit'
import getStream from "get-stream"
import fs from 'fs'
class PdfGenerator {
    constructor() {
        this.PDFDocument = PDFDocument;
        this.getStream = getStream;
        this.top = 0;
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
                let layout = {}
                if(header?.content) {
                    const layoutJSON = await fetch(`./../../src/layouts/${header?.content}`)
                    layout = await layoutJSON.json()
                }else
                    layout = {}
                Object.values(layout).forEach((layoutItem) => this.generateElement(doc,layoutItem))
                this.top += header?.height??50
            }catch (e) {
                console.log("Header error: ",e)
                return
            }
        }
    }

    generateElement(doc, layoutItem) {
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
                doc.text(layoutItem?.text, layoutItem?.x, layoutItem?.y, textOptions)
                break;
            case 'moveDown':
                doc.moveDown(layoutItem?.lines)
                break;
            case 'hr':
                doc
                    .strokeColor(layoutItem?.color??'#aaaaaa')
                    .lineWidth(layoutItem?.width??1)
                    .moveTo(0, this.top)
                    .lineTo(doc.page.width, this.top)
                    .stroke()
                this.top += layoutItem?.height??10
                break;
            default:
                break;
        }
    }

    async createInvoice(options, order, items){
        console.log(order,items)
        const doc = await this.startPdf(options)
        await this.generateHeader(doc, options)
        try{
            const layoutJSON = await fetch(`./../../src/layouts/${options?.templates?.invoice}`)
            const layout = await layoutJSON.json()
            Object.values(layout).forEach((layoutItem) => {

            })
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
