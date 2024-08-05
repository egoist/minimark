import { Dialog, DialogClose, DialogContent } from "./ui/dialog"
import { useParams, useSearchParams } from "@remix-run/react"
import { Button } from "./ui/button"
import { trpcReact } from "~/lib/trpc"
import { useItemsQuery } from "~/lib/query"
import { RouterOutputs } from "@workspace/api"
import AutosizeTextarea from "react-textarea-autosize"
import { useRef } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { DialogTitle } from "@radix-ui/react-dialog"
import { cn } from "~/lib/utils"
import { MarkdownContent } from "./markdown-content"
import { Control } from "./ui/control"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { useForm } from "react-hook-form"

export default function ItemModal() {
  const params = useParams()
  const spaceId = params.spaceId!
  const [searchParams, setSearchParams] = useSearchParams()
  const itemId = searchParams.get("item")
  const isOpen = Boolean(itemId)
  const closeModal = () => {
    setSearchParams((prev) => {
      prev.delete("item")
      return prev
    })
  }
  const is = searchParams.getAll("is")
  const isTrash = is.includes("trash")

  const itemsQuery = useItemsQuery({ spaceId, isTrash })
  const item = itemsQuery.data?.find((item) => item.id === itemId)

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          closeModal()
        }
      }}
    >
      <DialogContent fullPage className="flex flex-col">
        {item ? (
          item.type === "note" ? (
            <NoteItem item={item} />
          ) : (
            <LinkItem item={item} />
          )
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

const ItemLayout = ({
  title,
  headerRight,
  main,
  sidebar,
  item,
}: {
  title: React.ReactNode
  headerRight?: React.ReactNode
  main: React.ReactNode
  sidebar?: React.ReactNode
  item: RouterOutputs["item"]["getItems"][number]
}) => {
  const moveToTrashMutation = trpcReact.item.moveToTrash.useMutation({})
  const [, setSearchParams] = useSearchParams()
  const utils = trpcReact.useUtils()

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between border-b px-3">
        <div className="flex items-center gap-2">
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="focus-visible:ring-0"
            >
              <span className="i-tabler-x"></span>
            </Button>
          </DialogClose>

          <DialogTitle className="font-medium">{title}</DialogTitle>
        </div>

        <div className="flex items-center gap-3">
          {headerRight}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="" size="icon" variant="ghost">
                <span className="i-tabler-dots"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className={cn(
                  !item.deletedAt && "text-red-500 focus:text-red-600",
                )}
                onClick={() => {
                  moveToTrashMutation.mutate(
                    { itemId: item.id },
                    {
                      onSuccess() {
                        utils.item.invalidate()
                        setSearchParams(
                          (prev) => {
                            prev.delete("item")
                            return prev
                          },
                          // { replace: true }
                        )
                      },
                    },
                  )
                }}
              >
                <span
                  className={
                    item.deletedAt ? "i-tabler-restore" : "i-tabler-trash"
                  }
                ></span>
                <span>{item.deletedAt ? "Put Back" : "Trash"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex h-0 grow">
        <div className="grow overflow-auto">{main}</div>
        <div className="w-80 overflow-auto border-l">{sidebar}</div>
      </div>
    </>
  )
}

const NoteItem = ({
  item,
}: {
  item: RouterOutputs["item"]["getItems"][number]
}) => {
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const utils = trpcReact.useUtils()

  const updateItemMutation = trpcReact.item.updateNoteItem.useMutation({
    onSuccess() {
      utils.item.invalidate()
    },
  })

  return (
    <>
      <ItemLayout
        title="Note"
        item={item}
        headerRight={
          <>
            <Button
              className=""
              variant="secondary"
              isLoading={updateItemMutation.isPending}
              onClick={() => {
                updateItemMutation.mutate({
                  itemId: item.id,
                  content: contentRef.current?.value ?? "",
                })
              }}
            >
              <span>Save</span>
            </Button>
          </>
        }
        main={
          <div className="mx-auto w-full max-w-screen-md">
            <AutosizeTextarea
              ref={contentRef}
              defaultValue={item.content || ""}
              className="w-full resize-none rounded-lg p-3 outline-none"
            />
          </div>
        }
      />
    </>
  )
}

const LinkItem = ({
  item,
}: {
  item: RouterOutputs["item"]["getItems"][number]
}) => {
  const utils = trpcReact.useUtils()
  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: item.title ?? "",
      description: item.description ?? "",
      url: item.url ?? "",
    },
  })

  const updateLinkItemMutation = trpcReact.item.updateLinkItem.useMutation({
    onSuccess() {
      utils.item.invalidate()
    },
  })

  const onSubmit = handleSubmit((values) => {
    updateLinkItemMutation.mutate({
      itemId: item.id,
      title: values.title,
      description: values.description,
      url: values.url,
    })
  })

  return (
    <ItemLayout
      item={item}
      title="Link"
      main={
        <div className="mx-auto max-w-screen-md p-5">
          <h2 className="break-words text-4xl font-bold">{item.title}</h2>
          {item.description && (
            <div className="mt-1 text-zinc-500">{item.description}</div>
          )}
          <div className="mt-2">
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                className="inline-flex h-6 items-center rounded-md bg-zinc-200 px-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-300"
              >
                {new URL(item.url).hostname}
              </a>
            )}
          </div>

          {item.content && (
            <div className="mt-8">
              <MarkdownContent>{item.content}</MarkdownContent>
            </div>
          )}
        </div>
      }
      sidebar={
        <form className="flex h-full flex-col" onSubmit={onSubmit}>
          <div className="grow overflow-auto p-3">
            <div className="grid gap-3">
              <Control label="Title">
                <Textarea required {...register("title")} />
              </Control>

              <Control label="Description">
                <Textarea {...register("description")}></Textarea>
              </Control>

              <Control label="URL">
                <Textarea required {...register("url")} />
              </Control>
            </div>
          </div>

          <footer className="flex h-14 shrink-0 items-center border-t px-3">
            <Button type="submit" isLoading={updateLinkItemMutation.isPending}>
              Save
            </Button>
          </footer>
        </form>
      }
    />
  )
}
