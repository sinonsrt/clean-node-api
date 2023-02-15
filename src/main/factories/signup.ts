import { SignUpController } from "../../presentation/controllers/signup/signup"
import { DbAddAccount } from "../../data/usecases/add-account/db-add-account"
import { BcryptAdapter } from "../../infra/criptography/bcrypt.adapter"
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account"
import { Controller } from "../../presentation/protocols"
import { LogControllerDecorator } from "../decorators/log"
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log"
import { makeSignUpValidation } from "./signup-validation"

const makeSignUpController = (): Controller => {
  const salt = 12

  const accountRepository = new AccountMongoRepository()
  const encrypter = new BcryptAdapter(salt)
  const addAccount = new DbAddAccount(encrypter, accountRepository)
  const signUpController = new SignUpController(
    addAccount,
    makeSignUpValidation()
  )
  const logErrorRepository = new LogMongoRepository()
  const logController = new LogControllerDecorator(
    signUpController,
    logErrorRepository
  )

  return logController
}

export { makeSignUpController }
