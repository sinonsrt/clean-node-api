import { MissingParamError } from "../errors/missing-param-error"
import { badRequest } from "../helpers/http-helper"
import { Controller } from "../protocols/controller"
import { HttpRequest, HttpResponse } from "../protocols/http"

class SignUpController implements Controller {
  handle(httpRequest: HttpRequest): HttpResponse | undefined {
    const requiredFields = ["name", "email", "password", "passwordConfirmation"]

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(`Missing param: ${field}`))
      }
    }
  }
}

export { SignUpController }
