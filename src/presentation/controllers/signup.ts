import { MissingParamError } from "../errors/missing-param-error"
import { badRequest } from "../helpers/http-helper"
import { HttpRequest, HttpResponse } from "../protocols/http"

class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse | undefined {
    const requiredFields = ["name", "email", "password"]

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(`Missing param: ${field}`))
      }
    }
  }
}

export { SignUpController }
