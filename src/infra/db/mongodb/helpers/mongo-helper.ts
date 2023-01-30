import { Collection, Db, MongoClient } from "mongodb"

const MongoHelper = {
  client: null as unknown as MongoClient,
  url: null as unknown as string,
  cacheDb: null as unknown as Db,
  async connect(url: string): Promise<void> {
    this.url = url
    this.client = await MongoClient.connect(url, {})
    this.cacheDb = this.client.db()
  },
  async disconnect(): Promise<void> {
    await this.client.close()
  },
  async getCollection(name: string): Promise<Collection> {
    if (!this.cacheDb) {
      await this.connect(this.url)
    }

    return this.client.db().collection(name)
  },
}

export { MongoHelper }
