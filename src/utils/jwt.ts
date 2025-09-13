import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
interface TokenPayload {
  id: string;
  email: string;
}

if (!process.env.JWT_SECRET) {
  throw new Error("jwt secret is not defined in env variables");
}

export const signToken = (payload: TokenPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "28d",
  });
};

export const verifyJwt = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};
