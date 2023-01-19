import bcrypt from "bcrypt"
import { Encrypter } from "../../data/protocols/encrypter"

class BcryptAdapter implements Encrypter {
  private readonly salt: number

  constructor(salt: number) {
    this.salt = salt
  }

  async encrypt(value: string): Promise<string> {
    return bcrypt.hash(value, this.salt)
  }
}

export { BcryptAdapter }
