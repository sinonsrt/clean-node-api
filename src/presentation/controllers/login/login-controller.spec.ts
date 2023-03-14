import { MissingParamError } from "../../errors"
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "../../helpers/http/http-helper"
import { LoginController } from "./login-controller"
import {
  Authentication,
  AutheticationModel,
  HttpRequest,
  Validation,
} from "./login-controller-protocols"

interface SutTypes {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: "any_email@mail.com",
    password: "any_password",
  },
})

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth({ email, password }: AutheticationModel): Promise<string> {
      return "valid_token"
    }
  }

  return new AuthenticationStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): any {
      return null
    }
  }

  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication()
  const validationStub = makeValidation()

  const sut = new LoginController(authenticationStub, validationStub)

  return { sut, authenticationStub, validationStub }
}

describe("Login Controller", () => {
  test("Should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut()

    const authSpy = jest.spyOn(authenticationStub, "auth")

    await sut.handle(makeFakeRequest())

    expect(authSpy).toHaveBeenCalledWith({
      email: "any_email@mail.com",
      password: "any_password",
    })
  })

  test("Should return 401 if an invalid credential are provided", async () => {
    const { sut, authenticationStub } = makeSut()

    jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(new Promise((resolve) => resolve("")))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(unauthorized())
  })

  test("Should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = makeSut()

    jest.spyOn(authenticationStub, "auth").mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test("Should return 200 if valid credentials are provided", async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok("valid_token"))
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
