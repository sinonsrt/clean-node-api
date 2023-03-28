import * as dotenv from "dotenv"

dotenv.config()

export default {
  mongoUrl:
    process.env.MONGO_CLUSTER_URL || "mongodb://root:admin@mongo:27017/",
  port: process.env.PORT || 3333,
  jwtSecret: process.env.JWT_SECRET || "tj670==5H",
}
