-- CreateIndex
CREATE INDEX "Chat_createdAt_idx" ON "public"."Chat"("createdAt");

-- CreateIndex
CREATE INDEX "ChatMember_chatId_userId_idx" ON "public"."ChatMember"("chatId", "userId");

-- CreateIndex
CREATE INDEX "Message_chatId_createdAt_idx" ON "public"."Message"("chatId", "createdAt");

-- CreateIndex
CREATE INDEX "User_username_email_idx" ON "public"."User"("username", "email");
