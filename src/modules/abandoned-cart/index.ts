import { Module } from "@medusajs/framework/utils"
import AbandonedCartModuleService from "./service"

declare module "@medusajs/framework/types" {
  interface ModuleImplementations {
    [ABANDONED_CART_MODULE]: AbandonedCartModuleService;
  }
}

export const ABANDONED_CART_MODULE = "postmark_abandoned_cart"

export default Module(ABANDONED_CART_MODULE, {
  service: AbandonedCartModuleService,
})
