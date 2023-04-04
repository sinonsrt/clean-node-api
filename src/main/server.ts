import { MongoHelper } from "../infra/db/mongodb/helpers/mongo-helper"
import * as dotenv from "dotenv"

import app from "./config/app"
import env from "./config/env"

dotenv.config()

MongoHelper.connect(`${env.mongoUrl}`)
  .then(() => {
    app.listen(env.port, () => {
      console.log(`Server is up at https://localhost:${env.port} 🚀!`)
      console.log(`Database connected ☑`)
    })
  })
  .catch((error) => console.log("Error to connect on database =>", error))

app.get("/", (req, res) => {
  res.json("Clean Node API 🧽")
})
