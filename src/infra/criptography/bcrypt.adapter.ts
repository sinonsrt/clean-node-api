import bcrypt from "bcrypt"
import { Hasher } from "../../data/protocols/criptography/hasher"

class BcryptAdapter implements Hasher {
  private readonly salt: number

  constructor(salt: number) {
    this.salt = salt
  }

  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.salt)
  }
}

export { BcryptAdapter }
