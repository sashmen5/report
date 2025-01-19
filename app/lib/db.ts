import mongoose, { ConnectOptions } from 'mongoose';

async function dbConnect() {
  const MONGODB_URI = process.env.MONGO_URI ?? 'Error message: No MONGO_URI in .env.local';

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  let cached = global.mongoose;

  if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
  }

  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts: ConnectOptions = {
      bufferCommands: true,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
    console.log('Db connected');
  } catch (e) {
    console.log('!!!Ooops Db NOT connected');
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export { dbConnect };
