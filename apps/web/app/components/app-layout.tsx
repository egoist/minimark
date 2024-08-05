import { NewLinkModal } from "./new-link-modal"

import { Sidebar } from "./sidebar"
import { Centerbar } from "./centerbar"
import { Mainbar } from "./mainbar"
import { NewFolderModal } from "./new-folder-modal"
import { RenameFolderModal } from "./rename-folder-modal"
import { DeleteFolderModal } from "./delete-folder-modal"
import { NewNoteModal } from "./new-note-modal"
import { lazy } from "react"

const ItemModal = lazy(() => import("./item-modal"))

export const AppLayout = () => {
  return (
    <>
      <NewLinkModal />
      <NewNoteModal />
      <ItemModal />

      <NewFolderModal />

      <RenameFolderModal />

      <DeleteFolderModal />

      <div className="h-dvh flex">
        <Sidebar />

        <Mainbar />
      </div>
    </>
  )
}
