import { migrate } from "drizzle-orm/node-postgres/migrator"
import * as schema from "./schema"
import { drizzle } from "drizzle-orm/node-postgres"
import pg from "pg"
import { env } from "../env"
import path from "path"
import { apiDir } from "../utils"

const initDB = () => {
  const client = new pg.Pool({
    connectionString: env.DATABASE_URL,
  })

  return drizzle(client, { schema, logger: env.NODE_ENV !== "production" })
}

export const db = initDB()

if (!IS_DEV) {
  await migrate(db, { migrationsFolder: path.join(apiDir, "migrations") })
}

export { schema }
