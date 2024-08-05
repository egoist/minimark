import { z } from "zod"
import { t } from "./utils"
import { db, schema } from "../db"
import { eq } from "drizzle-orm"

export const userRouter = t.router({
  getCurrentUser: t.procedure.query(({ ctx }) => {
    return ctx.user
  }),

  updateProfile: t.procedure
    .input(
      z.object({
        avatar: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) return

      await db
        .update(schema.user)
        .set({
          avatar: input.avatar,
        })
        .where(eq(schema.user.id, ctx.user.id))
    }),
})
