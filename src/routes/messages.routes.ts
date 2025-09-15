import { Router } from "express";
import { getMessages, sendMessage } from "../controllers/messages.controller";
import { protect } from "../middleware/protect";

const router = Router();

router.get("/:chatId/messages", protect as any, getMessages as any);
router.post("/:chatId/messages", protect as any, sendMessage as any);

export default router;
