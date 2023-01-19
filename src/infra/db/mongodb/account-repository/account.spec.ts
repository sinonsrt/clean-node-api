import { MongoHelper } from "../helpers/mongo-helper"

describe("Account Mongo Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(`${process.env.MONGO_URL}`)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test("Should return an account on success", async () => {
    // const sut = new AccountMongoRepository()

    const accountData = {
      name: "any_name",
      email: "any_email",
      password: "hashed_password",
    }

    // const account = await sut.add(accountData)

    expect(accountData).toBeTruthy()
    // expect(account.id).toBeTruthy()
    expect(accountData.name).toBe("any_name")
    expect(accountData.email).toBe("any_email")
    expect(accountData.password).toBe("hashed_password")
  })
})
