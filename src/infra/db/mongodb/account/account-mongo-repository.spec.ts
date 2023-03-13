import { Collection } from "mongodb"
import { MongoHelper } from "../helpers/mongo-helper"
import { AccountMongoRepository } from "./account-mongo-repository"

let accountCollection: Collection
describe("Account Mongo Repository", () => {
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

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test("Should return an add account on success", async () => {
    const sut = makeSut()

    const accountData = {
      name: "any_name",
      email: "any_email@mail.com",
      password: "hashed_password",
    }

    const account = await sut.add(accountData)

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe("any_name")
    expect(account.email).toBe("any_email@mail.com")
    expect(account.password).toBe("hashed_password")
  })

  test("Should return an account on loadByEmail success", async () => {
    const sut = makeSut()

    const accountData = {
      name: "any_name",
      email: "any_email@mail.com",
      password: "hashed_password",
    }

    await accountCollection.insertOne(accountData)

    const account = await sut.loadByEmail("any_email@mail.com")

    expect(account).toBeTruthy()
    expect(account?.name).toBe("any_name")
    expect(account?.email).toBe("any_email@mail.com")
    expect(account?.password).toBe("hashed_password")
  })

  test("Should return an null if loadByEmail fails", async () => {
    const sut = makeSut()

    const account = await sut.loadByEmail("any_email@mail.com")

    expect(account).toBeFalsy()
  })
})
