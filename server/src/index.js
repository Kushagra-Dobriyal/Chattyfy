import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js"
import{app,server} from './lib/socket.js'


dotenv.config();
const PORT = process.env.PORT;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));  //inc the limit of something i dont rememeber
app.use(cookieParser());

app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization","X-Requested-With"] //the field is use for AJAX requestion 
}));

app.get("/", (req, res) => {
    res.send("Server is running!");
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
//These two route classes can be implemented here too but for better code structure we will mwke it int different folder as Routes...

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
}); 
