import { hash } from "bcrypt"
import { Collection } from "mongodb"
import request from "supertest"
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper"
import app from "../config/app"

let accountCollection: Collection

describe("Login Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(`${process.env.MONGO_URL}`)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection("accounts")
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

  describe("POST /login", () => {
    test("Should return 200 on login", async () => {
      const password = await hash("valid_password", 12)

      await accountCollection.insertOne({
        name: "valid_name",
        email: "valid_email@email.com",
        password,
      })

      await request(app)
        .post("/api/login")
        .send({
          email: "valid_email@email.com",
          password: "valid_password",
        })
        .expect(200)
    })
  })
})
