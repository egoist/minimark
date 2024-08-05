import { asc, eq } from "drizzle-orm"
import { db, schema } from "../db"
import { t } from "./utils"
import { z } from "zod"

export const tagRouter = t.router({
  getTags: t.procedure
    .input(
      z.object({
        spaceId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.gate.isSpaceMember(input.spaceId)) return []

      return db.query.tag.findMany({
        where: eq(schema.tag.spaceId, input.spaceId),
        orderBy: asc(schema.tag.name),
      })
    }),
})
