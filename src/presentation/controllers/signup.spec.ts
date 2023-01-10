import { AccountModel } from "../../domain/models/account"
import { AddAccount, AddAccountModel } from "../../domain/usecases/add-account"
import { InvalidParamError, MissingParamError, ServerError } from "../errors"
import { EmailValidator } from "../protocols"
import { SignUpController } from "./signup"

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      console.log(email)
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccount implements AddAccount {
    add(account: AddAccountModel): AccountModel {
      console.log(account)

      const fakeAccount = {
        id: "valid_id",
        name: "Alta Parker",
        email: "nadtuncik@juj.ie",
        password: "valid_password",
      }

      return fakeAccount
    }
  }

  return new AddAccount()
}

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return {
    sut,
    emailValidatorStub,
    addAccountStub,
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

  test("Should return 400 if password confirmation fails", () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: "Derrick Austin",
        email: "tune@enooho.me",
        password: "3931650098",
        passwordConfirmation: "invalid_password",
      },
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse?.statusCode).toBe(400)
    expect(httpResponse?.body).toEqual(
      new InvalidParamError("passwordConfirmation")
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

  test("Should call EmailValidator with the correct email", () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid")

    const httpRequest = {
      body: {
        name: "Derrick Austin",
        email: "any_email@enooho.me",
        password: "3931650098",
        passwordConfirmation: "3931650098",
      },
    }

    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith("any_email@enooho.me")
  })

  test("Should return 500 if EmailValidation throws", () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: "Derrick Austin",
        email: "any_email@enooho.me",
        password: "3931650098",
        passwordConfirmation: "3931650098",
      },
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(500)
    expect(httpResponse?.body).toEqual(new ServerError())
  })

  test("Should call AddAccount with the correct values", () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, "add")

    const httpRequest = {
      body: {
        name: "Derrick Austin",
        email: "any_email@enooho.me",
        password: "3931650098",
        passwordConfirmation: "3931650098",
      },
    }

    sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: "Derrick Austin",
      email: "any_email@enooho.me",
      password: "3931650098",
    })
  })
})
