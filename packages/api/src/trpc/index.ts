import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { authRouter } from "./auth.router"
import { userRouter } from "./user.router"
import { t } from "./utils"
import { createContext } from "./context"
import type { inferRouterOutputs, inferRouterInputs } from "@trpc/server"
import { itemRouter } from "./item.router"
import { tagRouter } from "./tag.router"
import { spaceRouter } from "./space.router"

export const appRouter = t.router({
  auth: authRouter,
  space: spaceRouter,
  user: userRouter,
  item: itemRouter,
  tag: tagRouter,
})

export type AppRouter = typeof appRouter

export { t }

export const createCaller = t.createCallerFactory(appRouter)

export type RouterOutputs = inferRouterOutputs<AppRouter>

export type RouterInputs = inferRouterInputs<AppRouter>

export const createHandler = ({
  request,
  endpoint = "/api/trpc",
}: {
  request: Request
  endpoint?: string
}) =>
  fetchRequestHandler({
    endpoint,
    req: request,
    router: appRouter,
    createContext: ({ req, resHeaders }) => createContext({ req, resHeaders }),
    onError: IS_DEV
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
          )
        }
      : undefined,
  })
