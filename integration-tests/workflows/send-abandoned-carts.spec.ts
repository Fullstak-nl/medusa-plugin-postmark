import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { ABANDONED_CART_MODULE } from "../../src/modules/abandoned-cart"
import { createCartWorkflow, createRegionsWorkflow, createSalesChannelsWorkflow } from "@medusajs/medusa/core-flows"
import { sendAbandonedCartsWorkflow } from "../../src/workflows"
import { Modules } from "@medusajs/framework/utils"
import { MedusaContainer } from "@medusajs/framework"
jest.setTimeout(60 * 1000)

medusaIntegrationTestRunner({
  testSuite: ({ getContainer }) => {
    let region: any
    let salesChannel: any
    let appContainer: MedusaContainer

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
      describe("Basics", () => {
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

        it("should ignore disabled reminder schedules", async () => {
          const abandonedCartModule = appContainer.resolve(ABANDONED_CART_MODULE)
          // Create a cart that would be eligible if schedule was enabled
          await createCartWorkflow(appContainer).run({
            input: {
              email: "disabledschedule@test.com",
              region_id: region.id,
              items: [{ title: "Test variant", unit_price: 100, quantity: 1 }],
              sales_channel_id: salesChannel.id
            }
          })
          // Create a disabled reminder schedule
          const reminderSchedules = await abandonedCartModule.createReminderSchedules([
            {
              enabled: false,
              delays_iso: ["PT1M"],
              template_id: "disabled-test"
            }
          ])
          jest.advanceTimersByTime(61 * 1000);
          const { result: { updatedCarts } } = await sendAbandonedCartsWorkflow(appContainer).run({
            input: {
              reminderSchedules,
              pagination: { limit: 10, offset: 0 }
            }
          })
          expect(updatedCarts.length).toEqual(0)
        })

        it("should filter out carts without email or items", async () => {
          const abandonedCartModule = appContainer.resolve(ABANDONED_CART_MODULE)
          const reminderSchedules = await abandonedCartModule.createReminderSchedules([{
            enabled: true,
            delays_iso: ["PT1M"],
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
            delays_iso: ["PT1M"],
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
          expect(updatedCarts[0]!.metadata!.abandoned_cart_tracking).toBeDefined()
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
            delays_iso: ["PT1M"],
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
      })

      describe("Notification", () => {
        it("should handle multiple overlapping schedules", async () => {
          const abandonedCartModule = appContainer.resolve(ABANDONED_CART_MODULE)
          const reminderSchedules = await abandonedCartModule.createReminderSchedules([{
            enabled: true,
            delays_iso: [
              "PT1M",
              "PT2M"
            ],
            template_id: "reminder1"
          }, {
            enabled: true,
            delays_iso: [
              "PT2M",
              "PT3M"
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
          const expectedCounts = [0, 1, 2, 1]
          let previousNotificationCount = 0
          for (const expectedCount of expectedCounts) {
            const { result: { updatedCarts } } = await sendAbandonedCartsWorkflow(appContainer).run({
              input: {
                reminderSchedules,
                pagination: { limit: 10, offset: 0 }
              }
            })
            // Count the total number of notifications sent (sum across all carts)
            const totalNotificationsSent = updatedCarts.reduce((sum, cart) => {
              const tracking = cart.metadata?.abandoned_cart_tracking as any
              if (!tracking?.sent_notifications) return sum
              return sum + Object.keys(tracking.sent_notifications).length
            }, 0)
            // Calculate how many new notifications were sent in this run
            const newNotificationsSent = totalNotificationsSent - previousNotificationCount
            previousNotificationCount = totalNotificationsSent
            expect(newNotificationsSent).toEqual(expectedCount)
            jest.advanceTimersByTime(61 * 1000);
          }
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
            delays_iso: ["PT1M"],
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

        it("should handle boundary time calculation (exactly at delay threshold)", async () => {
          const abandonedCartModule = appContainer.resolve(ABANDONED_CART_MODULE)
          const reminderSchedules = await abandonedCartModule.createReminderSchedules([{
            enabled: true,
            delays_iso: ["PT1H"], // Exactly 1 hour
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
          // Advance time to less than 1 hour (3600 seconds)
          jest.advanceTimersByTime(3599 * 1000);
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

        it("should not send duplicate notifications", async () => {
          const abandonedCartModule = appContainer.resolve(ABANDONED_CART_MODULE)
          const reminderSchedules = await abandonedCartModule.createReminderSchedules([{
            enabled: true,
            delays_iso: ["PT1M"],
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

          jest.advanceTimersByTime(120 * 1000);
          // Second run - should not send duplicate
          const { result: { updatedCarts: secondRun } } = await sendAbandonedCartsWorkflow(appContainer).run({
            input: {
              reminderSchedules,
              pagination: { limit: 10, offset: 0 }
            }
          })
          expect(secondRun.length).toEqual(0)
        })

        it("should not send outdated notifications, only the latest for each schedule", async () => {
          const abandonedCartModule = appContainer.resolve(ABANDONED_CART_MODULE)
          const reminderSchedules = await abandonedCartModule.createReminderSchedules([{
            enabled: true,
            delays_iso: ["PT1M", "PT2M"],
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
          jest.advanceTimersByTime(121 * 1000);

          const { result: { updatedCarts } } = await sendAbandonedCartsWorkflow(appContainer).run({
            input: {
              reminderSchedules,
              pagination: { limit: 10, offset: 0 }
            }
          })
          // Should only send the 2-minute notification, not the 1-minute one
          expect(updatedCarts.length).toEqual(1)
          expect(updatedCarts[0]?.metadata?.abandoned_cart_tracking).toMatchObject({
            sent_notifications: {
              [`${reminderSchedules[0].id}:PT2M`]: expect.any(Object)
            }
          })
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
            delays_iso: ["PT1H"],
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
      })

      describe("Reset Cycle on Update: true", () => {
        it("should reset timer when cart items are updated before first notification", async () => {
          const abandonedCartModule = appContainer.resolve(ABANDONED_CART_MODULE)
          const reminderSchedules = await abandonedCartModule.createReminderSchedules([{
            enabled: true,
            delays_iso: ["PT3M"], // 3 minutes
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
            delays_iso: ["PT10M", "PT15M"],
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
          // Advance time to trigger first notification (10 minutes)
          jest.advanceTimersByTime(10 * 60 * 1000 + 1000);
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
          // Advance time by 6 minutes (should not trigger second notification since cycle was reset)
          jest.advanceTimersByTime(6 * 60 * 1000);
          const { result: { updatedCarts: secondCheck } } = await sendAbandonedCartsWorkflow(appContainer).run({
            input: {
              reminderSchedules,
              pagination: { limit: 10, offset: 0 }
            }
          })
          // Should not send second notification (timer was reset)
          expect(secondCheck.length).toEqual(0)
          // Advance time by another 4 minutes to trigger first notification again (from new timestamp)
          jest.advanceTimersByTime(4 * 60 * 1000);
          const { result: { updatedCarts: thirdCheck } } = await sendAbandonedCartsWorkflow(appContainer).run({
            input: {
              reminderSchedules,
              pagination: { limit: 10, offset: 0 }
            }
          })
          // Should send notification again (10 minutes since item update)
          expect(thirdCheck.length).toEqual(1)
          // Advance time by another 5 minutes to trigger second notification (from new timestamp)
          jest.advanceTimersByTime(5 * 60 * 1000);
          const { result: { updatedCarts: fourthCheck } } = await sendAbandonedCartsWorkflow(appContainer).run({
            input: {
              reminderSchedules,
              pagination: { limit: 10, offset: 0 }
            }
          })
          // Should send second notification (15 minutes since item update)
          expect(fourthCheck.length).toEqual(1)
        })
      })

      describe("Reset Cycle on Update: false", () => {
        it("does not resend first notification after cart update", async () => {
          const abandonedCartModule = appContainer.resolve(ABANDONED_CART_MODULE)
          const reminderSchedules = await abandonedCartModule.createReminderSchedules([{
            enabled: true,
            delays_iso: ["PT3M", "PT10M"],
            template_id: "no-reset-test",
            reset_on_cart_update: false
          }])
          // Create cart
          const cart = await createCartWorkflow(appContainer).run({
            input: {
              email: "noupdate@test.com",
              region_id: region.id,
              items: [{ title: "Original item", unit_price: 100, quantity: 1 }],
              sales_channel_id: salesChannel.id
            }
          })
          // Advance time to 4 minutes (enough for notification)
          jest.advanceTimersByTime(4 * 60 * 1000);
          const { result: { updatedCarts: firstRun } } = await sendAbandonedCartsWorkflow(appContainer).run({
            input: {
              reminderSchedules,
              pagination: { limit: 10, offset: 0 }
            }
          })
          expect(firstRun.length).toEqual(1)
          // Update the line item (this will update its updated_at timestamp)
          const cartModuleService = appContainer.resolve(Modules.CART)
          const lineItems = await cartModuleService.listLineItems({ cart_id: cart.result.id })
          await cartModuleService.updateLineItems(lineItems[0].id, { quantity: 5 })
          // Advance time by 4 more minutes (enough for notification if it were allowed)
          jest.advanceTimersByTime(4 * 60 * 1000);
          const { result: { updatedCarts: secondRun } } = await sendAbandonedCartsWorkflow(appContainer).run({
            input: {
              reminderSchedules,
              pagination: { limit: 10, offset: 0 }
            }
          })
          // Should NOT send the first notification again after update
          expect(secondRun.length).toEqual(0)


          // Advance time by 6 more minutes (to total of 10 minutes since update)
          jest.advanceTimersByTime(6 * 60 * 1000);
          const { result: { updatedCarts: thirdRun } } = await sendAbandonedCartsWorkflow(appContainer).run({
            input: {
              reminderSchedules,
              pagination: { limit: 10, offset: 0 }
            }
          })
          // Should send only the second notification after update
          expect(thirdRun.length).toEqual(1)
          expect(thirdRun[0]?.metadata?.abandoned_cart_tracking).toMatchObject({
            sent_notifications: {
              [`${reminderSchedules[0].id}:PT10M`]: expect.any(Object)
            }
          })
        })
      })

      describe("Notify Existing Carts: true", () => {
        it("notifies existing carts", async () => {
          const abandonedCartModule = appContainer.resolve(ABANDONED_CART_MODULE)
          const cart = await createCartWorkflow(appContainer).run({
            input: {
              email: "existingcart@test.com",
              region_id: region.id,
              items: [{ title: "Test variant", unit_price: 100, quantity: 1 }],
              sales_channel_id: salesChannel.id
            }
          })
          jest.advanceTimersByTime(10 * 60 * 1000);
          const reminderSchedules = await abandonedCartModule.createReminderSchedules([{
            enabled: true,
            delays_iso: ["PT5M"],
            template_id: "notify-existing-true",
            notify_existing: true
          }])
          const { result: { updatedCarts } } = await sendAbandonedCartsWorkflow(appContainer).run({
            input: {
              reminderSchedules,
              pagination: { limit: 10, offset: 0 }
            }
          })
          expect(updatedCarts.length).toEqual(1)
          expect(updatedCarts[0]?.email).toEqual("existingcart@test.com")
        })

        it("does not notify for smaller delay if already notified for bigger", async () => {
          const abandonedCartModule = appContainer.resolve(ABANDONED_CART_MODULE)
          const cart = await createCartWorkflow(appContainer).run({
            input: {
              email: "already-notified@test.com",
              region_id: region.id,
              items: [{ title: "Test variant", unit_price: 100, quantity: 1 }],
              sales_channel_id: salesChannel.id
            }
          })
          jest.advanceTimersByTime(30 * 60 * 1000); // 30 minutes
          let reminderSchedules = await abandonedCartModule.createReminderSchedules([{
            enabled: true,
            delays_iso: ["PT30M"],
            template_id: "same-schedule",
            notify_existing: true
          }])
          let result = await sendAbandonedCartsWorkflow(appContainer).run({
            input: {
              reminderSchedules,
              pagination: { limit: 10, offset: 0 }
            }
          })
          expect(result.result.updatedCarts.length).toEqual(1)
          const scheduleId = reminderSchedules[0].id
          reminderSchedules = await abandonedCartModule.updateReminderSchedules([{
            id: scheduleId,
            enabled: true,
            delays_iso: ["PT10M", "PT30M"],
            template_id: "same-schedule",
            notify_existing: true
          }])
          result = await sendAbandonedCartsWorkflow(appContainer).run({
            input: {
              reminderSchedules,
              pagination: { limit: 10, offset: 0 }
            }
          })
          expect(result.result.updatedCarts.length).toEqual(0)
        })
      })

      describe("Notify Existing Carts: false", () => {
        it("does not notify existing carts", async () => {
          const abandonedCartModule = appContainer.resolve(ABANDONED_CART_MODULE)
          const cart = await createCartWorkflow(appContainer).run({
            input: {
              email: "existingcart2@test.com",
              region_id: region.id,
              items: [{ title: "Test variant", unit_price: 100, quantity: 1 }],
              sales_channel_id: salesChannel.id
            }
          })
          jest.advanceTimersByTime(10 * 60 * 1000);
          const reminderSchedules = await abandonedCartModule.createReminderSchedules([{
            enabled: true,
            delays_iso: ["PT5M"],
            template_id: "notify-existing-false",
            notify_existing: false
          }])
          const { result: { updatedCarts } } = await sendAbandonedCartsWorkflow(appContainer).run({
            input: {
              reminderSchedules,
              pagination: { limit: 10, offset: 0 }
            }
          })
          expect(updatedCarts.length).toEqual(0)
        })
      })
    })
  },
})
