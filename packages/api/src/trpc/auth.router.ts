import { customAlphabet, nanoid } from "nanoid"
import { t } from "./utils"
import { z } from "zod"
import { db, schema } from "../db"
import dayjs from "dayjs"
import { setAuthCookie } from "../auth"
import { ServerError } from "./error"
import { desc, eq } from "drizzle-orm"
import { createSpace } from "../services/space.service"
import { sendLoginCodeEmail } from "../email"

const generateCode = customAlphabet("0123456789", 6)

export const authRouter = t.router({
  requestLoginCode: t.procedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const code = generateCode()

      await db.insert(schema.loginCode).values({
        code,
        email: input.email,
        expiresAt: dayjs().add(1, "hour").toDate(),
      })

      await sendLoginCodeEmail({ code, to: input.email })

      return true
    }),

  login: t.procedure
    .input(
      z.object({
        email: z.string().email(),
        code: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const loginCodes = await db.query.loginCode.findMany({
        where: eq(schema.loginCode.email, input.email),
      })

      const match = loginCodes.find((lc) => lc.code === input.code)

      if (!match) {
        throw new ServerError("invalid code")
      }

      if (match.expiresAt < new Date()) {
        throw new ServerError("code expired")
      }

      await db.delete(schema.loginCode).where(eq(schema.loginCode.id, match.id))

      let user = await db.query.user.findFirst({
        where: eq(schema.user.email, input.email),
      })

      if (!user) {
        ;[user] = await db
          .insert(schema.user)
          .values({ email: input.email })
          .returning()
      }

      const membership = await db.query.membership.findFirst({
        where: eq(schema.membership.userId, user.id),
        orderBy: desc(schema.membership.createdAt),
      })

      if (!membership) {
        await createSpace({
          userId: user.id,
          name: "My Space",
        })
      }

      const token = nanoid()
      await db.insert(schema.session).values({
        userId: user.id,
        token,
        name: "Login via Email",
      })

      setAuthCookie(ctx, token)
    }),

  logout: t.procedure.mutation(async ({ ctx }) => {
    setAuthCookie(ctx, "", { remove: true })
  }),
})
