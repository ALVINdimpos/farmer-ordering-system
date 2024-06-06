import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const DB_URI =process.env.DB_URI ||"mongodb+srv://alvin:alvin@cluster0.oeyfe9y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 
// Define the function as async to use await
const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI as string);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("DB connection error", error);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB; // Export the connectDB function
