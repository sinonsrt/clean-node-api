import { Encrypter } from "../../protocols/encrypter"
import { DbAddAccount } from "./db-add-account"

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_value"))
    }
  }

  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub()
  const sut = new DbAddAccount(encrypterStub)

  return {
    sut,
    encrypterStub,
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
})
