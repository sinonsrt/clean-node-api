import { AccountModel } from "../../domain/models/account"
import { AddAccountModel } from "../../domain/usecases/add-account"

interface AddAccountRepository {
  add(accountData: AddAccountModel): Promise<AccountModel>
}

export { AddAccountRepository }
