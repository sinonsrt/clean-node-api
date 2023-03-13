import { Router } from "express"
import { adaptRoute } from "../adapters/express/express-route-adapter"
import { makeSignUpController } from "../factories/signup/signup"

const signupRoutes = (router: Router): void => {
  router.post("/signup", adaptRoute(makeSignUpController()))
}

export { signupRoutes }
