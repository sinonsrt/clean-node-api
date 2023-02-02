import { LogErrorRepository } from "../../data/protocols/log-error-resository"
import { serverError } from "../../presentation/helpers/http-helper"
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../presentation/protocols"
import { LogControllerDecorator } from "./log"

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
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

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log(stack: string): Promise<void> {
      console.log(stack)
      return new Promise((resolve) => resolve())
    }
  }

  return new LogErrorRepositoryStub()
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const logErrorRepositoryStub = makeLogErrorRepositoryStub()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub,
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

  test("Should return the same result of the controller", async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: "any_name",
      },
    })
  })

  test("Should call LogErrorRepository with the correct error if controller throws", async () => {
    const { controllerStub, logErrorRepositoryStub, sut } = makeSut()

    const fakeError = new Error()
    fakeError.stack = "any_stack"
    const error = serverError(fakeError)

    jest
      .spyOn(controllerStub, "handle")
      .mockReturnValue(new Promise((resolve) => resolve(error)))

    const logSpy = jest.spyOn(logErrorRepositoryStub, "log")

    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    }

    await sut.handle(httpRequest)

    expect(logSpy).toHaveBeenCalledWith("any_stack")
  })
})
