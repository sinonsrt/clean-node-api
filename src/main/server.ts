import app from "./config/app"

app.get("/", (req, res) => {
  res.json("Hello World")
})

app.listen(3333, () =>
  console.log("Server is up at https://localhost:3333 🚀!")
)
