import { Router } from "express"
import { adaptRoute } from "../adapters/express/express-route-adapter"
import { makeSignUpController } from "../factories/signup/signup"
import { makeLoginController } from "../factories/login/login"

const signupRoutes = (router: Router): void => {
  router.post("/signup", adaptRoute(makeSignUpController()))
  router.post("/login", adaptRoute(makeLoginController()))
}

export { signupRoutes }
