class UserSubscriber {
  constructor({
    postmarkService,
    eventBusService
  }) {
    this.postmarkService_ = postmarkService;
    this.eventBus_ = eventBusService;
    this.eventBus_.subscribe("user.password_reset", async data => {
      await this.postmarkService_.sendNotification("user.password_reset", data, null);
    });
  }
}
export default UserSubscriber;