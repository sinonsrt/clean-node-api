import jwt from "jsonwebtoken"

import { Encrypter } from "../../../data/protocols/criptography/token-generator"

class JwtAdapter implements Encrypter {
  private readonly secret_key: string
  constructor(secret_key: string) {
    this.secret_key = secret_key
  }

  async encrypt(id: string): Promise<string> {
    return jwt.sign({ id }, this.secret_key)
  }
}

export { JwtAdapter }
