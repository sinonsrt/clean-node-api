import { MissingParamError, ServerError } from "../../errors"
import { badRequest, ok, serverError } from "../../helpers/http-helper"
import { SignUpController } from "./signup"
import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  HttpRequest,
  Validation,
} from "./signup-protocols"

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    email: "any_email@mail.com",
    password: "any_password",
    passwordConfirmation: "any_password",
  },
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): any {
      return null
    }
  }

  return new ValidationStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_id",
  email: "valid_email",
  password: "valid_id",
})

const makeAddAccount = (): AddAccount => {
  class AddAccount implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      console.log(account)

      return new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }

  return new AddAccount()
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(addAccountStub, validationStub)

  return {
    sut,
    addAccountStub,
    validationStub,
  }
}

describe("SignUp Controller", () => {
  test("Should call AddAccount with the correct values", async () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, "add")

    await sut.handle(makeFakeRequest())

    expect(addSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    })
  })

  test("Should return 500 if AddAccount throws", async () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, "add").mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test("Should return 200 if data is valid", async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test("Should call Validation with the correct values", async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, "validate")

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test("Should return 400 if validation return an error", async () => {
    const { sut, validationStub } = makeSut()

    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("any_field"))

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError("any_field")))
  })
})
