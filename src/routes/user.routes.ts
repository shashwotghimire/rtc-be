import { Router } from "express";
import { getUser } from "../controllers/user.controller";
import { protect } from "../middleware/protect";

const router = Router();

router.get("/me", protect as any, getUser as any);

export default router;
