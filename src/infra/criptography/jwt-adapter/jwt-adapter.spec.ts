import jwt from "jsonwebtoken"
import { JwtAdapter } from "./jwt-adapter"

describe("Jwt Adapter", () => {
  test("Should call sign with correct values", async () => {
    const sut = new JwtAdapter("secret_key")

    const signSpy = jest.spyOn(jwt, "sign")

    await sut.encrypt("any_id")

    expect(signSpy).toHaveBeenCalledWith({ id: "any_id" }, "secret_key")
  })
})
