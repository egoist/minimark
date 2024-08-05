import { useEffect } from "react"
import { useLocation, useNavigate } from "@remix-run/react"
import { trpcReact } from "~/lib/trpc"
import { useCurrentUserQuery } from "~/lib/query"

const redirectPaths = ["/", "/login"]

export const RedirectToSpaceWhenLoggedIn = () => {
  const currentUserQuery = useCurrentUserQuery()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (
      currentUserQuery.data &&
      !location.pathname.startsWith("/spaces/") &&
      redirectPaths.includes(location.pathname)
    ) {
      const [space] = currentUserQuery.data.spaces
      if (space) {
        navigate(`/spaces/${space.id}`)
      }
    }
  }, [currentUserQuery.data, location.pathname])

  return null
}
