import { AddAccount } from "../../domain/usecases/add-account"
import { InvalidParamError, MissingParamError } from "../errors"
import { badRequest, serverError } from "../helpers/http-helper"
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from "../protocols"

class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle(httpRequest: HttpRequest): HttpResponse | undefined {
    try {
      const requiredFields = [
        "name",
        "email",
        "password",
        "passwordConfirmation",
      ]

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError("passwordConfirmation"))
      }

      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return badRequest(new InvalidParamError("email"))
      }

      this.addAccount.add({ name, email, password })
    } catch (error) {
      return serverError()
    }
  }
}

export { SignUpController }
