import request from "supertest"
import app from "../config/app"

describe("Body Parser Middleware", () => {
  test("Expect parser body as json", async () => {
    app.post("/test_body_parser", (req, res) => {
      console.log(req.body)
      res.send(req.body)
    })

    const response = await request(app)
      .post("/test_body_parser")
      .send({ name: "Rodrigo" })

    expect(response.body).toEqual({ name: "Rodrigo" })
  })
})
