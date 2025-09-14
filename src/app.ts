import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// routes import
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import chatRoutes from "./routes/chats.routes";

//app
dotenv.config();

const app = express();

// mware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chats", chatRoutes);

export default app;
