import { MissingParamError } from "../../errors"
import { Validation } from "./validation"

class RequiredFieldValidation implements Validation {
  private readonly fieldName: string
  constructor(fieldName: string) {
    this.fieldName = fieldName
  }

  validate(input: any): any {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
  }
}

export { RequiredFieldValidation }
