import { LogErrorRepository } from "../../../../data/protocols/db/log/log-error-repository"
import { MongoHelper } from "../helpers/mongo-helper"

class LogMongoRepository implements LogErrorRepository {
  async logError(stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection("errors")

    await errorCollection.insertOne({
      stack,
      created_at: new Date(),
    })
  }
}

export { LogMongoRepository }
