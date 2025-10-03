import { MedusaService } from "@medusajs/framework/utils"
import { Reminder } from "../../types/reminder-schedules"
import { ServerClient } from "postmark"

export type PostmarkModuleOptions = {
    server_api?: string
    server_id: number
    abandoned_cart?: {
        reminders: Reminder[]
    }
}

type Server = Awaited<ReturnType<ServerClient["getServer"]>>

class PostmarkModuleService extends MedusaService({}) {
    protected options: PostmarkModuleOptions

    constructor({ postmarkServer }: { postmarkServer: Server }, options: PostmarkModuleOptions) {
        super(arguments)
        this.options = { ...options, server_id: postmarkServer.ID }
    }

    getOptions(): PostmarkModuleOptions {
        return this.options
    }
}


export default PostmarkModuleService
