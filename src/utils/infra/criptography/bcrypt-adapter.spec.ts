import bcrypt from "bcrypt"
import { BcryptAdapter } from "./bcrypt.adapter"

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("hash"))
  },
}))

interface SutTypes {
  sut: BcryptAdapter
  salt: number
}

const makeSut = (): SutTypes => {
  const salt = 12
  const sut = new BcryptAdapter(salt)

  return {
    sut,
    salt,
  }
}

describe("Bcrypt Adapter", () => {
  test("Should call bcrypt with correct values", async () => {
    const { sut, salt } = makeSut()

    const bcryptSpy = jest.spyOn(bcrypt, "hash")

    await sut.encrypt("any_value")

    expect(bcryptSpy).toHaveBeenCalledWith("any_value", salt)
  })

  test("Should return a hash on success", async () => {
    const { sut } = makeSut()

    const hashed_value = await sut.encrypt("any_value")

    expect(hashed_value).toBe("hash")
  })
})
