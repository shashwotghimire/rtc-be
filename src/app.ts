import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// routes import
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import checkRoutes from "./routes/check.routes";
import chatRoutes from "./routes/chats.routes";
import messageRoutes from "./routes/messages.routes";
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
app.use("/api/chats", messageRoutes);
app.use("/api/check", checkRoutes);

export default app;
