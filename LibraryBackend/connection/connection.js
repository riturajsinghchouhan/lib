import mongoose from "mongoose";

const connectDb = async () => {
  if (mongoose.connection.readyState >= 1) return; 
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/renu");
    console.log(" MongoDB Connected");
  } catch (err) {
    console.error(" Error connecting DB:", err);
  }
};

export default connectDb;
