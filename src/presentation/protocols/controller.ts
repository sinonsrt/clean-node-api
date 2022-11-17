import { HttpRequest, HttpResponse } from "./http"

interface Controller {
  handle(httpRequest: HttpRequest): HttpResponse | undefined
}

export { Controller }
