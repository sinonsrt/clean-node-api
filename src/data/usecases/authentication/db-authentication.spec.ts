import {
  Authentication,
  AutheticationModel,
} from "../../../domain/usecases/authentication"
import { LoadAccountByEmailRepository } from "../../protocols/load-account-by-email-repository"
import { AccountModel } from "../add-account/db-add-account-protocols"
import { DbAuthentication } from "./db-authentication"

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
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

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)

  return {
    sut,
    loadAccountByEmailRepositoryStub,
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
})
