import { InvalidParamError } from "../../errors"
import { CompareFieldsValidation } from "./compare-fields-validation"

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation("field", "fieldToCompare")
}
describe("Compare Fields Validation", () => {
  test("Should return a MissingParamError if validation fails", () => {
    const sut = makeSut()

    const error = sut.validate({
      field: "any_value",
      fieldToCompare: "wrong_value",
    })

    expect(error).toEqual(new InvalidParamError("fieldToCompare"))
  })

  test("Should not returns if validation success", () => {
    const sut = makeSut()

    const error = sut.validate({
      field: "any_value",
      fieldToCompare: "any_value",
    })

    expect(error).toBeFalsy()
  })
})
