
import postmarkServerLoader from "./loaders/postmark-server";
import PostmarkModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

declare module "@medusajs/framework/types" {
    interface ModuleImplementations {
        [POSTMARK_MODULE]: PostmarkModuleService;
    }
}

export const POSTMARK_MODULE = "postmarkModuleService"

export default Module(POSTMARK_MODULE, {
    service: PostmarkModuleService, loaders: [postmarkServerLoader]
})
