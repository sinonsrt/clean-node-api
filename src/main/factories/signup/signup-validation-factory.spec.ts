import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
  CompareFieldsValidation,
} from "../../../presentation/helpers/validators"
import { Validation } from "../../../presentation/protocols/validation"
import { EmailValidator } from "../../../presentation/protocols/email-validator"
import { makeSignUpValidation } from "./signup-validation-factory"

jest.mock("../../../presentation/helpers/validators/validation-composite")

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

describe("SignUpValidation Factory", () => {
  test("Should call validation composite with all validators", () => {
    makeSignUpValidation()
    const validations: Validation[] = []

    for (const field of ["name", "email", "password", "passwordConfirmation"]) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(
      new CompareFieldsValidation("password", "passwordConfirmation")
    )

    validations.push(new EmailValidation("email", makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
