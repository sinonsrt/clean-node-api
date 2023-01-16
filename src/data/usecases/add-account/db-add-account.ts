import { AccountModel } from "../../../domain/models/account"
import {
  AddAccount,
  AddAccountModel,
} from "../../../domain/usecases/add-account"
import { Encrypter } from "../../protocols/encrypter"

class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter

  constructor(encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)

    return new Promise((resolve) =>
      resolve({
        id: "string",
        name: "string",
        email: "string",
        password: "valid_password",
      })
    )
  }
}

export { DbAddAccount }
