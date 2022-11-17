import { HttpResponse } from "../protocols/http"

const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
})

export { badRequest }
