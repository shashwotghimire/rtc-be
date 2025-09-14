import { Request, Response } from "express";
import prisma from "../prisma/prisma";
interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

export const getUserChats = async (req: AuthRequest, res: Response) => {
  try {
    const chats = await prisma.chatMember.findMany({
      where: { userId: req.user.id },
      include: {
        chat: {
          include: {
            members: true,
          },
        },
      },
    });
    const userChats = chats.map((chat:any) => chat.chat);
    return res.status(200).json({ chats: userChats });
  } catch (e) {
    return res.status(500).json({ error: "server error" });
  }
};

export const getUserChatById = async (req: AuthRequest, res: Response) => {
  try {
    const { chatId } = req.params;
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        members: {
          some: { userId: req.user.id },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });
    if (!chat) {
      return res.status(404).json({ error: "no chat found" });
    }
    return res.status(200).json({ chat });
  } catch (e) {
    return res.status(500).json({ error: "server error" });
  }
};
