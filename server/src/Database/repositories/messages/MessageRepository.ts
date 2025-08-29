import { Message } from "../../../Domain/models/Message";
import type { IMessageRepository } from "../../../Domain/repositories/messages/IMessageRepository";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import db from "../../connection/DbConnectionPool";

export class MessageRepository implements IMessageRepository {
  async createMessage(
    senderId: number,
    receiverId: number,
    content: string
  ): Promise<Message> {
    try {
      const [convRows] = await db.execute<RowDataPacket[]>(
        `SELECT id FROM conversations 
         WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)`,
        [senderId, receiverId, receiverId, senderId]
      );

      let conversationId: number;

      if (convRows.length > 0) {
        conversationId = convRows[0].id;
      } else {
        const [convResult] = await db.execute<ResultSetHeader>(
          `INSERT INTO conversations (user1_id, user2_id) VALUES (?, ?)`,
          [senderId, receiverId]
        );
        conversationId = (convResult as any).insertId;
      }

      const [result] = await db.execute<ResultSetHeader>(
        `
        INSERT INTO messages
          (conversation_id, sender_id, receiver_id, content, timestamp, is_read)
        VALUES (?, ?, ?, ?, NOW(), false)
        `,
        [conversationId, senderId, receiverId, content]
      );

      return new Message(
        (result as any).insertId,
        conversationId,
        senderId,
        receiverId,
        content,
        new Date(),
        false
      );
    } catch (err) {
      console.error(err);
      return new Message();
    }
  }

  async getUserConversations(
    userId: number
  ): Promise<
    { otherUserId: number; lastMessage: string; unreadCount: number }[]
  > {
    try {
      const query = `
        SELECT 
  c.id AS conversationId,
  CASE 
    WHEN c.user1_id = ? THEN c.user2_id 
    ELSE c.user1_id 
  END AS otherUserId,
  m.content AS lastMessage,
  COALESCE(SUM(CASE WHEN m2.receiver_id = ? AND m2.is_read = false THEN 1 ELSE 0 END), 0) AS unreadCount
FROM conversations c
INNER JOIN messages m 
  ON m.id = (
    SELECT m1.id 
    FROM messages m1 
    WHERE m1.conversation_id = c.id 
    ORDER BY m1.timestamp DESC 
    LIMIT 1
  )
LEFT JOIN messages m2 
  ON m2.conversation_id = c.id
WHERE c.user1_id = ? OR c.user2_id = ?
GROUP BY c.id, m.content
ORDER BY MAX(m2.timestamp) DESC;
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query, [
        userId,
        userId,
        userId,
        userId,
      ]);

      return rows.map((row) => ({
        otherUserId: row.otherUserId,
        lastMessage: row.lastMessage,
        unreadCount: row.unreadCount,
      }));
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async getConversationMessages(
    userId: number,
    otherUserId: number
  ): Promise<Message[]> {
    try {
      const [convRows] = await db.execute<RowDataPacket[]>(
        `SELECT id FROM conversations 
         WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)`,
        [userId, otherUserId, otherUserId, userId]
      );

      if (convRows.length === 0) return [];

      const conversationId = convRows[0].id;

      const [rows] = await db.execute<RowDataPacket[]>(
        `SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp ASC`,
        [conversationId]
      );

      return rows.map(
        (row) =>
          new Message(
            row.id,
            row.conversation_id,
            row.sender_id,
            row.receiver_id,
            row.content,
            new Date(row.timestamp),
            !!row.is_read
          )
      );
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async markAsRead(userId: number, messageId: number): Promise<boolean> {
    try {
      const query = `
        UPDATE messages 
        SET is_read = true 
        WHERE id = ? AND receiver_id = ?
      `;
      const [result] = await db.execute<ResultSetHeader>(query, [
        messageId,
        userId,
      ]);

      return result.affectedRows > 0;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
