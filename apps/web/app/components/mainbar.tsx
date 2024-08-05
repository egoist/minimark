import { Link, useNavigate, useParams, useSearchParams } from "@remix-run/react"
import dayjs from "dayjs"
import { trpcReact } from "~/lib/trpc"
import { PostLoading } from "./skeletons"
import { cn } from "~/lib/utils"
import { Button } from "./ui/button"
import { useItemsQuery } from "~/lib/query"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { stringifyRouteQuery, useRouteQuery } from "~/lib/router"
import { ModalId, useModalId } from "~/lib/store"
import { timeago } from "~/lib/date"
import { MarkdownContent } from "./markdown-content"

export const Mainbar = () => {
  const [searchParams] = useSearchParams()
  const params = useParams<{ spaceId: string }>()
  const spaceId = params.spaceId!
  const routeQuery = useRouteQuery()
  const itemId = searchParams.get("itemId") || null
  const is = searchParams.getAll("is")
  const isTrash = is.includes("trash")

  const utils = trpcReact.useUtils()
  const itemsQuery = useItemsQuery({ spaceId, isTrash })
  const navigate = useNavigate()
  const [, setModalId] = useModalId()

  return (
    <div className="flex grow flex-col">
      <header className="flex h-12 shrink-0 items-center justify-between border-b px-4">
        <span></span>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                className="rounded-full hover:bg-zinc-200 aria-expanded:bg-zinc-200"
                variant="secondary"
              >
                <span className="i-tabler-plus"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setModalId(ModalId.new_link)}>
                New Link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setModalId(ModalId.new_note)}>
                New Note
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className={cn("grow overflow-auto p-4")}>
        {itemsQuery.data && itemsQuery.data.length === 0 && (
          <div className="flex h-full select-none flex-col items-center justify-center gap-2">
            <span className="i-tabler-hourglass-empty text-3xl"></span>
            <span>No items</span>
          </div>
        )}

        {itemsQuery.data && itemsQuery.data.length > 0 && (
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {itemsQuery.data?.map((item) => {
              return (
                <button
                  className="group relative flex flex-col overflow-hidden rounded-xl bg-zinc-100 text-left ring-zinc-200 hover:ring-4"
                  key={item.id}
                  type="button"
                  onClick={() => {
                    const newSearchParams = new URLSearchParams(searchParams)
                    newSearchParams.set("item", item.id)
                    navigate(`/spaces/${spaceId}?${newSearchParams.toString()}`)
                  }}
                >
                  <div className="flex w-full grow">
                    <div className="min-h-[100px] grow p-3">
                      {item.type === "note" ? (
                        <div className="max-h-[100px] overflow-hidden">
                          <MarkdownContent>
                            {item.content || ""}
                          </MarkdownContent>
                        </div>
                      ) : (
                        <div className="">
                          <div className="text-lg font-medium">
                            <span className="line-clamp-2 leading-tight">
                              {item.title || "Untitled"}
                            </span>
                          </div>
                          <div className="mt-1.5 line-clamp-3 text-xs leading-tight text-zinc-500">
                            {item.description}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 pr-3 pt-5">
                      {item.type === "link" && (
                        <a
                          target="_blank"
                          href={item.url || ""}
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                          style={
                            item.linkImage
                              ? { backgroundImage: `url(${item.linkImage})` }
                              : {}
                          }
                          className={cn(
                            "group/open-external flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-lg bg-cover bg-center text-2xl text-zinc-400 transition hover:bg-zinc-200 hover:!bg-none hover:text-zinc-800",
                          )}
                        >
                          <span
                            className={cn(
                              "i-tabler-external-link",
                              item.linkImage &&
                                "opacity-0 group-hover/open-external:opacity-100",
                            )}
                          ></span>
                        </a>
                      )}
                    </div>
                  </div>

                  <footer className="flex h-8 w-full shrink-0 items-center border-t border-zinc-200/70 px-3 text-xs text-zinc-500">
                    <span>{timeago(item.createdAt)}</span>

                    {item.url && (
                      <>
                        <span className="mx-2 select-none">·</span>
                        <span className="">{new URL(item.url).hostname}</span>
                      </>
                    )}
                  </footer>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
