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

    await sut.hash("any_value")

    expect(bcryptSpy).toHaveBeenCalledWith("any_value", salt)
  })

  test("Should return a hash on success", async () => {
    const { sut } = makeSut()

    const hashed_value = await sut.hash("any_value")

    expect(hashed_value).toBe("hash")
  })

  test("Should throw if bcrypt throws", async () => {
    const { sut } = makeSut()

    jest
      .spyOn(sut, "hash")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const promise = sut.hash("any_value")

    await expect(promise).rejects.toThrow()
  })
})
