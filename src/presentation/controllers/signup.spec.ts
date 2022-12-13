import { InvalidParamError } from "../errors/invalid-param-error"
import { MissingParamError } from "../errors/missing-param-error"
import { EmailValidator } from "../protocols/email-validator"
import { SignUpController } from "./signup"

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      console.log(email)
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)

  return {
    sut,
    emailValidatorStub,
  }
}

describe("SignUp Controller", () => {
  test("Should return 400 if no name is provided", () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: "uneha@zalsu.cl",
        password: "3931650098",
        passwordConfirmation: "3931650098",
      },
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(400)
    expect(httpResponse?.body).toEqual(new MissingParamError("name"))
  })

  test("Should return 400 if no e-mail is provided", () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: "Derrick Austin",
        password: "3931650098",
        passwordConfirmation: "3931650098",
      },
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(400)
    expect(httpResponse?.body).toEqual(new MissingParamError("email"))
  })

  test("Should return 400 if no password is provided", () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: "Derrick Austin",
        email: "tune@enooho.me",
        passwordConfirmation: "3931650098",
      },
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(400)
    expect(httpResponse?.body).toEqual(new MissingParamError("password"))
  })

  test("Should return 400 if no passwordConfirmation is provided", () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: "Derrick Austin",
        email: "tune@enooho.me",
        password: "3931650098",
      },
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(400)
    expect(httpResponse?.body).toEqual(
      new MissingParamError("passwordConfirmation")
    )
  })

  test("Should return 400 if an invalid e-mail is provided", () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: "Derrick Austin",
        email: "invalid_email@enooho.me",
        password: "3931650098",
        passwordConfirmation: "3931650098",
      },
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(400)
    expect(httpResponse?.body).toEqual(new InvalidParamError("email"))
  })
})
