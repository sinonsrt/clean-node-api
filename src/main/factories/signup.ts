import { SignUpController } from "../../presentation/controllers/signup/signup"
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter"
import { DbAddAccount } from "../../data/usecases/add-account/db-add-account"
import { BcryptAdapter } from "../../infra/criptography/bcrypt.adapter"
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account"

const makeSignUpController = (): SignUpController => {
  const salt = 12

  const accountRepository = new AccountMongoRepository()
  const encrypter = new BcryptAdapter(salt)
  const addAccount = new DbAddAccount(encrypter, accountRepository)
  const emailValidator = new EmailValidatorAdapter()
  const signUpController = new SignUpController(emailValidator, addAccount)

  return signUpController
}

export { makeSignUpController }
