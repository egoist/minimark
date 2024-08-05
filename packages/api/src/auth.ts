import Cookie from "cookie"
import { db, schema } from "./db/index"
import { Context } from "./trpc/context"
import { eq } from "drizzle-orm"
import { env } from "./env"

export type AuthUser = {
  id: string
  email: string
  avatar: string | null
  spaces: {
    id: string
    name: string
    role: "admin"
    createdAt: Date
  }[]
}

export async function getUserFromCookie(
  req: Request,
): Promise<AuthUser | null> {
  const cookie = Cookie.parse(req.headers.get("cookie") || "")
  const token = cookie[env.AUTH_COOKIE_NAME]
  if (token) {
    const session = await db.query.session.findFirst({
      where: eq(schema.session.token, token),
      with: {
        user: {
          with: {
            memberships: {
              with: {
                space: true,
              },
            },
          },
        },
      },
    })

    if (session) {
      return {
        id: session.user.id,
        email: session.user.email,
        avatar: session.user.avatar,
        spaces: session.user.memberships.map((m) => {
          return {
            ...m.space,
            role: m.role,
          }
        }),
      }
    }
  }
  return null
}

export const setAuthCookie = (
  ctx: Context,
  token: string,
  { remove }: { remove?: boolean } = {},
) => {
  const cookie = Cookie.serialize(env.AUTH_COOKIE_NAME, token, {
    path: "/",
    httpOnly: true,
    secure: true,
    // So that our browser extension can access the cookie
    // TODO: maybe there's a better way to do this?
    sameSite: "none",
    // 1 year
    maxAge: remove ? 0 : 60 * 60 * 24 * 365,
    domain: env.AUTH_COOKIE_DOMAIN,
  })

  ctx.resHeaders.set("Set-Cookie", cookie)
}
