import mongoose from 'mongoose'
import { Db } from 'mongodb'

let db: Db | null = null

export const connectDb = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI || '', {});
    if (!mongoose.connection.db) {
      throw new Error('Mongoose connection.db is undefined');
    }
    db = mongoose.connection.db;
  }
}


export const getDb = async (): Promise<Db> => {
  if (!db) {
    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
      db = mongoose.connection.db;
    } else {
      throw new Error('Database not initialized');
    }
  }
  return db;
}


export const closeDb = async () => {
  await mongoose.connection.close()
}
