import { MissingParamError } from "../../errors"
import { Validation } from "../../protocols/validation"

class RequiredFieldValidation implements Validation {
  constructor(private readonly fieldName: string) {}

  validate(input: any): any {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
  }
}

export { RequiredFieldValidation }
