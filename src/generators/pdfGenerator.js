import PDFDocument from 'pdfkit'
import getStream from "get-stream"
import fs from 'fs'


const isoAlpha2Countries = {
    AF: "Afghanistan",
    AX: "Aland Islands",
    AL: "Albania",
    DZ: "Algeria",
    AS: "American Samoa",
    AD: "Andorra",
    AO: "Angola",
    AI: "Anguilla",
    AQ: "Antarctica",
    AG: "Antigua And Barbuda",
    AR: "Argentina",
    AM: "Armenia",
    AW: "Aruba",
    AU: "Australia",
    AT: "Austria",
    AZ: "Azerbaijan",
    BS: "Bahamas",
    BH: "Bahrain",
    BD: "Bangladesh",
    BB: "Barbados",
    BY: "Belarus",
    BE: "Belgium",
    BZ: "Belize",
    BJ: "Benin",
    BM: "Bermuda",
    BT: "Bhutan",
    BO: "Bolivia",
    BA: "Bosnia And Herzegovina",
    BW: "Botswana",
    BV: "Bouvet Island",
    BR: "Brazil",
    IO: "British Indian Ocean Territory",
    BN: "Brunei Darussalam",
    BG: "Bulgaria",
    BF: "Burkina Faso",
    BI: "Burundi",
    KH: "Cambodia",
    CM: "Cameroon",
    CA: "Canada",
    CV: "Cape Verde",
    KY: "Cayman Islands",
    CF: "Central African Republic",
    TD: "Chad",
    CL: "Chile",
    CN: "China",
    CX: "Christmas Island",
    CC: "Cocos (Keeling) Islands",
    CO: "Colombia",
    KM: "Comoros",
    CG: "Congo",
    CD: "Congo, Democratic Republic",
    CK: "Cook Islands",
    CR: "Costa Rica",
    CI: "Cote D'Ivoire",
    HR: "Croatia",
    CU: "Cuba",
    CY: "Cyprus",
    CZ: "Czech Republic",
    DK: "Denmark",
    DJ: "Djibouti",
    DM: "Dominica",
    DO: "Dominican Republic",
    EC: "Ecuador",
    EG: "Egypt",
    SV: "El Salvador",
    GQ: "Equatorial Guinea",
    ER: "Eritrea",
    EE: "Estonia",
    ET: "Ethiopia",
    FK: "Falkland Islands (Malvinas)",
    FO: "Faroe Islands",
    FJ: "Fiji",
    FI: "Finland",
    FR: "France",
    GF: "French Guiana",
    PF: "French Polynesia",
    TF: "French Southern Territories",
    GA: "Gabon",
    GM: "Gambia",
    GE: "Georgia",
    DE: "Germany",
    GH: "Ghana",
    GI: "Gibraltar",
    GR: "Greece",
    GL: "Greenland",
    GD: "Grenada",
    GP: "Guadeloupe",
    GU: "Guam",
    GT: "Guatemala",
    GG: "Guernsey",
    GN: "Guinea",
    GW: "Guinea-Bissau",
    GY: "Guyana",
    HT: "Haiti",
    HM: "Heard Island & Mcdonald Islands",
    VA: "Holy See (Vatican City State)",
    HN: "Honduras",
    HK: "Hong Kong",
    HU: "Hungary",
    IS: "Iceland",
    IN: "India",
    ID: "Indonesia",
    IR: "Iran, Islamic Republic Of",
    IQ: "Iraq",
    IE: "Ireland",
    IM: "Isle Of Man",
    IL: "Israel",
    IT: "Italy",
    JM: "Jamaica",
    JP: "Japan",
    JE: "Jersey",
    JO: "Jordan",
    KZ: "Kazakhstan",
    KE: "Kenya",
    KI: "Kiribati",
    KR: "South Korea",
    KW: "Kuwait",
    KG: "Kyrgyzstan",
    LA: "Lao People's Democratic Republic",
    LV: "Latvia",
    LB: "Lebanon",
    LS: "Lesotho",
    LR: "Liberia",
    LY: "Libyan Arab Jamahiriya",
    LI: "Liechtenstein",
    LT: "Lithuania",
    LU: "Luxembourg",
    MO: "Macao",
    MK: "Macedonia",
    MG: "Madagascar",
    MW: "Malawi",
    MY: "Malaysia",
    MV: "Maldives",
    ML: "Mali",
    MT: "Malta",
    MH: "Marshall Islands",
    MQ: "Martinique",
    MR: "Mauritania",
    MU: "Mauritius",
    YT: "Mayotte",
    MX: "Mexico",
    FM: "Micronesia, Federated States Of",
    MD: "Moldova",
    MC: "Monaco",
    MN: "Mongolia",
    ME: "Montenegro",
    MS: "Montserrat",
    MA: "Morocco",
    MZ: "Mozambique",
    MM: "Myanmar",
    NA: "Namibia",
    NR: "Nauru",
    NP: "Nepal",
    NL: "Netherlands",
    AN: "Netherlands Antilles",
    NC: "New Caledonia",
    NZ: "New Zealand",
    NI: "Nicaragua",
    NE: "Niger",
    NG: "Nigeria",
    NU: "Niue",
    NF: "Norfolk Island",
    MP: "Northern Mariana Islands",
    NO: "Norway",
    OM: "Oman",
    PK: "Pakistan",
    PW: "Palau",
    PS: "Palestinian Territory, Occupied",
    PA: "Panama",
    PG: "Papua New Guinea",
    PY: "Paraguay",
    PE: "Peru",
    PH: "Philippines",
    PN: "Pitcairn",
    PL: "Poland",
    PT: "Portugal",
    PR: "Puerto Rico",
    QA: "Qatar",
    RE: "Reunion",
    RO: "Romania",
    RU: "Russian Federation",
    RW: "Rwanda",
    BL: "Saint Barthelemy",
    SH: "Saint Helena",
    KN: "Saint Kitts And Nevis",
    LC: "Saint Lucia",
    MF: "Saint Martin",
    PM: "Saint Pierre And Miquelon",
    VC: "Saint Vincent And Grenadines",
    WS: "Samoa",
    SM: "San Marino",
    ST: "Sao Tome And Principe",
    SA: "Saudi Arabia",
    SN: "Senegal",
    RS: "Serbia",
    SC: "Seychelles",
    SL: "Sierra Leone",
    SG: "Singapore",
    SK: "Slovakia",
    SI: "Slovenia",
    SB: "Solomon Islands",
    SO: "Somalia",
    ZA: "South Africa",
    GS: "South Georgia And Sandwich Isl.",
    ES: "Spain",
    LK: "Sri Lanka",
    SD: "Sudan",
    SR: "Suriname",
    SJ: "Svalbard And Jan Mayen",
    SZ: "Swaziland",
    SE: "Sweden",
    CH: "Switzerland",
    SY: "Syrian Arab Republic",
    TW: "Taiwan",
    TJ: "Tajikistan",
    TZ: "Tanzania",
    TH: "Thailand",
    TL: "Timor-Leste",
    TG: "Togo",
    TK: "Tokelau",
    TO: "Tonga",
    TT: "Trinidad And Tobago",
    TN: "Tunisia",
    TR: "Turkey",
    TM: "Turkmenistan",
    TC: "Turks And Caicos Islands",
    TV: "Tuvalu",
    UG: "Uganda",
    UA: "Ukraine",
    AE: "United Arab Emirates",
    GB: "United Kingdom",
    US: "United States",
    UM: "United States Outlying Islands",
    UY: "Uruguay",
    UZ: "Uzbekistan",
    VU: "Vanuatu",
    VE: "Venezuela",
    VN: "Viet Nam",
    VG: "Virgin Islands, British",
    VI: "Virgin Islands, U.S.",
    WF: "Wallis And Futuna",
    EH: "Western Sahara",
    YE: "Yemen",
    ZM: "Zambia",
    ZW: "Zimbabwe",
}
class PdfGenerator {
    constructor() {
        this.PDFDocument = PDFDocument
        this.getStream = getStream
        this.top = 0
        this.item = 0
        this.lastHeight = 0
        this.margin = { top: 0, left: 0, right: 0, bottom: 0 }
        this.empty = '__UNDEFINED__'
    }

