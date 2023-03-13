import {
  AccountModel,
  AddAccountModel,
} from "../../usecases/add-account/db-add-account-protocols"

interface AddAccountRepository {
  add(accountData: AddAccountModel): Promise<AccountModel>
}

export { AddAccountRepository }
