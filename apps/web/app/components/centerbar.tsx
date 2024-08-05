import { NavLink, useParams, useSearchParams } from "@remix-run/react"
import { trpcReact } from "~/lib/trpc"
import { cn } from "~/lib/utils"
import dayjs from "dayjs"
import { LinksLoading } from "./skeletons"

export const Centerbar = () => {
  const [searchParams] = useSearchParams()
  const folderId = searchParams.get("folder") || null
  const type = searchParams.get("type") || "all"
  const linksQuery = trpcReact.link.getLinks.useQuery({
    folderId,
    type: type as any,
  })

  return (
    <div className="w-[20rem] border-r h-full flex flex-col shrink-0">
      {/* <header className="h-12 shrink-0 border-b"></header> */}
      <div
        key={`${type}-${folderId}`}
        className={cn(
          "p-2 grow overflow-auto",
          linksQuery.isLoading && "overflow-hidden",
        )}
      >
        {linksQuery.isLoading ? (
          <LinksLoading />
        ) : (
          <div className="grid gap-0.5 text-sm">
            {linksQuery.data?.map((link) => {
              return <LinkItem link={link} key={link.id} />
            })}
          </div>
        )}
      </div>
    </div>
  )
}

const LinkItem = ({
  link,
}: {
  link: {
    id: string
    title: string
    createdAt: Date
    readAt?: Date | null
    folderId?: string | null
  }
}) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const activeLinkId = searchParams.get("link") || null
  const isActive = activeLinkId === link.id
  const folderId = searchParams.get("folder") || null

  const foldersQuery = trpcReact.folder.getFolders.useQuery()
  const linkFolder = foldersQuery.data?.find((f) => f.id === link.folderId)
  const currentFolder = foldersQuery.data?.find((f) => f.id === folderId)

  return (
    <div
      role="button"
      className={cn(
        "flex items-start justify-start text-left p-2 rounded-lg",
        isActive ? "bg-zinc-200" : "hover:bg-zinc-200/50",
      )}
      onClick={() => {
        setSearchParams({
          folder: searchParams.get("folder") || "",
          type: searchParams.get("type") || "",
          link: link.id,
        })
      }}
    >
      <div className="w-4 shrink-0 h-full flex items-start pt-1.5">
        {!link.readAt && (
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
        )}
      </div>
      <div className="grow">
        <h3 className="font-semibold">{link.title}</h3>
        <div className="mt-1 flex items-center justify-between text-muted-foreground/60 text-xs font-semibold">
          <span className="shrink-0">
            {dayjs(link.createdAt).format("MMM DD, YY")}
          </span>

          {!currentFolder?.feedUrl && (
            <span className="truncate max-w-[40%]">{linkFolder?.name}</span>
          )}
        </div>
      </div>
    </div>
  )
}
