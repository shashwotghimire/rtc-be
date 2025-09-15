import { Router } from "express";
import { check } from "../controllers/check.controller";

const router = Router();

router.get("/", check);

export default router;