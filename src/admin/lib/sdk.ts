import Medusa from "@medusajs/js-sdk"
import { ExtendedAdmin } from "./extended-admin"

const baseSdk = new Medusa({
    baseUrl: __BACKEND_URL__ || "/",
    auth: {
        type: "session",
    },
})
const extendedAdmin = new ExtendedAdmin(baseSdk.client)

export const sdk = {
    ...baseSdk,
    admin: {
        ...baseSdk.admin,
        postmark: extendedAdmin.postmark,
    }
}
