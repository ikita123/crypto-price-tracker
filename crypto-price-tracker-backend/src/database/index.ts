 
import mongoose from 'mongoose';

const DB_URL = 'mongodb+srv://nikitasharma:nikita-sharma@cluster1.poqels0.mongodb.net/karnot?retryWrites=true&w=majority';

const connectDB = async (): Promise<void> => {
  try {
    console.log('Connecting to the database:', DB_URL);
    await mongoose.connect(DB_URL);
    console.log('Connected to the database');
  } catch (error:any) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;