import type { IUserRepository } from "../../../Domain/repositories/users/IUserRepository";
import { User } from "../../../Domain/models/User";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";
export class UserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    try {
      const query = `
        INSERT INTO users (korisnickoIme, uloga, lozinka)
        VALUES (?, ?, ?)
      `;
      const [result] = await db.execute<ResultSetHeader>(query, [
        user.korisnickoIme,
        user.uloga,
        user.lozinka,
      ]);
      if (result.insertId)
        return new User(
          result.insertId,
          user.korisnickoIme,
          user.uloga,
          user.lozinka,
          "",
          "",
          "",
          ""
        );
      return new User();
    } catch {
      return new User();
    }
  }
  async getById(id: number): Promise<User> {
    try {
      const query = `SELECT * FROM users WHERE id = ?`;
      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);
      if (rows.length > 0) {
        const row = rows[0]!;
        return new User(
          row.id,
          row.korisnickoIme,
          row.uloga,
          row.lozinka,
          row.first_name,
          row.last_name,
          row.phone_number,
          row.profile_pic
        );
      }
      return new User();
    } catch {
      return new User();
    }
  }
  async getByUsername(korisnickoIme: string): Promise<User> {
    try {
      const query = `SELECT id, korisnickoIme, uloga, lozinka FROM users WHERE korisnickoIme = ?
`;
      const [rows] = await db.execute<RowDataPacket[]>(query, [korisnickoIme]);
      if (rows.length > 0) {
        const row = rows[0]!;
        return new User(row.id, row.korisnickoIme, row.uloga, row.lozinka);
      }
      return new User();
    } catch {
      return new User();
    }
  }
  async getAll(): Promise<User[]> {
    try {
      const query = `SELECT * FROM users ORDER BY id ASC`;
      const [rows] = await db.execute<RowDataPacket[]>(query);
      return rows.map(
        (row) =>
          new User(
            row.id,
            row.korisnickoIme,
            row.uloga,
            row.lozinka,
            row.first_name,
            row.last_name,
            row.phone_number,
            row.profile_pic
          )
      );
    } catch {
      return [];
    }
  }

  async getByRole(role: string): Promise<User[]> {
    try {
      const query = `SELECT * FROM users WHERE uloga = ? ORDER BY id ASC`;
      const [rows] = await db.execute<RowDataPacket[]>(query, [role]);
      console.log("DB rows for role", role, rows);
      return rows.map(
        (row) =>
          new User(
            row.id,
            row.korisnickoIme,
            row.uloga,
            row.lozinka,
            row.first_name,
            row.last_name,
            row.phone_number,
            row.profile_pic
          )
      );
    } catch {
      return [];
    }
  }
  async update(user: User): Promise<User> {
    try {
      const query = `
        UPDATE users 
        SET first_name = ?, last_name = ?, phone_number = ?, profile_pic = ?
        WHERE id = ?
      `;
      const [result] = await db.execute<ResultSetHeader>(query, [
        user.first_name,
        user.last_name,
        user.phone_number,
        user.profile_pic,
        user.id,
      ]);
      if (result.affectedRows > 0) return user;
      return new User();
    } catch {
      return new User();
    }
  }

  async updatePartial(userId: number, data: Partial<User>): Promise<User> {
    const allowedFields = [
      "korisnickoIme",
      "uloga",
      "lozinka",
      "first_name",
      "last_name",
      "phone_number",
      "profile_pic",
    ];

    const fields: string[] = [];
    const values: any[] = [];

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return this.getById(userId);
    }

    const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    values.push(userId);

    await db.execute<ResultSetHeader>(query, values);

    return this.getById(userId);
  }
  async delete(id: number): Promise<boolean> {
    try {
      const query = `DELETE FROM users WHERE id = ?`;
      const [result] = await db.execute<ResultSetHeader>(query, [id]);
      return result.affectedRows > 0;
    } catch {
      return false;
    }
  }
  async exists(id: number): Promise<boolean> {
    try {
      const query = `SELECT COUNT(*) as count FROM users WHERE id = ?`;
      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);
      return rows[0]!.count > 0;
    } catch {
      return false;
    }
  }
}
