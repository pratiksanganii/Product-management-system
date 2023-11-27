import mongoose from 'mongoose';
import { isDev } from '../common/commonService';

export async function connectDB() {
  const MONGO_URI = process.env.MONGO_URI ?? '';
  try {
    const db = await mongoose.connect(MONGO_URI);
    console.log(`Database connected!`)
  } catch (e) {
    if (isDev) console.log({ e });
    process.exit(0);
  }
}
