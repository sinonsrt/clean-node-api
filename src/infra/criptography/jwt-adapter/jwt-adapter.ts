import jwt from "jsonwebtoken"

import { Encrypter } from "../../../data/protocols/criptography/token-generator"

class JwtAdapter implements Encrypter {
  constructor(private readonly secret_key: string) {}

  async encrypt(id: string): Promise<string> {
    return jwt.sign({ id }, this.secret_key)
  }
}

export { JwtAdapter }
