import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../presentation/protocols"

class LogControllerDecorator implements Controller {
  private readonly controller: Controller

  constructor(controller: Controller) {
    this.controller = controller
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)

    if (httpResponse.statusCode === 500) {
      //log
    }

    return httpResponse
  }
}

export { LogControllerDecorator }
