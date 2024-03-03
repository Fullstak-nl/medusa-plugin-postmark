class GiftCardSubscriber {
    constructor({ eventBusService, postmarkService }) {
        this.postmarkService_ = postmarkService
        this.eventBus_ = eventBusService

        this.eventBus_.subscribe("gift_card.created", async (data) => {
            await this.postmarkService_.sendNotification(
                "gift_card.created",
                data,
                undefined
            )
        })
    }
}

export default GiftCardSubscriber
