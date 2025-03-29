import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";


const app=express();
dotenv.config(); 
const PORT=process.env.PORT;

app.use(express.json());
app.use(cors({
     origin:"http://localhost:3000",
     credentials:true,
      // [credentials :true] allowing cookies and headers to be send wih the requests
}));
app.use(cookieParser());


app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);

app.listen(PORT,()=>{
    console.log("Server is running on port 3000");
    connectDB();
})
