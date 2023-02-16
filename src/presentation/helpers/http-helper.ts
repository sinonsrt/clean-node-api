import { ServerError, UnauthorizedError } from "../errors"
import { HttpResponse } from "../protocols/http"

const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
})

const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
})

const serverError = (error?: any): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack),
})

const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError(),
})

export { badRequest, serverError, ok, unauthorized }
