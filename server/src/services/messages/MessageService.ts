import type { IMessageService } from "../../Domain/services/messages/IMessageService";
import type { IMessageRepository } from "../../Domain/repositories/messages/IMessageRepository";
import type { Message } from "../../Domain/models/Message";

export class MessageService implements IMessageService {
  constructor(private messageRepository: IMessageRepository) {}

  async sendMessage(
    senderId: number,
    receiverId: number,
    content: string
  ): Promise<Message> {
    return await this.messageRepository.createMessage(
      senderId,
      receiverId,
      content
    );
  }

  async getUserConversations(
    userId: number
  ): Promise<
    { otherUserId: number; lastMessage: string; unreadCount: number }[]
  > {
    return await this.messageRepository.getUserConversations(userId);
  }

  async getConversationMessages(
    userId: number,
    otherUserId: number
  ): Promise<Message[]> {
    return await this.messageRepository.getConversationMessages(
      userId,
      otherUserId
    );
  }

  async markMessageAsRead(userId: number, messageId: number): Promise<boolean> {
    return await this.messageRepository.markAsRead(userId, messageId);
  }
  async markAllMessagesAsRead(
    userId: number,
    otherUserId: number
  ): Promise<void> {
    return this.messageRepository.markAllAsRead(userId, otherUserId);
  }
}
