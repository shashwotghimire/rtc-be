import { getUserChats } from "../controllers/chat.controller";
import { protect } from "../middleware/protect";
import { Router } from "express";

const router = Router();

router.get("/", protect as any, getUserChats as any);

export default router;
