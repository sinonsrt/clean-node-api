import * as dotenv from "dotenv"

dotenv.config()

export default {
  mongoUrl: process.env.MONGO_URL || process.env.MONGO_CLUSTER_URL,
  port: process.env.PORT || 3333,
}
