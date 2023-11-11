import mongoose from "mongoose";

let isConnected = false; // Connection status

export const connectToDatabase = async () => {
   mongoose.set("strictQuery", true);

   if (!process.env.MONGODB_URI)
      return console.log("MONGODB_URI is missing from env variables");

   if (isConnected) return console.log("=> using existing database connection");

   try {
      await mongoose.connect(process.env.MONGODB_URI);
      isConnected = true;
      console.log("=> MongoDB connected");
   } catch (error: any) {
      throw new Error("Failed to connect to database: ${error.message}");
   }
};
