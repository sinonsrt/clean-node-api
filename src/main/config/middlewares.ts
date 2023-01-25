import { Express } from "express"
import { bodyParser, contentType, cors } from "../middlewares"

const setupMiddlewares = (app: Express): void => {
  app.use(bodyParser)
  app.use(contentType)
  app.use(cors)
}

export default setupMiddlewares
