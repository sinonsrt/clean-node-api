import request from "supertest"
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper"
import app from "../config/app"

describe("Login Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(`${process.env.MONGO_URL}`)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection("accounts")
    await accountCollection.deleteMany({})
  })

  describe("POST /signup", () => {
    test("Should return 200 on signup", async () => {
      const response = await request(app).post("/api/signup").send({
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      })

      expect(response.body.id).toBeTruthy()
      expect(response.status).toBe(200)
    })
  })
})
