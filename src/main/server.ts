import app from "./config/app"

app.get("/", (req, res) => {
  console.log("Server is up at https://localhost:3333 🚀!")
  res.json("Hello World")
})

app.listen(3333, () =>
  console.log("Server is up at https://localhost:3333 🚀!")
)
