import { EmailValidator } from "../presentation/protocols/email-validator"

class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    return false
  }
}

export { EmailValidatorAdapter }
