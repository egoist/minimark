import { useCurrentUserQuery } from "~/lib/query"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { useNavigate, useParams } from "@remix-run/react"
import { cn } from "~/lib/utils"
import { trpcReact } from "~/lib/trpc"

export const SpacePicker = () => {
  const params = useParams()
  const spaceId = params.spaceId!
  const { data: currentUser, isLoading } = useCurrentUserQuery()
  const navigate = useNavigate()

  const logoutMutation = trpcReact.auth.logout.useMutation()

  const activeSpace = currentUser?.spaces.find((space) => space.id === spaceId)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "-ml-2 flex h-7 max-w-[80%] select-none items-center gap-1 truncate rounded-md pl-2 pr-2 text-sm font-medium outline-none hover:bg-zinc-100 aria-expanded:bg-zinc-100",
          isLoading && "w-[50%] animate-pulse bg-zinc-100",
        )}
      >
        <span className="truncate">{activeSpace?.name}</span>
        {activeSpace && <span className="i-tabler-chevron-down"></span>}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {currentUser?.spaces.map((space) => {
          const isActive = space.id === activeSpace?.id
          return (
            <DropdownMenuItem
              key={space.id}
              className="flex items-center justify-between"
              onClick={() => {
                navigate(`/spaces/${space.id}`)
              }}
            >
              <span>{space.name}</span>

              {isActive && (
                <span className="i-tabler-check text-base text-green-500"></span>
              )}
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            navigate(`/new-space`)
          }}
        >
          <span className="i-mingcute-classify-add-line"></span>
          <span>New Space</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            logoutMutation.mutate(undefined, {
              onSuccess() {
                location.href = "/"
              },
            })
          }}
        >
          <span className="i-mingcute-exit-line"></span>
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
