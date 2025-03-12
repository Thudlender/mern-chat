import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/lib/db.js";
dotenv.config();
//สามารถเพิ้่มกำหนด path ได้ถ้าไฟล์อยู่ใน 
// import authRouter from "./"

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  }));

app.get("/", (req, res) => {
    res.send("<h1>Restful Service for MERN Chat Project</h1>")
})

app.listen(PORT, () => {
    console.log("Server is running on http://localhost:" + PORT);
    connectDB();

})

