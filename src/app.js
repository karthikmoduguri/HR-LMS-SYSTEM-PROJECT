import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Hrroutes from "./routes/Hrroutes.js"
import candidateroutes from "./routes/candidateroutes.js"
dotenv.config();

const app = express();

app.use(cors({
  origin:process.env.CORS_ORIGIN,
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use("/api/v1",Hrroutes)
app.use("/api/v1/candidate",candidateroutes)

  export{app}