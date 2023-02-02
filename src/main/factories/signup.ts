import { SignUpController } from "../../presentation/controllers/signup/signup"
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter"
import { DbAddAccount } from "../../data/usecases/add-account/db-add-account"
import { BcryptAdapter } from "../../infra/criptography/bcrypt.adapter"
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account"
import { Controller } from "../../presentation/protocols"
import { LogControllerDecorator } from "../decorators/log"
import { LogErrorRepository } from "../../data/protocols/log-error-resository"

const makeSignUpController = (): Controller => {
  const salt = 12

  const accountRepository = new AccountMongoRepository()
  const encrypter = new BcryptAdapter(salt)
  const addAccount = new DbAddAccount(encrypter, accountRepository)
  const emailValidator = new EmailValidatorAdapter()
  const signUpController = new SignUpController(emailValidator, addAccount)
  const logErrorRepository = new LogErrorRepository()
  const logController = new LogControllerDecorator(
    signUpController,
    logErrorRepository
  )

  return logController
}

export { makeSignUpController }
