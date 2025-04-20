import mongoose, { Connection } from 'mongoose';

export const getDb = async (): Promise<any> => {
  if (mongoose.connection.readyState !== 1) {
    // Not connected, try to connect
    await mongoose.connect(process.env.MONGODB_URI || '', {
      // useNewUrlParser: true, useUnifiedTopology: true // not needed in mongoose >= 6
    });
  }
  return mongoose.connection.db;
};

export const closeDb = async () => {
  await mongoose.connection.close();
}

