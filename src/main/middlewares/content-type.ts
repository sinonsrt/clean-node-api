import { NextFunction, Request, Response } from "express"

const contentType = (req: Request, res: Response, next: NextFunction) => {
  res.type("json")
  next()
}

export { contentType }
