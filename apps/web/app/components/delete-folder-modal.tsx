import { trpcReact } from "~/lib/trpc"
import { Button } from "./ui/button"
import { Control } from "./ui/control"
import { Input } from "./ui/input"
import {
  ModalId,
  useModalOpen,
  useModalState,
  useResetModalState,
} from "~/lib/store"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "./ui/alert-dialog"

export const DeleteFolderModal = () => {
  const [isOpen, closeModal] = useModalOpen(ModalId.delete_folder)
  const [modalState] = useModalState(ModalId.delete_folder)
  const resetModalState = useResetModalState()

  const utils = trpcReact.useUtils()
  const deleteFolderMutation = trpcReact.folder.delelteFolder.useMutation({
    onSuccess() {
      closeModal()
      utils.folder.invalidate()
      utils.link.invalidate()
    },
  })

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          closeModal()
        }
      }}
    >
      <AlertDialogContent onClose={resetModalState}>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete this {modalState?.isFeed ? "Feed" : "Folder"}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div>
          Are you sure to delete {JSON.stringify(modalState?.name)} and the
          links inside this {modalState?.isFeed ? "Feed" : "Folder"} forever?
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            isLoading={deleteFolderMutation.isPending}
            onClick={() => {
              if (!modalState) return

              deleteFolderMutation.mutate({
                folderId: modalState.id,
              })
            }}
          >
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
