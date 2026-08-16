import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/keemat';

  // Attempt 1: Try local or environment MongoDB URI
  try {
    console.log(`[DB] Attempting connection to MongoDB at ${uri}...`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log(`[DB] Successfully connected to MongoDB: ${mongoose.connection.host}`);
    return;
  } catch (err) {
    console.warn(`[DB] Connection to ${uri} failed (${err.message}). Trying MongoMemoryServer with timeout...`);
  }

  // Attempt 2: MongoMemoryServer with 5s timeout
  try {
    const memoryServerPromise = MongoMemoryServer.create();
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('MongoMemoryServer startup timeout')), 5000));
    mongoMemoryServer = await Promise.race([memoryServerPromise, timeoutPromise]);
    const memUri = mongoMemoryServer.getUri();
    await mongoose.connect(memUri);
    console.log(`[DB] Successfully connected to In-Memory MongoDB: ${memUri}`);
  } catch (memErr) {
    console.warn(`[DB] In-Memory Mongo Server skipped (${memErr.message}). Continuing in-memory persistence mode.`);
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
  } catch (e) {
    // Ignore shutdown errors
  }
}
