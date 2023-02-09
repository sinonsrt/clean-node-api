import { MissingParamError } from "../../errors"
import { badRequest } from "../../helpers/http-helper"
import { Controller, HttpRequest, HttpResponse } from "../../protocols"

class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body

    if (!email) {
      return badRequest(new MissingParamError("email"))
    }

    if (!password) {
      return badRequest(new MissingParamError("password"))
    }

    return {
      statusCode: 400,
      body: {},
    }
  }
}

export { LoginController }
