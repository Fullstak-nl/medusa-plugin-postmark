import { LoaderOptions } from "@medusajs/framework/types";
import { asValue } from "awilix";
import { ServerClient } from "postmark";

export default async function postmarkServerLoader({
    container,
    options,
}: LoaderOptions<{ server_api?: string }>) {
    if (!options?.server_api) return
    const client = new ServerClient(options.server_api)
    const server = await client.getServer()
    container.register("postmarkServer", asValue(server))
}
