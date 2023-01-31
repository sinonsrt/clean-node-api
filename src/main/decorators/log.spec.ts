import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../presentation/protocols"
import { LogControllerDecorator } from "./log"
interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
}
const makeControllerStub = (): Controller => {
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

  return new ControllerStub()
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const sut = new LogControllerDecorator(controllerStub)

  return {
    sut,
    controllerStub,
  }
}

describe("LogControllerDecorator", () => {
  test("Should call controller handle", async () => {
    const { controllerStub, sut } = makeSut()

    const handleSpy = jest.spyOn(controllerStub, "handle")

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
