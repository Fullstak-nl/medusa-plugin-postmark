import PostmarkService from "../services/postmark";
import { Cart } from "@medusajs/medusa";
const upsellReminder = async (
    container,
    options
) => {
    const jobSchedulerService = container.resolve("jobSchedulerService");
    jobSchedulerService.create("upsell-reminder", {}, "* * * * *", async () => {
        // job to execute
        const postmarkService = container.resolve(
            "postmarkService"
        );
        console.log(
            "Running upsell reminder job"
        )
        const orders = await postmarkService.remindUpsellOrders();
    });
};

export default upsellReminder;
