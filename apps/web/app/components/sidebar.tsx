import { Link, useParams, useSearchParams } from "@remix-run/react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu"
import { Button } from "./ui/button"
import { ModalId, useOpenModal } from "~/lib/store"
import { trpcReact } from "~/lib/trpc"
import { cn } from "~/lib/utils"
import { useEffect, useRef, useState } from "react"
import { ClassValue } from "clsx"
import { SpacePicker } from "./space-picker"

const linkVariants = ({
  isActive,
  className,
}: {
  isActive?: boolean
  className?: ClassValue
}) =>
  cn(
    "flex rounded-md items-center h-7 px-2 -mx-2",
    isActive ? "bg-zinc-100" : "hover:bg-zinc-100/50",
    className,
  )

export const Sidebar = () => {
  return (
    <div className="sidebar h-full w-60 shrink-0 border-r text-sm">
      <SidebarHeader />

      <TopLinks />

      <Tags />
    </div>
  )
}

export const SidebarHeader = () => {
  const openModal = useOpenModal()

  return (
    <header className="flex h-14 items-center justify-between px-4">
      <SpacePicker />

      <div className="flex items-center gap-1"></div>
    </header>
  )
}

const TopLinks = () => {
  const params = useParams<{ spaceId: string }>()
  const [searchParams] = useSearchParams()

  const is = searchParams.get("is")
  const folderId = searchParams.get("folder")

  const topLinks = [
    {
      href: `/spaces/${params.spaceId}`,
      text: "All",
      isActive: !is && !folderId,
    },
    {
      href: `/spaces/${params.spaceId}?is=trash`,
      text: "Trash",
      isActive: is === "trash",
    },
  ]

  return (
    <div className="grid gap-0.5 px-4">
      {topLinks.map((link) => {
        return (
          <Link
            key={link.href}
            to={link.href}
            className={linkVariants({ isActive: link.isActive })}
          >
            {link.text}
          </Link>
        )
      })}
    </div>
  )
}

export const Tags = () => {
  const params = useParams<{ spaceId: string }>()
  const tagsQuery = trpcReact.tag.getTags.useQuery({ spaceId: params.spaceId! })
  const tags = tagsQuery.data || []

  return (
    <div className="mt-5 grow overflow-auto px-4 pb-2">
      <div className="grid gap-0.5 text-sm">
        {tags.map((tag) => {
          return <TagItem tag={tag} key={tag.id} />
        })}
      </div>
    </div>
  )
}

const TagItem = ({ tag }: { tag: { id: string; name: string } }) => {
  const [searchParams] = useSearchParams()

  const utils = trpcReact.useUtils()
  const openModal = useOpenModal()

  const isActive = searchParams.get("tag") === tag.id

  return (
    <div className="relative">
      <Link
        to={`/?tag=${tag.id}`}
        className={linkVariants({
          isActive,
          className: ["group gap-2"],
        })}
      >
        <span className="w-0 grow truncate">{tag.name}</span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="invisible inline-flex h-5 w-5 items-center justify-center rounded-md hover:bg-zinc-400/70 group-hover:visible aria-expanded:visible aria-expanded:bg-zinc-400/70"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
              }}
            >
              <span className="i-tabler-dots"></span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                openModal({
                  id: ModalId.rename_tag,
                  state: { id: tag.id, name: tag.name },
                })
              }}
            >
              Rename
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                openModal({
                  id: ModalId.delete_tag,
                  state: {
                    id: tag.id,
                    name: tag.name,
                  },
                })
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Link>
    </div>
  )
}