    async startPdf(options) {
        const doc = new this.PDFDocument({
            size: options?.pdf?.settings?.format ?? 'A4',
            margin: options?.pdf?.settings?.margin ?? this.margin,
        })
        this.margin = options?.pdf?.settings?.margin ?? this.margin
        this.empty = options?.pdf?.settings?.empty ?? this.empty
        this.top = this.margin.top ?? 0
        if (options?.pdf?.settings?.font && typeof options?.pdf?.settings?.font !== 'string') {
            try {
                const fontBuffer = fs.readFileSync(`${process.cwd()}/src/fonts/${options?.pdf?.settings?.font?.file}`)
                doc.registerFont(options?.pdf?.settings?.font?.name, fontBuffer)
            } catch (e) {
                console.log("Font error:", e)
            }
        }
        return doc
    }

    async generateHeader(doc, options) {
        const header = options?.pdf?.header;
        if (header && header?.enabled) {
            try {
                let layout = []
                if (header?.content) {
                    const layoutJSON = fs.readFileSync(`${process.cwd()}/src/layouts/${header.content}`)
                    layout = JSON.parse(layoutJSON)
                }
                layout.forEach((layoutItem) => this.generateElement(doc, layoutItem))
                this.top += header?.height ?? 50
            } catch (e) {
                console.log("Header error:", e)
                return
            }
        }
    }

