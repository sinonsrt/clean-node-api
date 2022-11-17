import { SignUpController } from "./signup"

describe("SignUp Controller", () => {
  test("Should return 400 if no name if provider", () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: "uneha@zalsu.cl",
        password: "3931650098",
        passwordConfirmation: "3931650098",
      },
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
