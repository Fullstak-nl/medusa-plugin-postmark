import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { createAdminUser, adminHeaders } from "../helpers/create-admin-user"
jest.setTimeout(6000 * 1000)

medusaIntegrationTestRunner({
  testSuite: ({ api, dbConnection, getContainer }) => {
    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())
    })
    describe("Ping", () => {
      it("ping the server health endpoint", async () => {
        const response = await api.get('/admin/postmark/options', adminHeaders)
        expect(response.status).toEqual(200)
      })
    })
  },
})
