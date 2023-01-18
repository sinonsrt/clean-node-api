import bcrypt from "bcrypt"
import { BcryptAdapter } from "./bctypt.adapter"

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
})
