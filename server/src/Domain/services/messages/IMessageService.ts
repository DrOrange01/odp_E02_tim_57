import type { Message } from "../../models/Message";

export interface IMessageService {
  sendMessage(
    senderId: number,
    receiverId: number,
    content: string
  ): Promise<Message>;
  getUserConversations(
    userId: number
  ): Promise<
    { otherUserId: number; lastMessage: string; unreadCount: number }[]
  >;
  getConversationMessages(
    userId: number,
    otherUserId: number
  ): Promise<Message[]>;
  markMessageAsRead(userId: number, messageId: number): Promise<boolean>;
  markAllMessagesAsRead(userId: number, otherUserId: number): Promise<void>;
}
