import 'dotenv/config';
import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sreecollections';
  try {
    const isAtlas = uri.includes('mongodb+srv');
    console.log(`[MongoDB] Connecting to ${isAtlas ? 'MongoDB Atlas' : 'Local MongoDB'}...`);
    
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB] Connection failed: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Disconnected from MongoDB');
});

export default connectDB;
