import { Express, Router } from "express"
import { signupRoutes } from "../routes"

const setupRoutes = (app: Express): void => {
  const router = Router()

  signupRoutes(router)

  app.use("/api", router)
}

export default setupRoutes
