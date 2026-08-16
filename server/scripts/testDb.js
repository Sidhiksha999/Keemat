import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const uri = process.env.MONGODB_URI;

console.log('----------------------------------------------------');
console.log('Testing connection to MongoDB Atlas...');
console.log('URI:', uri ? uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') : 'No MONGODB_URI set');
console.log('----------------------------------------------------');

if (!uri || uri.includes('your_password')) {
  console.error('❌ Please update MONGODB_URI in your .env file with your actual MongoDB Atlas connection string.');
  process.exit(1);
}

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  console.log('✅ Successfully connected to MongoDB Atlas!');
  console.log('Host:', mongoose.connection.host);
  console.log('Database Name:', mongoose.connection.name);
  await mongoose.disconnect();
  console.log('----------------------------------------------------');
  process.exit(0);
} catch (err) {
  console.error('❌ MongoDB Atlas connection failed:', err.message);
  console.log('----------------------------------------------------');
  process.exit(1);
}
