import { MissingParamError } from "../../errors"
import { RequiredFieldValidation } from "./required-field-validation"

describe("Required Field Validation", () => {
  test("Should return a MissingParamError if validation fails", () => {
    const sut = new RequiredFieldValidation("any_field")

    const error = sut.validate({ name: "any_name" })

    expect(error).toEqual(new MissingParamError("any_field"))
  })

  test("Should not returns if validation success", () => {
    const sut = new RequiredFieldValidation("any_field")

    const error = sut.validate({ any_field: "any_name" })

    expect(error).toBeFalsy()
  })
})
