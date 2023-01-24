import { Express } from "express"
import { bodyParser } from "../middlewares/body-parser"
import { contentType } from "../middlewares/content-type"
import { cors } from "../middlewares/cors"

const setupMiddlewares = (app: Express): void => {
  app.use(bodyParser)
  app.use(contentType)
  app.use(cors)
}

export default setupMiddlewares
