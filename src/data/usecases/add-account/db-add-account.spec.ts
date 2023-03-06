import { AddAccountRepository } from "../../protocols/db/add-account-repository"
import { DbAddAccount } from "./db-add-account"
import {
  Hasher,
  AddAccountModel,
  AccountModel,
} from "./db-add-account-protocols"

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
}

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_id",
  email: "valid_email",
  password: "hashed_password",
})

const makeFakeAccountData = (): AddAccountModel => ({
  name: "valid_name",
  email: "valid_email",
  password: "valid_password",
})

const makeEncrypterStub = (): Hasher => {
  class EncrypterStub implements Hasher {
    async hash(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"))
    }
  }

  return new EncrypterStub()
}

const makeAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }

  return new AddAccountRepositoryStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub()
  const addAccountRepositoryStub = makeAddAccountRepositoryStub()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
  }
}

describe("DbAddAccount UseCase", () => {
  test("Should call Hasher with the correct password", async () => {
    const { sut, encrypterStub } = makeSut()

    const encryptSpy = jest.spyOn(encrypterStub, "hash")

    await sut.add(makeFakeAccountData())

    expect(encryptSpy).toHaveBeenLastCalledWith("valid_password")
  })

  test("Should throw an error if Hasher throws", async () => {
    const { sut, encrypterStub } = makeSut()

    jest
      .spyOn(encrypterStub, "hash")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const promise = sut.add(makeFakeAccountData())

    expect(promise).rejects.toThrow()
  })

  test("Should call AddAccountRepository with the correct values", async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    const addSpy = jest.spyOn(addAccountRepositoryStub, "add")

    await sut.add(makeFakeAccountData())

    expect(addSpy).toHaveBeenLastCalledWith({
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password",
    })
  })

  test("Should throw an error if AddAccountRepository throws", async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    jest
      .spyOn(addAccountRepositoryStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const promise = sut.add(makeFakeAccountData())

    expect(promise).rejects.toThrow()
  })

  test("Should return an account on success", async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAccountData())

    expect(account).toEqual(makeFakeAccount())
  })
})
