import {
  Authentication,
  AutheticationModel,
  HashCompare,
  LoadAccountByEmailRepository,
  Encrypter,
  UpdateAccessTokenRepository,
} from "./db-authentication-protocols"

class DbAuthentication implements Authentication {
  constructor(
    private loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private hashCompare: HashCompare,
    private tokenGenerator: Encrypter,
    private updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth({ email, password }: AutheticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(email)

    if (account) {
      const isValidHash = await this.hashCompare.compare(
        password,
        account.password
      )

      if (isValidHash) {
        const accessToken = await this.tokenGenerator.encrypt(account.id)
        await this.updateAccessTokenRepository.updateAccessToken(
          account.id,
          accessToken
        )
        return accessToken
      }
    }

    return null
  }
}

export { DbAuthentication }
