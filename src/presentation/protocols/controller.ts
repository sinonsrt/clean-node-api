import { HttpRequest, HttpResponse } from "./http"

interface Controller {
  handle(httpRequest: HttpRequest): Promise<HttpResponse>
}

export { Controller }
