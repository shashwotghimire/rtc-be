import { login, registerUser } from "../controllers/auth.controller";
import { Router } from "express";
import { validate } from "../middleware/validate";
import { protect } from "../middleware/protect";
import { loginSchema, registerSchema } from "../schema/auth.schema";

const router = Router();

// register
router.post(
  "/register",
  registerUser as any,
  validate(registerSchema) as any,
  protect as any
);

// login

router.post(
  "/login",
  login as any,
  validate(loginSchema) as any,
  protect as any
);

export default router;
