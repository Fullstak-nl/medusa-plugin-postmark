import PdfGenerator from "../generators/pdfGenerator";

class OrderSubscriber {

    /**
     * @param {NotificationService} notificationService - Notification service
     */
   constructor({ notificationService }) {
     this.notificationService_ = notificationService
     this.notificationService_.registerAttachmentGenerator(new PdfGenerator())

     this.notificationService_.subscribe("cart.updated", "postmark")
     this.notificationService_.subscribe("order.placed", "postmark")
     this.notificationService_.subscribe("order.canceled", "postmark")
     this.notificationService_.subscribe("order.shipment_created", "postmark")
     this.notificationService_.subscribe("customer.created", "postmark")
     this.notificationService_.subscribe("customer.password_reset", "postmark")
   }
 }

 export default OrderSubscriber
