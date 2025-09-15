import { Request, Response } from "express";
import prisma from "../prisma/prisma";

interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { chatId } = req.params;

    const messages = await prisma.message.findMany({
      where: {
        chatId,
        chat: {
          members: {
            some: { userId: req.user.id },
          },
        },
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return res.status(200).json({ messages });
  } catch (e) {
    return res.status(500).json({ error: "server error" });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;
    const isMember = await prisma.chatMember.findFirst({
      where: { chatId, userId: req.user.id },
    });
    if (!isMember) {
      return res
        .status(403)
        .json({ error: "you are not a member of this chat" });
    }
    const message = await prisma.message.create({
      data: {
        content,
        chatId,
        senderId: req.user.id,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
    return res.status(201).json({ message });
  } catch (e) {
    return res.status(500).json({ error: "internal server error" });
  }
};
