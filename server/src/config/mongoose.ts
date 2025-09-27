import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI!

    await mongoose.connect(mongoURI, {
      autoIndex: true,
      maxPoolSize: 10,
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;