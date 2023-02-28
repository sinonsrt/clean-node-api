import { Validation } from "../../protocols/validation"

class ValidationComposite implements Validation {
  private readonly validations: Validation[]

  constructor(validations: Validation[]) {
    this.validations = validations
  }
  validate(input: any): any {
    for (const validation of this.validations) {
      const error = validation.validate(input)

      if (error) {
        return error
      }
    }
  }
}

export { ValidationComposite }
