import axios from "axios";
import type { Message } from "../../types/messages/Message";
import type { Conversation } from "../../types/messages/Conversation";
import type { IMessageAPIService } from "./IMessageAPIService";

const API_URL: string = import.meta.env.VITE_API_URL + "messages";

export const messageApi: IMessageAPIService = {
  async sendMessage(
    token: string,
    receiverId: number,
    content: string
  ): Promise<Message> {
    const res = await axios.post<{ success: boolean; data: Message }>(
      `${API_URL}`,
      { receiverId, content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.data;
  },

  async getConversations(
    token: string
  ): Promise<{ success: boolean; data: Conversation[] }> {
    const res = await axios.get<{ success: boolean; data: Conversation[] }>(
      `${API_URL}/conversations`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  },

  async getConversationMessages(
    token: string,
    otherUserId: number
  ): Promise<{ success: boolean; data: Message[] }> {
    const res = await axios.get<{ success: boolean; data: Message[] }>(
      `${API_URL}/conversations/${otherUserId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  },

  async markAsRead(
    token: string,
    messageId: number
  ): Promise<{ success: boolean }> {
    const res = await axios.post<{ success: boolean }>(
      `${API_URL}/${messageId}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  },
};
