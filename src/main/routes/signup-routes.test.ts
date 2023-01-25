import request from "supertest"
import app from "../config/app"

describe("SignUp Routes", () => {
  test("Should return an account on success", async () => {
    const response = await request(app).post("/api/signup").send({
      name: "any_name",
      email: "any_email",
      password: "any_password",
      passwordConfirmation: "any_password",
    })

    expect(response.status).toBe(200)
  })
})
