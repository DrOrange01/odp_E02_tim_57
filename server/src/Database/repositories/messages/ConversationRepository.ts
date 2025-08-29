import { Conversation } from "../../../Domain/models/Conversation";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";

export class ConversationRepository {
  async getConversation(
    user1_id: number,
    user2_id: number
  ): Promise<Conversation | null> {
    const query = `
            SELECT * FROM conversations
            WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)
        `;
    const [rows] = await db.execute<RowDataPacket[]>(query, [
      user1_id,
      user2_id,
      user2_id,
      user1_id,
    ]);
    if (rows.length === 0) return null;
    const row = rows[0]!;
    return new Conversation(
      row.id,
      row.user1_id,
      row.user2_id,
      row.last_message ? new Date(row.last_message) : undefined
    );
  }

  async createConversation(
    user1_id: number,
    user2_id: number
  ): Promise<Conversation> {
    const query = `INSERT INTO conversations (user1_id, user2_id) VALUES (?, ?)`;
    const [result] = await db.execute<ResultSetHeader>(query, [
      user1_id,
      user2_id,
    ]);
    const insertId = (result as ResultSetHeader).insertId;
    return new Conversation(insertId, user1_id, user2_id);
  }

  async updateLastMessage(
    conversationId: number,
    timestamp: Date
  ): Promise<void> {
    const query = `UPDATE conversations SET last_message = ? WHERE id = ?`;
    await db.execute(query, [timestamp, conversationId]);
  }
}
