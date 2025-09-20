import prisma from "../prisma/prisma";
import { signToken } from "../utils/jwt";
import { hashPassword } from "../utils/hash";
import { comparePassword } from "../utils/hash";
import { Request, Response } from "express";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ error: "missing input fields" });
    }
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingUsername) {
      return res
        .status(400)
        .json({ error: "username or email already exists" });
    }
    if (existingEmail) {
      return res
        .status(400)
        .json({ error: "username or email already exists" });
    }
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    const token = signToken({ id: user.id, email: user.email });
    return res.status(200).json({ message: "user registered", user, token });
  } catch (e: any) {
    return res.status(500).json({ message: e });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "invalid email or password" });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "invalid email or password" });
    }
    const matchPassword = await comparePassword(password, user.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "invalid email or password" });
    }
    const token = signToken({ id: user.id, email: user.email });
    return res.status(200).json({ message: "logged in", user, token });
  } catch (e) {
    return res.status(500).json({ message: "server error " });
  }
};
