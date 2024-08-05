import { AuthUser, getUserFromCookie } from "../auth"
import { createGate } from "../gate"

export const createContext = async (options: {
  req: Request
  resHeaders: Headers
}) => {
  const user = await getUserFromCookie(options.req)
  const gate = createGate(user)
  return {
    user,
    req: options.req,
    resHeaders: options.resHeaders,
    gate,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
