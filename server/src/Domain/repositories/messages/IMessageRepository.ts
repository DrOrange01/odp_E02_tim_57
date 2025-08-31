import type { Message } from "../../models/Message";

export interface IMessageRepository {
  createMessage(
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
  markAsRead(userId: number, messageId: number): Promise<boolean>;
  markAllAsRead(userId: number, otherUserId: number): Promise<void>;
}
