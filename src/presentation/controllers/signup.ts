import { MissingParamError } from "../errors/missing-param-error"
import { badRequest } from "../helpers/http-helper"
import { HttpRequest, HttpResponse } from "../protocols/http"

class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse | undefined {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError("Missing param: name"))
    }

    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError("Missing param: email"))
    }
  }
}

export { SignUpController }
