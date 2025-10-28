import { LoaderOptions } from "@medusajs/framework/types";
import { MedusaError } from "@medusajs/framework/utils";
import { asValue } from "awilix";
import { ServerClient } from "postmark";

export default async function postmarkServerLoader({
    container,
    options,
}: LoaderOptions<{ apiKey?: string }>) {
    if (!options?.apiKey)
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "Postmark API key not provided")

    const client = new ServerClient(options.apiKey)
    container.register("postmarkClient", asValue(client))
}
