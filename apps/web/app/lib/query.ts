import { trpcReact } from "./trpc"

export const useCurrentUserQuery = () => {
  return trpcReact.user.getCurrentUser.useQuery()
}

export const useItemsQuery = ({
  spaceId,
  isTrash,
}: {
  spaceId: string
  isTrash: boolean
}) => {
  return trpcReact.item.getItems.useQuery({ spaceId, isTrash })
}
