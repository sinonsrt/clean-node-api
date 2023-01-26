import { Collection, MongoClient } from "mongodb"

const MongoHelper = {
  client: null as unknown as MongoClient,
  async connect(): Promise<void> {
    this.client = await MongoClient.connect(`${process.env.MONGO_URL}`, {})
  },
  async disconnect(): Promise<void> {
    await this.client.close()
  },
  getCollection(name: string): Collection {
    return this.client.db().collection(name)
  },
}

export { MongoHelper }
