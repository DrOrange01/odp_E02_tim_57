import type { Message } from "../../types/messages/Message";
import type { Conversation } from "../../types/messages/Conversation";

export interface IMessageAPIService {
  sendMessage(
    token: string,
    receiverId: number,
    content: string
  ): Promise<Message>;
  getConversations(
    token: string
  ): Promise<{ success: boolean; data: Conversation[] }>;
  getConversationMessages(
    token: string,
    otherUserId: number
  ): Promise<{ success: boolean; data: Message[] }>;
  markAsRead(token: string, messageId: number): Promise<{ success: boolean }>;
  markAllAsRead(
    token: string,
    otherUserId: number
  ): Promise<{ success: boolean }>;
}
