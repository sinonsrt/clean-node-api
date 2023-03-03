import { AutheticationModel } from "../../../domain/usecases/authentication"
import { HashCompare } from "../../protocols/criptography/hash-compare"
import { TokenGenerator } from "../../protocols/criptography/token-generator"
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository"
import { AccountModel } from "../add-account/db-add-account-protocols"
import { DbAuthentication } from "./db-authentication"

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashCompareStub: HashCompare
  tokenGeneratorStub: TokenGenerator
}

const makeFakeAccount = (): AccountModel => ({
  email: "valid_email",
  id: "valid_id",
  name: "valid_name",
  password: "valid_password",
})

const makeFakeAuthentication = (): AutheticationModel => ({
  email: "any_email@mail.com",
  password: "any_password",
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    async load(email: string): Promise<AccountModel> {
      const account: AccountModel = makeFakeAccount()
      return new Promise((resolve) => resolve(account))
    }
  }
  const loadAccountByEmailRepositoryStub =
    new LoadAccountByEmailRepositoryStub()

  return loadAccountByEmailRepositoryStub
}

const makeHashCompare = (): HashCompare => {
  class HashCompareStub implements HashCompare {
    async compare(value: string, hash: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true))
    }
  }

  const hashCompareStub = new HashCompareStub()

  return hashCompareStub
}

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(id: string): Promise<string> {
      return new Promise((resolve) => resolve("valid_token"))
    }
  }

  const tokenGeneratorStub = new TokenGeneratorStub()

  return tokenGeneratorStub
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashCompareStub = makeHashCompare()
  const tokenGeneratorStub = makeTokenGenerator()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub
  )

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub,
  }
}

describe("DbAuthentication UseCase", () => {
  test("Should call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "load")

    await sut.auth(makeFakeAuthentication())

    expect(loadSpy).toHaveBeenCalledTimes(1)
    expect(loadSpy).toHaveBeenCalledWith("any_email@mail.com")
  })

  test("Should throw if LoadAccountByEmailRepository throws", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest
      .spyOn(loadAccountByEmailRepositoryStub, "load")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow()
  })

  test("Should call HashCompare with correct password", async () => {
    const { sut, hashCompareStub } = makeSut()

    const compareSpy = jest.spyOn(hashCompareStub, "compare")

    await sut.auth(makeFakeAuthentication())

    expect(compareSpy).toHaveBeenCalledTimes(1)
    expect(compareSpy).toHaveBeenCalledWith("any_password", "valid_password")
  })

  test("Should throw if HashCompare throws", async () => {
    const { sut, hashCompareStub } = makeSut()

    jest
      .spyOn(hashCompareStub, "compare")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow()
  })

  test("Should call TokenGenerator with correct id", async () => {
    const { sut, tokenGeneratorStub } = makeSut()

    const compareSpy = jest.spyOn(tokenGeneratorStub, "generate")

    await sut.auth(makeFakeAuthentication())

    expect(compareSpy).toHaveBeenCalledTimes(1)
    expect(compareSpy).toHaveBeenCalledWith("valid_id")
  })

  test("Should throw if TokenGenerator throws", async () => {
    const { sut, tokenGeneratorStub } = makeSut()

    jest
      .spyOn(tokenGeneratorStub, "generate")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow()
  })

  test("Should call TokenGenerator with correct id", async () => {
    const { sut } = makeSut()

    const accessToken = await sut.auth(makeFakeAuthentication())

    expect(accessToken).toBe("valid_token")
  })
})
