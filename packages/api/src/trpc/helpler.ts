import { sql } from "drizzle-orm"
import { SQLiteColumn } from "drizzle-orm/sqlite-core"

export const setToNowIfNull = (column: SQLiteColumn) =>
  sql`CASE WHEN ${column} is NULL THEN NOW() ELSE NULL END`
