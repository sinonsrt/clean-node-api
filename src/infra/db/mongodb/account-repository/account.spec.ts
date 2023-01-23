import { MongoHelper } from "../helpers/mongo-helper"
import { AccountMongoRepository } from "./account"

describe("Account Mongo Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(`${process.env.MONGO_URL}`)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test("Should return an account on success", async () => {
    const sut = new AccountMongoRepository()

    const accountData = {
      name: "any_name",
      email: "any_email",
      password: "hashed_password",
    }

    const account = await sut.add(accountData)

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe("any_name")
    expect(account.email).toBe("any_email")
    expect(account.password).toBe("hashed_password")
  })
})
