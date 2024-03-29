import { Cart } from "@medusajs/medusa";
import PostmarkService from "../services/postmark";

const abandonedcart = async (
    container,
    options
) => {
  const jobSchedulerService = container.resolve("jobSchedulerService");
  jobSchedulerService.create("abandoned-carts", {}, "0 * * * *", async () => {

    const postmarkService = container.resolve(
        "postmarkService"
    );
    await postmarkService.getAbandonedCarts();
  });
};

export default abandonedcart;
