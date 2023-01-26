import { Request, Response } from "express"
import { Controller, HttpRequest } from "../../presentation/protocols"

const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
    }

    const httpResponse = await controller.handle(httpRequest)

    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}

export { adaptRoute }
