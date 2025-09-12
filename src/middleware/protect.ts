import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
}
interface AuthRequest extends Request {
  user: TokenPayload;
}
export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader?.startsWith("Bearer")) {
      return res.status(401).json({ error: "unauthorized : invalid token" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyJwt(token) as TokenPayload;
    if (!decoded) {
      return res.status(401).json({ error: "unauthorized:invalid token" });
    }
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: "unauthorized or expired token" });
  }
};
