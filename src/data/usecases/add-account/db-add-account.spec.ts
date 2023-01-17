import { DbAddAccount } from "./db-add-account"
import {
  Encrypter,
  AddAccountModel,
  AccountModel,
  AddAccountRepository,
} from "./db-add-account-protocols"

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"))
    }
  }

  return new EncrypterStub()
}

const makeAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email",
        password: "hashed_passowrd",
      }

      return new Promise((resolve) => resolve(fakeAccount))
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
  test("Should call Encrypter with the correct password", async () => {
    const { sut, encrypterStub } = makeSut()

    const encryptSpy = jest.spyOn(encrypterStub, "encrypt")

    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    }

    await sut.add(accountData)

    expect(encryptSpy).toHaveBeenLastCalledWith("valid_password")
  })

  test("Should throw an error if Encrypter throws", async () => {
    const { sut, encrypterStub } = makeSut()

    jest
      .spyOn(encrypterStub, "encrypt")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    }

    const promise = sut.add(accountData)

    expect(promise).rejects.toThrow()
  })

  test("Should call AddAccountRepository with the correct values", async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    const addSpy = jest.spyOn(addAccountRepositoryStub, "add")

    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    }

    await sut.add(accountData)

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

    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    }

    const promise = sut.add(accountData)

    expect(promise).rejects.toThrow()
  })
})
