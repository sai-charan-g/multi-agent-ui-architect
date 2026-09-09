import 'dotenv/config';
import mongoose from 'mongoose';
import { log } from '../lib/logger.js';

let isConnected = false;

export async function connectDB(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    log.warn('MONGODB_URI not found in environment. Running in offline file-storage mode.');
    return null;
  }

  if (isConnected) {
    return mongoose;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    isConnected = true;
    log.success(`Connected to MongoDB Atlas: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      log.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      log.warn('MongoDB disconnected. Attempting to reconnect...');
      isConnected = false;
    });

    return conn;
  } catch (error) {
    log.error(`Failed to connect to MongoDB: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}
