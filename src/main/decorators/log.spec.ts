import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../presentation/protocols"
import { LogControllerDecorator } from "./log"

describe("LogControllerDecorator", () => {
  test("Should call controller handle", async () => {
    class ControllerStub implements Controller {
      async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        console.log(httpRequest)

        const httpResponse = {
          statusCode: 200,
          body: {
            name: "any_name",
          },
        }
        return new Promise((resolve) => resolve(httpResponse))
      }
    }

    const controllerStub = new ControllerStub()

    const handleSpy = jest.spyOn(controllerStub, "handle")
    const sut = new LogControllerDecorator(controllerStub)

    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    }

    await sut.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
})
