import bcrypt from "bcrypt"
import { BcryptAdapter } from "./bcrypt.adapter"

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("hash"))
  },
  async compare(): Promise<boolean> {
    return new Promise((resolve) => resolve(true))
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
  test("Should call hash with correct values", async () => {
    const { sut, salt } = makeSut()

    const hashSpy = jest.spyOn(bcrypt, "hash")

    await sut.hash("any_value")

    expect(hashSpy).toHaveBeenCalledWith("any_value", salt)
  })

  test("Should return a hash on success", async () => {
    const { sut } = makeSut()

    const hashed_value = await sut.hash("any_value")

    expect(hashed_value).toBe("hash")
  })

  test("Should throw if hash throws", async () => {
    const { sut } = makeSut()

    jest
      .spyOn(sut, "hash")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const promise = sut.hash("any_value")

    await expect(promise).rejects.toThrow()
  })

  test("Should call compare with correct values", async () => {
    const { sut } = makeSut()

    const compareSpy = jest.spyOn(bcrypt, "compare")

    await sut.compare("any_value", "any_hash")

    expect(compareSpy).toHaveBeenCalledWith("any_value", "any_hash")
  })

  test("Should return true when compare succeeds", async () => {
    const { sut } = makeSut()

    const isValid = await sut.compare("any_value", "any_hash")

    expect(isValid).toBe(true)
  })

  test("Should return false when compare fails", async () => {
    const { sut } = makeSut()

    jest
      .spyOn(bcrypt, "compare")
      .mockImplementationOnce(() => new Promise((resolve) => resolve(false)))

    const isValid = await sut.compare("any_value", "any_hash")

    expect(isValid).toBe(false)
  })
})
