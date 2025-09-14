import { Request, Response } from "express";
import prisma from "../prisma/prisma";

interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });
    return res.status(200).json({ message: user });
  } catch (e) {
    return res.status(500).json({ error: "internal server error" });
  }
};
