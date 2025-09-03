import { MedusaService } from "@medusajs/framework/utils"
import { Reminder } from "../../types/abandoned-cart"

export type PostmarkModuleOptions = {
    abandoned_cart?: {
        reminders: Reminder[]
    }
}

class PostmarkModuleService extends MedusaService({}) {
    protected options: PostmarkModuleOptions

    constructor(_, options: PostmarkModuleOptions) {
        super(arguments)
        this.options = options
    }

    getOptions(): PostmarkModuleOptions {
        return this.options
    }
}


export default PostmarkModuleService
