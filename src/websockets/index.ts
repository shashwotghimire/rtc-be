import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import prisma from "../prisma/prisma";

interface MessagePayload {
  chatId: string;
  content: string;
  senderId: string;
}

export const initSocket = (server: HttpServer) => {
  const io = new Server(server);
  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    // join a chat room
    socket.on("join_chat", (chatId: string) => {
      socket.join(chatId);
      console.log(`user ${socket.id} joined chat ${chatId}`);
    });

    //  send a message to the chat room

    socket.on("send_message", async (data: MessagePayload) => {
      try {
        const { chatId, content, senderId } = data;
        const isMember = await prisma.chatMember.findFirst({
          where: { chatId, userId: senderId },
        });
        if (!isMember) {
          socket.emit("error : you are not a member of this chat");
          return;
        }
        // is member -> save chat in db
        const message = await prisma.message.create({
          data: {
            chatId,
            content,
            senderId,
          },
          include: {
            sender: {
              select: {
                username: true,
                id: true,
                email: true,
              },
            },
          },
        });

        // broadcast this message to all members in room
        io.to(chatId).emit("recieve_message", message);
      } catch (error) {
        console.error("error sending message : ", error);
        socket.emit("internal server error");
      }
    });

    socket.on("disconnect", () => {
      console.log("a user disconnected");
    });
  });
  return io;
};
