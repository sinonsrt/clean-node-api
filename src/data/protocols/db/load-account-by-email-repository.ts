import { AccountModel } from "../../usecases/add-account/db-add-account-protocols"

interface LoadAccountByEmailRepository {
  loadByEmail(email: string): Promise<AccountModel | null>
}

export { LoadAccountByEmailRepository }
