import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// routes import
import authRoutes from "./routes/auth.routes";
//app
dotenv.config();

const app = express();

// mware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);

export default app;
