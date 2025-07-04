import mongoose from "mongoose";

export const connectDB=async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to ${conn.connection.host}`);
    } catch (e) {
        console.log("Error connecting to MongoDB", e);
    }
}