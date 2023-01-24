import express from "express"

const app = express()

app.use(express.json())

app.get("/", function (req, res) {
  res.send("Hello World")
})

app.listen(3333, () =>
  console.log("Server is up at https://localhost:3333 🚀!")
)
