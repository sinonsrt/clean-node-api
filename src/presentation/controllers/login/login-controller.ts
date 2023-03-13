import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "../../helpers/http/http-helper"
import { Validation } from "../signup/signup-controller-protocols"
import {
  Authentication,
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from "./login-controller-protocols"

class LoginController implements Controller {
  private emailValidator: EmailValidator
  private authentication: Authentication
  private readonly validation: Validation

  constructor(
    emailValidator: EmailValidator,
    authentication: Authentication,
    validation: Validation
  ) {
    this.emailValidator = emailValidator
    this.authentication = authentication
    this.validation = validation
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { email, password } = httpRequest.body
      const accessToken = await this.authentication.auth({ email, password })

      if (!accessToken) {
        return unauthorized()
      }

      return ok(accessToken)
    } catch (error) {
      return serverError(error)
    }
  }
}

export { LoginController }
