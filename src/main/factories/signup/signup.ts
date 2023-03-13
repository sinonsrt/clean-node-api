import { SignUpController } from "../../../presentation/controllers/signup/signup-controller"
import { DbAddAccount } from "../../../data/usecases/add-account/db-add-account"
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository"
import { Controller } from "../../../presentation/protocols"
import { LogControllerDecorator } from "../../decorators/log-controller-decorator"
import { LogMongoRepository } from "../../../infra/db/mongodb/log/log-mongo-repository"
import { makeSignUpValidation } from "./signup-validation-factory"
import { BcryptAdapter } from "../../../infra/criptography/bcrypt-adapter/bcrypt-adapter"

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
