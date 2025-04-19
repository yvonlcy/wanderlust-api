import { MongoClient, Db } from 'mongodb'
import { MONGODB_URI } from '../config/env'

let client: MongoClient
let db: Db

export const getDb = async (): Promise<Db> => {
  if (db) return db

  client = new MongoClient(MONGODB_URI as string)
  await client.connect()
  db = client.db()
  console.log('🔗 MongoDB connected')
  return db
}

export const closeDb = async () => {
  await client?.close()
  db = undefined as unknown as Db
}
