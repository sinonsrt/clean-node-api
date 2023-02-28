import { LogErrorRepository } from "../../data/protocols/log-error-repository"
import { AccountModel } from "../../domain/models/account"
import { ok, serverError } from "../../presentation/helpers/http/http-helper"
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

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    email: "any_email@mail.com",
    password: "any_password",
    passwordConfirmation: "any_password",
  },
})

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_id",
  email: "valid_email",
  password: "valid_password",
})

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = "any_stack"
  return serverError(fakeError)
}
const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      console.log(httpRequest)

      return new Promise((resolve) => resolve(ok(makeFakeAccount())))
    }
  }

  return new ControllerStub()
}

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
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

    await sut.handle(makeFakeRequest())

    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test("Should return the same result of the controller", async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test("Should call LogErrorRepository with the correct error if controller throws", async () => {
    const { controllerStub, logErrorRepositoryStub, sut } = makeSut()

    jest
      .spyOn(controllerStub, "handle")
      .mockReturnValue(new Promise((resolve) => resolve(makeFakeServerError())))

    const logSpy = jest.spyOn(logErrorRepositoryStub, "logError")

    await sut.handle(makeFakeRequest())

    expect(logSpy).toHaveBeenCalledWith("any_stack")
  })
})
