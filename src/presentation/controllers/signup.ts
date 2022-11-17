import { MissingParamError } from "../errors/missing-param-error"
import { HttpRequest, HttpResponse } from "../protocols/http"

class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse | undefined {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new MissingParamError("Missing param: name"),
      }
    }

    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new MissingParamError("Missing param: email"),
      }
    }
  }
}

export { SignUpController }
