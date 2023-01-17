import { AccountModel } from "../models/account"

interface AddAccountModel {
  name: string
  email: string
  password: string
}

interface AddAccount {
  add(accountData: AddAccountModel): Promise<AccountModel>
}

export { AddAccount, AddAccountModel }
