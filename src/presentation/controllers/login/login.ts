import { MissingParamError } from "../../errors"
import { badRequest } from "../../helpers/http-helper"
import { Controller, HttpRequest, HttpResponse } from "../../protocols"
import { EmailValidator } from "../signup/signup-protocols"

class LoginController implements Controller {
  private emailValidator: EmailValidator

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body

    if (!email) {
      return badRequest(new MissingParamError("email"))
    }

    if (!password) {
      return badRequest(new MissingParamError("password"))
    }

    this.emailValidator.isValid(email)

    return {
      statusCode: 400,
      body: {},
    }
  }
}

export { LoginController }
