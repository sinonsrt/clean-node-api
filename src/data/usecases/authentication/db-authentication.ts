import {
  Authentication,
  AutheticationModel,
} from "../../../domain/usecases/authentication"
import { HashCompare } from "../../protocols/criptography/hash-compare"
import { TokenGenerator } from "../../protocols/criptography/token-generator"
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository"
import { UpdateAccessTokenRepository } from "../../protocols/db/update-access-token-repository"

class DbAuthentication implements Authentication {
  private loadAccountByEmailRepository: LoadAccountByEmailRepository
  private hashCompare: HashCompare
  private tokenGenerator: TokenGenerator
  private updateAccessTokenRepository: UpdateAccessTokenRepository

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashCompare: HashCompare,
    tokenGenerator: TokenGenerator,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashCompare = hashCompare
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth({ email, password }: AutheticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(email)

    if (account) {
      const isValidHash = await this.hashCompare.compare(
        password,
        account.password
      )

      if (isValidHash) {
        const accessToken = await this.tokenGenerator.generate(account.id)
        await this.updateAccessTokenRepository.update(account.id, accessToken)
        return accessToken
      }
    }

    return null
  }
}

export { DbAuthentication }
