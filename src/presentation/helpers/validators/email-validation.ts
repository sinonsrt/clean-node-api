import { InvalidParamError } from "../../errors"
import { EmailValidator } from "../../protocols/email-validator"
import { Validation } from "../../protocols/validation"

class EmailValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate(input: any): any {
    const isValidEmail = this.emailValidator.isValid(input[this.fieldName])

    if (!isValidEmail) {
      return new InvalidParamError(this.fieldName)
    }
  }
}

export { EmailValidation }
