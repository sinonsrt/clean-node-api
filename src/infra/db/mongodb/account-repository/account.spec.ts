import { MongoHelper } from "../helpers/mongo-helper"
import { AccountMongoRepository } from "./account"

describe("Account Mongo Repository", () => {
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

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test("Should return an account on success", async () => {
    const sut = makeSut()

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
