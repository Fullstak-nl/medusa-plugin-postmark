import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { ABANDONED_CART_MODULE } from "../../src/modules/abandoned-cart"
import { createCartWorkflow, createRegionsWorkflow, createSalesChannelsWorkflow } from "@medusajs/medusa/core-flows"
import { sendAbandonedCartsWorkflow } from "../../src/workflows"
import { Modules } from "@medusajs/framework/utils"
jest.setTimeout(60 * 1000)

medusaIntegrationTestRunner({
    testSuite: ({ getContainer }) => {
        let region: any
        let salesChannel: any
        let appContainer: any

        beforeAll(async () => {
            appContainer = getContainer()
        })

        beforeEach(async () => {
            jest.useFakeTimers();

            region = (await createRegionsWorkflow(appContainer).run({
                input: {
                    regions: [{ name: "Test region", currency_code: "usd", }]
                }
            })).result[0]

            salesChannel = (await createSalesChannelsWorkflow(appContainer).run({
                input: {
                    salesChannelsData: [{ name: "Default Channel", is_disabled: false }]
                }
            })).result[0]
        })
        afterEach(() => {
            jest.useRealTimers();
        })

        describe("SendAbandonedCartsWorkflow", () => {
            it("should handle multiple schedules", async () => {
                const abandonedCartModule = appContainer.resolve(ABANDONED_CART_MODULE)
                const reminderSchedules = await abandonedCartModule.createReminderSchedules([{
                    enabled: true,
                    offset_hours: [
                        "0.01666667" /* 1 minute */,
                        "0.05" /* 3 minutes */
                    ],
                    template_id: "reminder1"
                }, {
                    enabled: true,
                    offset_hours: [
                        "0.0333333" /* 2 minutes */,
                    ],
                    template_id: "reminder2"
                }])
                await createCartWorkflow(appContainer).run({
                    input: {
                        email: "email@test.com",
                        region_id: region.id,
                        sales_channel_id: salesChannel.id,
                        items: [{ title: "Test variant", unit_price: 100, quantity: 1 }],
                    }
                })

                const expectedCounts = [0, 1, 1, 1]

                for (const expectedCount of expectedCounts) {
                    const { result: { updatedCarts } } = await sendAbandonedCartsWorkflow(appContainer).run({
                        input: {
                            reminderSchedules,
                            pagination: { limit: 10, offset: 0 }
                        }
                    })
                    expect(updatedCarts.length).toEqual(expectedCount)

                    jest.advanceTimersByTime(61 * 1000);
                }
            })

            it("should handle empty reminder schedules array", async () => {
                const { result: { updatedCarts, pagination } } = await sendAbandonedCartsWorkflow(appContainer).run({
                    input: {
                        reminderSchedules: [],
                        pagination: { limit: 10, offset: 0 }
                    }
                })

                expect(updatedCarts.length).toEqual(0)
                expect(pagination.totalCount).toEqual(0)
            })

            it("should filter out carts without email or items", async () => {
                const abandonedCartModule = appContainer.resolve(ABANDONED_CART_MODULE)
                const reminderSchedules = await abandonedCartModule.createReminderSchedules([{
                    enabled: true,
                    offset_hours: ["0.01666667"],
                    template_id: "test-reminder"
                }])

                // Create cart without email
                await createCartWorkflow(appContainer).run({
                    input: {
                        region_id: region.id,
                        items: [{ title: "Test variant", unit_price: 100, quantity: 1 }],
                        sales_channel_id: salesChannel.id,
                    }
                })

                // Create cart without items
                await createCartWorkflow(appContainer).run({
                    input: {
                        email: "nolitems@test.com",
                        region_id: region.id,
                        sales_channel_id: salesChannel.id,
                    }
                })

                jest.advanceTimersByTime(61 * 1000);

                const { result: { updatedCarts } } = await sendAbandonedCartsWorkflow(appContainer).run({
                    input: {
                        reminderSchedules,
                        pagination: { limit: 10, offset: 0 }
                    }
                })

                expect(updatedCarts.length).toEqual(0)
            })

            it("should preserve existing metadata when updating cart", async () => {
                const abandonedCartModule = appContainer.resolve(ABANDONED_CART_MODULE)

                // Create cart with existing metadata
                await createCartWorkflow(appContainer).run({
                    input: {
                        email: "metadata@test.com",
                        region_id: region.id,
                        items: [{ title: "Test variant", unit_price: 100, quantity: 1 }],
                        metadata: { custom_field: "custom_value", another_field: 123 },
                        sales_channel_id: salesChannel.id
                    }
                })

                const reminderSchedules = await abandonedCartModule.createReminderSchedules([{
                    enabled: true,
                    offset_hours: ["0.01666667"],
                    template_id: "metadata-test"
                }])

                jest.advanceTimersByTime(61 * 1000);

                const { result: { updatedCarts } } = await sendAbandonedCartsWorkflow(appContainer).run({
                    input: {
                        reminderSchedules,
                        pagination: { limit: 10, offset: 0 }
                    }
                })

                expect(updatedCarts.length).toEqual(1)
                expect(updatedCarts[0]).toBeDefined()
                expect(updatedCarts[0]!.metadata!.custom_field).toEqual("custom_value")
                expect(updatedCarts[0]!.metadata!.another_field).toEqual(123)
                expect(updatedCarts[0]!.metadata!.abandoned_notification).toBeDefined()
            })

            it("should handle multiple carts eligible for same reminder", async () => {
                const abandonedCartModule = appContainer.resolve(ABANDONED_CART_MODULE)

                // Create multiple carts
                await createCartWorkflow(appContainer).run({
                    input: {
                        email: "cart2@test.com",
                        region_id: region.id,
                        items: [{ title: "Test variant", unit_price: 100, quantity: 1 }],
                        sales_channel_id: salesChannel.id
                    }
                })
                await createCartWorkflow(appContainer).run({
                    input: {
                        email: "cart3@test.com",
                        region_id: region.id,
                        items: [{ title: "Test variant", unit_price: 100, quantity: 1 }],
                        sales_channel_id: salesChannel.id
                    }
                })

                const reminderSchedules = await abandonedCartModule.createReminderSchedules([{
                    enabled: true,
                    offset_hours: ["0.01666667"],
                    template_id: "batch-test"
                }])

                jest.advanceTimersByTime(61 * 1000);

                const { result: { updatedCarts } } = await sendAbandonedCartsWorkflow(appContainer).run({
                    input: {
                        reminderSchedules,
                        pagination: { limit: 10, offset: 0 }
                    }
                })

                expect(updatedCarts.length).toEqual(2)
            })

            it("should handle pagination correctly", async () => {
                const abandonedCartModule = appContainer.resolve(ABANDONED_CART_MODULE)

                for (let i = 0; i < 5; i++) {
                    await createCartWorkflow(appContainer).run({
                        input: {
                            email: `pagination${i}@test.com`,
                            region_id: region.id,
                            items: [{ title: "Test variant", unit_price: 100, quantity: 1 }],
                            sales_channel_id: salesChannel.id
                        }
                    })
                }

                const reminderSchedules = await abandonedCartModule.createReminderSchedules([{
                    enabled: true,
                    offset_hours: ["0.01666667"],
                    template_id: "pagination-test"
                }])

                jest.advanceTimersByTime(61 * 1000);

                const { result: { updatedCarts: page1, pagination: pagination1 } } = await sendAbandonedCartsWorkflow(appContainer).run({
                    input: {
                        reminderSchedules,
                        pagination: { limit: 2, offset: 0 }
                    }
                })

                expect(page1.length).toEqual(2)
                expect(pagination1.totalCount).toBeGreaterThanOrEqual(5)

                const { result: { updatedCarts: page2, pagination: pagination2 } } = await sendAbandonedCartsWorkflow(appContainer).run({
                    input: {
                        reminderSchedules,
                        pagination: { limit: 4, offset: 2 }
                    }
                })

                expect(page2.length).toEqual(3)
                expect(pagination2.totalCount).toBeGreaterThanOrEqual(5)

                // Verify no duplicates between pages
                const page1Ids = page1.map(c => c.id)
                const page2Ids = page2.map(c => c.id)
                const intersection = page1Ids.filter(id => page2Ids.includes(id))
                expect(intersection.length).toEqual(0)
            })

            it("should handle boundary time calculation (exactly at delay threshold)", async () => {
                const abandonedCartModule = appContainer.resolve(ABANDONED_CART_MODULE)
                const reminderSchedules = await abandonedCartModule.createReminderSchedules([{
                    enabled: true,
                    offset_hours: ["1"], // Exactly 1 hour
                    template_id: "boundary-test"
                }])

                await createCartWorkflow(appContainer).run({
                    input: {
                        email: "cart3@test.com",
                        region_id: region.id,
                        items: [{ title: "Test variant", unit_price: 100, quantity: 1 }],
                        sales_channel_id: salesChannel.id
                    }
                })

                // Advance time to exactly 1 hour (3600 seconds)
                jest.advanceTimersByTime(3600 * 1000);

                const { result: { updatedCarts } } = await sendAbandonedCartsWorkflow(appContainer).run({
                    input: {
                        reminderSchedules,
                        pagination: { limit: 10, offset: 0 }
                    }
                })

                // Should not process yet (< delay)
                expect(updatedCarts.length).toEqual(0)

                // Advance 1 more second to exceed threshold
                jest.advanceTimersByTime(1 * 1000);

                const { result: { updatedCarts: updatedCarts2 } } = await sendAbandonedCartsWorkflow(appContainer).run({
                    input: {
                        reminderSchedules,
                        pagination: { limit: 10, offset: 0 }
                    }
                })

                // Should process now (>= delay)
                expect(updatedCarts2.length).toEqual(1)
            })

            it("should not send duplicate notifications for same cart and reminder", async () => {
                const abandonedCartModule = appContainer.resolve(ABANDONED_CART_MODULE)
                const reminderSchedules = await abandonedCartModule.createReminderSchedules([{
                    enabled: true,
                    offset_hours: ["0.01666667", "0.03333333"], // 1 minute and 2 minutes
                    template_id: "duplicate-test"
                }])

                await createCartWorkflow(appContainer).run({
                    input: {
                        email: "cart3@test.com",
                        region_id: region.id,
                        items: [{ title: "Test variant", unit_price: 100, quantity: 1 }],
                        sales_channel_id: salesChannel.id
                    }
                })

                jest.advanceTimersByTime(61 * 1000);

                // First notification
                const { result: { updatedCarts: firstRun } } = await sendAbandonedCartsWorkflow(appContainer).run({
                    input: {
                        reminderSchedules,
                        pagination: { limit: 10, offset: 0 }
                    }
                })

                expect(firstRun.length).toEqual(1)

                // Advance time but not enough for next reminder
                jest.advanceTimersByTime(30 * 1000);

                // Second run - should not send duplicate
                const { result: { updatedCarts: secondRun } } = await sendAbandonedCartsWorkflow(appContainer).run({
                    input: {
                        reminderSchedules,
                        pagination: { limit: 10, offset: 0 }
                    }
                })

                expect(secondRun.length).toEqual(0)
            })

            it("should handle carts with items updated before closest reminder date", async () => {
                const abandonedCartModule = appContainer.resolve(ABANDONED_CART_MODULE)

                await createCartWorkflow(appContainer).run({
                    input: {
                        email: "toorecent@test.com",
                        region_id: region.id,
                        sales_channel_id: salesChannel.id,
                        items: [{ title: "Test variant", unit_price: 100, quantity: 1 }],
                    }
                })

                const reminderSchedules = await abandonedCartModule.createReminderSchedules([{
                    enabled: true,
                    offset_hours: ["1"],
                    template_id: "recent-test"
                }])

                // Only advance 30 minutes (not enough)
                jest.advanceTimersByTime(30 * 60 * 1000);

                const { result: { updatedCarts } } = await sendAbandonedCartsWorkflow(appContainer).run({
                    input: {
                        reminderSchedules,
                        pagination: { limit: 10, offset: 0 }
                    }
                })

                // Should not process the cart (items too recent)
                expect(updatedCarts.length).toEqual(0)
            })

            it("should reset timer when cart items are updated before first notification", async () => {
                const abandonedCartModule = appContainer.resolve(ABANDONED_CART_MODULE)
                const reminderSchedules = await abandonedCartModule.createReminderSchedules([{
                    enabled: true,
                    offset_hours: ["0.05"], // 3 minutes
                    template_id: "update-before-test"
                }])

                // Create cart
                const cart = await createCartWorkflow(appContainer).run({
                    input: {
                        email: "updatebefore@test.com",
                        region_id: region.id,
                        items: [{ title: "Original item", unit_price: 100, quantity: 1 }],
                        sales_channel_id: salesChannel.id
                    }
                })

                // Advance time to 2 minutes (before the 3-minute reminder)
                jest.advanceTimersByTime(2 * 60 * 1000);

                // Get the cart module to update line items directly
                const cartModuleService = appContainer.resolve(Modules.CART)
                const lineItems = await cartModuleService.listLineItems({ cart_id: cart.result.id })

                // Update the line item (this will update its updated_at timestamp)
                await cartModuleService.updateLineItems(lineItems[0].id, {
                    quantity: 5
                })

                // Advance time by 2 more minutes (4 minutes total, but only 2 since update)
                jest.advanceTimersByTime(2 * 60 * 1000);

                const { result: { updatedCarts } } = await sendAbandonedCartsWorkflow(appContainer).run({
                    input: {
                        reminderSchedules,
                        pagination: { limit: 10, offset: 0 }
                    }
                })

                // Should not send notification yet (only 2 minutes since item update)
                expect(updatedCarts.length).toEqual(0)

                // Advance time by 2 more minutes (now 4 minutes since item update)
                jest.advanceTimersByTime(2 * 60 * 1000);

                const { result: { updatedCarts: updatedCarts2 } } = await sendAbandonedCartsWorkflow(appContainer).run({
                    input: {
                        reminderSchedules,
                        pagination: { limit: 10, offset: 0 }
                    }
                })

                // Should send notification now
                expect(updatedCarts2.length).toEqual(1)
            })

            it("should reset timer when cart items are updated after first notification", async () => {
                const abandonedCartModule = appContainer.resolve(ABANDONED_CART_MODULE)
                const reminderSchedules = await abandonedCartModule.createReminderSchedules([{
                    enabled: true,
                    offset_hours: ["0.05", "0.1"], // 3 minutes and 6 minutes
                    template_id: "update-after-test"
                }])

                // Create cart
                const cart = await createCartWorkflow(appContainer).run({
                    input: {
                        email: "updateafter@test.com",
                        region_id: region.id,
                        items: [{ title: "Original item", unit_price: 100, quantity: 1 }],
                        sales_channel_id: salesChannel.id
                    }
                })

                // Advance time to trigger first notification (3 minutes)
                jest.advanceTimersByTime(3 * 60 * 1000 + 1000);

                const { result: { updatedCarts: firstNotification } } = await sendAbandonedCartsWorkflow(appContainer).run({
                    input: {
                        reminderSchedules,
                        pagination: { limit: 10, offset: 0 }
                    }
                })

                // Should send first notification
                expect(firstNotification.length).toEqual(1)

                // Update cart items after first notification
                const cartModuleService = appContainer.resolve(Modules.CART)
                const lineItems = await cartModuleService.listLineItems({ cart_id: cart.result.id })

                // Update the line item quantity (this will update its updated_at timestamp)
                await cartModuleService.updateLineItems(lineItems[0].id, {
                    quantity: 10
                })

                // Advance time by 3 minutes (should not trigger second notification yet)
                jest.advanceTimersByTime(3 * 60 * 1000);

                const { result: { updatedCarts: secondCheck } } = await sendAbandonedCartsWorkflow(appContainer).run({
                    input: {
                        reminderSchedules,
                        pagination: { limit: 10, offset: 0 }
                    }
                })

                // Should not send notification (timer was reset)
                expect(secondCheck.length).toEqual(0)

                // Advance time to trigger first notification again (from new timestamp)
                jest.advanceTimersByTime(1 * 60 * 1000);

                const { result: { updatedCarts: thirdCheck } } = await sendAbandonedCartsWorkflow(appContainer).run({
                    input: {
                        reminderSchedules,
                        pagination: { limit: 10, offset: 0 }
                    }
                })

                // Should send notification again (3 minutes since item update)
                expect(thirdCheck.length).toEqual(1)
            })
        })
    },
})
