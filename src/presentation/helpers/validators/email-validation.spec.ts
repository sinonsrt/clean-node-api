import { InvalidParamError } from "../../errors"
import { EmailValidator } from "../../protocols/email-validator"
import { EmailValidation } from "./email-validation"

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      console.log(email)
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation("email", emailValidatorStub)

  return {
    sut,
    emailValidatorStub,
  }
}

describe("Email Validation", () => {
  test("Should return an error if EmailValidator returns false", () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false)

    const error = sut.validate({ email: "valid_email@mail.com" })

    expect(error).toEqual(new InvalidParamError("email"))
  })

  test("Should call EmailValidator with the correct email", () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid")

    sut.validate({ email: "valid_email@mail.com" })

    expect(isValidSpy).toHaveBeenCalledWith("valid_email@mail.com")
  })

  test("Should return 500 if EmailValidation throws", () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error()
    })

    expect(sut.validate).toThrow()
  })
})
