import { MongoClient, Db } from 'mongodb'
import { MONGODB_URI } from '../config/env'

let client: MongoClient
let db: Db

// Singleton MongoDB connection
export async function getDb(): Promise<Db> {
  if (!db) {
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    db = client.db() // Use DB name from URI
  }
  return db
}