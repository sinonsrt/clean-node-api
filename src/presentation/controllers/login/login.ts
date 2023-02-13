import { InvalidParamError, MissingParamError } from "../../errors"
import { badRequest, serverError } from "../../helpers/http-helper"
import { Controller, HttpRequest, HttpResponse } from "../../protocols"
import { EmailValidator } from "../signup/signup-protocols"

class LoginController implements Controller {
  private emailValidator: EmailValidator

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body

      if (!email) {
        return badRequest(new MissingParamError("email"))
      }

      if (!password) {
        return badRequest(new MissingParamError("password"))
      }

      const isValidEmail = this.emailValidator.isValid(email)

      if (!isValidEmail) {
        return badRequest(new InvalidParamError("email"))
      }

      return {
        statusCode: 400,
        body: {},
      }
    } catch (error) {
      return serverError(error)
    }
  }
}

export { LoginController }
