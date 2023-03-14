import env from "../../config/env"

import { DbAuthentication } from "../../../data/usecases/authentication/db-authentication"
import { BcryptAdapter } from "../../../infra/criptography/bcrypt-adapter/bcrypt-adapter"
import { JwtAdapter } from "../../../infra/criptography/jwt-adapter/jwt-adapter"
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository"
import { LogMongoRepository } from "../../../infra/db/mongodb/log/log-mongo-repository"
import { LoginController } from "../../../presentation/controllers/login/login-controller"
import { Controller } from "../../../presentation/protocols"
import { LogControllerDecorator } from "../../decorators/log-controller-decorator"
import { makeLoginValidation } from "./login-validation-factory"

const makeLoginController = (): Controller => {
  const salt = 12

  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountRepository = new AccountMongoRepository()
  const dbAuthentication = new DbAuthentication(
    accountRepository,
    bcryptAdapter,
    jwtAdapter,
    accountRepository
  )
  const loginController = new LoginController(
    dbAuthentication,
    makeLoginValidation()
  )
  const logErrorRepository = new LogMongoRepository()
  const logController = new LogControllerDecorator(
    loginController,
    logErrorRepository
  )

  return logController
}

export { makeLoginController }
