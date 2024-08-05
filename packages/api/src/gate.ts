import { AuthUser } from "./auth"

export const createGate = (user: AuthUser | null) => {
  const isSpaceMember = (spaceId: string) => {
    return user?.spaces.some((s) => s.id === spaceId)
  }

  const getUser = <T extends boolean>(required: T) => {
    if (required && !user) {
      throw new Error("User is required")
    }
    return user as T extends true ? AuthUser : AuthUser | null
  }

  return {
    isSpaceMember,

    getUser,
  }
}
