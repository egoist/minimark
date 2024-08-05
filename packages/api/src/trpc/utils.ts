import { initTRPC } from "@trpc/server"

import { Context } from "./context"
import SuperJSON from "superjson"

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
export const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
})
