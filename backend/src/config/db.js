import 'dotenv/config';
import mongoose from 'mongoose';

let isConnecting = false;

const connectDB = async (retryCount = 0) => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sreecollections';
  const maxRetries = 5;

  if (mongoose.connection.readyState === 1) {
    return; // Already connected
  }

  if (isConnecting) {
    return;
  }

  isConnecting = true;

  try {
    const isAtlas = uri.includes('mongodb+srv');
    console.log(`[MongoDB] Connecting to ${isAtlas ? 'MongoDB Atlas' : 'Local MongoDB'} (attempt ${retryCount + 1}/${maxRetries})...`);
    
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    isConnecting = false;
  } catch (error) {
    isConnecting = false;
    console.error(`[MongoDB] Connection failed: ${error.message}`);
    
    if (retryCount < maxRetries - 1) {
      const waitTime = Math.min(2000 * Math.pow(1.5, retryCount), 10000);
      console.log(`[MongoDB] Retrying connection in ${Math.round(waitTime / 1000)}s...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return connectDB(retryCount + 1);
    } else {
      console.error('[MongoDB] All connection retries failed.');
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Disconnected from MongoDB. Attempting to reconnect...');
  if (mongoose.connection.readyState === 0) {
    connectDB().catch((err) => console.error('[MongoDB] Reconnect error:', err.message));
  }
});

mongoose.connection.on('error', (err) => {
  console.error('[MongoDB] Connection error event:', err.message);
});

export default connectDB;
