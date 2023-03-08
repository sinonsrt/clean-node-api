import jwt from "jsonwebtoken"
import { JwtAdapter } from "./jwt-adapter"

jest.mock("jsonwebtoken", () => ({
  sign: (): Promise<string> => {
    return new Promise((resolve) => resolve("valid_token"))
  },
}))

const makeSut = (): JwtAdapter => {
  const sut = new JwtAdapter("secret_key")

  return sut
}

describe("Jwt Adapter", () => {
  test("Should call sign with correct values", async () => {
    const sut = makeSut()

    const signSpy = jest.spyOn(jwt, "sign")

    await sut.encrypt("any_id")

    expect(signSpy).toHaveBeenCalledWith({ id: "any_id" }, "secret_key")
  })

  test("Should return a token on sign sucess", async () => {
    const sut = makeSut()

    const accessToken = await sut.encrypt("any_id")

    expect(accessToken).toBe("valid_token")
  })

  test("Should throw if sign throws", async () => {
    const sut = makeSut()

    jest.spyOn(jwt, "sign").mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.encrypt("any_id")

    expect(promise).rejects.toThrow()
  })
})
