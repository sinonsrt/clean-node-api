import { ServerError } from "../errors"
import { HttpResponse } from "../protocols/http"

const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
})

const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
})

const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(),
})

export { badRequest, serverError, ok }
