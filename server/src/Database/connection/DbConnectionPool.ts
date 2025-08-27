import { createPool } from "mysql2/promise";
import type { Pool } from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

const pool: Pool = createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "DEFAULT_DB2",
  port: Number(process.env.DB_PORT) || 3306,
});

export default pool;
