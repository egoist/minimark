import { z } from "zod"
import { t } from "./utils"
import { createSpace } from "../services/space.service"

export const spaceRouter = t.router({
  createSpace: t.procedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.gate.getUser(true)

      const space = await createSpace({
        userId: user.id,
        name: input.name,
      })

      return space
    }),
})
