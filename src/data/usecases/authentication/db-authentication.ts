import {
  Authentication,
  AutheticationModel,
} from "../../../domain/usecases/authentication"
import { LoadAccountByEmailRepository } from "../../protocols/load-account-by-email-repository"

class DbAuthentication implements Authentication {
  private loadAccountByEmailRepository: LoadAccountByEmailRepository

  constructor(loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async auth({ email, password }: AutheticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(email)
    return ""
  }
}

export { DbAuthentication }
