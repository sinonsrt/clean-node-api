import { Authentication } from "../../../domain/usecases/authentication"
import { InvalidParamError, MissingParamError } from "../../errors"
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "../../helpers/http-helper"
import { Controller, HttpRequest, HttpResponse } from "../../protocols"
import { EmailValidator } from "../signup/signup-protocols"

class LoginController implements Controller {
  private emailValidator: EmailValidator
  private authentication: Authentication

  constructor(emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ["email", "password"]

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { email, password } = httpRequest.body

      const isValidEmail = this.emailValidator.isValid(email)

      if (!isValidEmail) {
        return badRequest(new InvalidParamError("email"))
      }

      const accessToken = await this.authentication.auth(email, password)

      if (!accessToken) {
        return unauthorized()
      }

      return ok("")
    } catch (error) {
      return serverError(error)
    }
  }
}

export { LoginController }