    async generateFooter(doc, options) {
        const footer = options?.pdf?.footer;
        if (footer && footer?.enabled) {
            try {
                let layout = []
                if (footer?.content) {
                    const layoutJSON = fs.readFileSync(`${process.cwd()}/src/layouts/${footer.content}`)
                    layout = JSON.parse(layoutJSON)
                }
                layout.forEach((layoutItem) => this.generateElement(doc, layoutItem))
                this.top += footer?.height ?? 50
            } catch (e) {
                console.log("Footer error:", e)
                return
            }
        }
    }

    getVariable(keys, data) {
        let value = keys[0] === 'item' ? data?.items[this.item] : data
        keys.shift()
        keys.forEach(k => value = value[k] ?? this.empty)
        return value
    }

    parseVariables(text, data) {
        const ifRegex = /\{\{\s*if\s+([\w\s.]+)\s*\}\}([\s\S]*?)\{\{\s*endif\s*\}\}/gi
        text = text.replace(ifRegex, (match, statement, content) => {
            const keys = statement.startsWith('not ') ? statement.split('not ')[1].split('.') : statement.split('.')
            const value = this.getVariable(keys, data)
            if (value === this.empty || value === false || value === "") return statement.startsWith('not ') ? content : ''
            return statement.startsWith('not ') ? '' : content
        })
        const regex = /{{\s(.*?)(?=\s}})\s}}/ig
        return text.replace(regex, (match, key) => {
            let [keys, filter] = key.split(' | ')
            keys = keys.split('.')
            let value = this.getVariable(keys, data)
            if (filter) {
                if (filter.startsWith('date')) {
                    const dateRegex = /date\(['"]([^'"]+)['"][,\s]{0,2}([^))]*)\)/i
                    const [_, locale, format] = dateRegex.exec(filter)
                    value = new Date(value).toLocaleDateString(locale, JSON.parse(format.replaceAll("'", '"')) ?? {})
                } else if (filter.startsWith('currency')) {
                    const numberRegex = /currency\(['"]([^'"]+)['"]\)/i
                    const [_, locale] = numberRegex.exec(filter)
                    if (typeof value === 'string')
                        value = parseFloat(value.replace(data?.currency_code.toUpperCase(), ''))
                    value = new Intl.NumberFormat(locale, { style: 'currency', currency: data?.currency_code.toUpperCase() }).format(value / 100)
                } else if (filter.startsWith('country')) {
                    if (typeof value === 'string')
                        value = isoAlpha2Countries[value.toUpperCase()] ?? ""
                }
            }
            return value ?? this.empty
        })
    }

    generateElement(doc, layoutItem, data) {
        switch (layoutItem.type) {
            case 'image': {
                const imageOptions = {
                    'fit': layoutItem?.fit
                };
                if (layoutItem?.align) imageOptions.align = layoutItem?.align;

                if (layoutItem?.valign) imageOptions.valign = layoutItem?.valign;

                doc.image(`${process.cwd()}/src/images/${layoutItem.image}`, layoutItem.x, this.margin.left + (layoutItem?.y ?? 0), imageOptions);
                break;
            }
            case 'text': {
                if (layoutItem?.color) doc.fillColor(layoutItem?.color);

                if (layoutItem?.font) doc.font(layoutItem?.font);

                if (layoutItem?.size) doc.fontSize(layoutItem?.size);

                if (layoutItem?.width && typeof layoutItem?.width === 'string') layoutItem.width = parseInt(doc.page.width - this.margin.left - this.margin.right);
                else if (layoutItem?.width && typeof layoutItem?.width === 'number') layoutItem.width = parseInt(layoutItem?.width);

                const parsedText = this.parseVariables(layoutItem?.text, data);
                const textOptions = Object.fromEntries(Object.entries(layoutItem).filter(([key]) => !['type', 'color', 'font', 'size', 'text', 'x', 'y'].includes(key)));
                this.lastHeight = doc.heightOfString(parsedText, textOptions);
                if (layoutItem?.x || layoutItem?.y) doc.text(this.parseVariables(layoutItem?.text, data), this.margin.left + (layoutItem?.x ?? 0), layoutItem?.y ?? this.top, textOptions);
                else
                    doc.text(this.parseVariables(layoutItem?.text, data), this.margin.left, this.top, textOptions);
                break;
            }
            case 'moveDown': {
                if (layoutItem?.useMeasure) this.top += parseInt(this.lastHeight);
                else
                    this.top += parseInt(doc._fontSize) * 1.5 * (layoutItem?.lines ?? 1);
                break;
            }
            case 'hr': {
                doc.strokeColor(layoutItem?.color ?? '#aaaaaa').lineWidth(layoutItem?.width ?? 1).moveTo(layoutItem?.x ?? this.margin.left, layoutItem?.y ?? this.top).lineTo(layoutItem?.width ?? doc.page.width - this.margin.right, layoutItem?.y ?? this.top).stroke();
                this.top += layoutItem?.height ?? 10;
                break;
            }
            case 'tableRow': {
                if (layoutItem?.color) doc.fillColor(layoutItem?.color);

                if (layoutItem?.font) doc.font(layoutItem?.font);

                if (layoutItem?.size) doc.fontSize(layoutItem?.size);

                let xPos = this.margin.left + (layoutItem?.x ?? 0);
                layoutItem?.columns?.forEach(column => {
                    if (column?.color) doc.fillColor(column?.color);

                    if (column?.font) doc.font(column?.font);

                    if (column?.size) doc.fontSize(column?.size);

                    if (column?.width && typeof column?.width === 'string') column.width = parseInt(doc.page.width - this.margin.left - this.margin.right);
                    else if (column?.width && typeof column?.width === 'number') column.width = parseInt(column?.width);

                    const parsedText = this.parseVariables(column?.text, data);
                    const columnOptions = Object.fromEntries(Object.entries(column).filter(([key]) => !['type', 'color', 'font', 'size', 'text', 'x', 'y'].includes(key)));
                    doc.text(parsedText, xPos, column?.y ?? this.top, columnOptions);
                    if (column?.width) xPos += column?.width;
                    else
                        xPos += doc.widthOfString(parsedText, columnOptions);
                });
                this.top += doc._fontSize * 1.5;
                break;
            }
            default: {
                break;
            }
        }
    }

    async createInvoice(options, order) {

        const doc = await this.startPdf(options)
        await this.generateHeader(doc, options)
        try {
            const layoutJSON = fs.readFileSync(`${process.cwd()}/src/layouts/${options?.pdf?.templates?.invoice}`)
            const layout = JSON.parse(layoutJSON)
            let itemLayout = []
            let itemLayoutRunning = false;
            Object.values(layout).forEach((layoutItem) => {
                if (layoutItem?.type === 'itemLoop' || (itemLayoutRunning === true && layoutItem?.type !== 'itemLoopEnd')) {
                    itemLayoutRunning = true
                    itemLayout.push(layoutItem)
                } else if (layoutItem?.type === 'itemLoopEnd') {
                    itemLayoutRunning = false
                    order.items.forEach((item, index) => {
                        this.item = index
                        itemLayout.forEach((layoutItem) => this.generateElement(doc, layoutItem, order))
                    })
                } else
                    this.generateElement(doc, layoutItem, order)
            })
        } catch (e) {
            console.log("Invoice error:", e)
        }
        await this.generateFooter(doc, options)
        try {
            doc.end()
            const docBuffer = await this.getStream.buffer(doc)
            return docBuffer.toString('base64')
        } catch (e) {
            console.log("Invoice error:", e)
            return
        }
    }

    async createReturnInvoice(order, returnItems) {
        const doc = new this.PDFDocument({
            size: 'A4',
            margin: 50
        });

        const { shipping_address, billing_address } = order;

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
