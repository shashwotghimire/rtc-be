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
    const userChats = chats.map((chat: any) => chat.chat);
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

export const createChat = async (req: AuthRequest, res: Response) => {
  try {
    const { name, recieverUsername } = req.body;
    if (!recieverUsername) {
      return res.status(404).json({ error: "no reciever username" });
    }
    //  find the reciever
    const reciever = await prisma.user.findFirst({
      where: { username: recieverUsername },
    });
    if (!reciever) {
      return res.status(404).json({ error: "user not found" });
    }
    //  check for existing chats betn reciever and user
    const existingChat = await prisma.chat.findFirst({
      where: {
        members: {
          every: {
            OR: [{ userId: req.user.id }, { userId: reciever.id }],
          },
        },
      },
    });
    if (existingChat) {
      return res.status(400).json({ error: "chat already exists" });
    }
    const chat = await prisma.chat.create({
      data: {
        name,
        members: { create: [{ userId: req.user.id }, { userId: reciever.id }] },
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
    return res.status(200).json({ chat });
  } catch (e) {
    return res.status(500).json({ error: "server error" });
  }
};

export const getUserChatsWithLastMessages = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user.id;
    const chats = await prisma.chat.findMany({
      where: {
        members: {
          some: { userId },
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
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                email: true,
                username: true,
              },
            },
          },
        },
      },
    });
    return res.status(200).json({ chats });
  } catch (e) {
    return res.status(500).json({ error: "server error" });
  }
};
