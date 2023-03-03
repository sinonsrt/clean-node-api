import { AccountModel } from "../../usecases/add-account/db-add-account-protocols"

interface LoadAccountByEmailRepository {
  load(email: string): Promise<AccountModel>
}

export { LoadAccountByEmailRepository }
