import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    console.error("MONGO_URI is not defined in environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    console.log("DB Connected");
  } catch (error) {
    console.error("DB Connection Error:", error);
  }
};
