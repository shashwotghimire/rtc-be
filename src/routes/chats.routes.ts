import {
  createChat,
  getUserChatById,
  getUserChats,
  getUserChatsWithLastMessages,
} from "../controllers/chat.controller";
import { protect } from "../middleware/protect";
import { Router } from "express";

const router = Router();

router.get("/", protect as any, getUserChats as any);
router.get("/latestChats", protect as any, getUserChatsWithLastMessages as any);
router.get("/:chatId", protect as any, getUserChatById as any);
router.post("/chat", protect as any, createChat as any);

export default router;
