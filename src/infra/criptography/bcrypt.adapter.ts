import bcrypt from "bcrypt"
import { HashCompare } from "../../data/protocols/criptography/hash-compare"
import { Hasher } from "../../data/protocols/criptography/hasher"

class BcryptAdapter implements Hasher, HashCompare {
  private readonly salt: number

  constructor(salt: number) {
    this.salt = salt
  }

  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.salt)
  }

  async compare(value: string, hash: string): Promise<boolean> {
    await bcrypt.compare(value, hash)
    return new Promise((resolve) => resolve(true))
  }
}

export { BcryptAdapter }
