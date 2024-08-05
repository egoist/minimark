import { trpcReact } from "~/lib/trpc"
import { Button } from "./ui/button"
import { Control } from "./ui/control"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import {
  ModalId,
  useModalOpen,
  useModalState,
  useResetModalState,
} from "~/lib/store"

export const RenameFolderModal = () => {
  const [isOpen, closeModal] = useModalOpen(ModalId.rename_folder)
  const [modalState] = useModalState(ModalId.rename_folder)
  const resetModalState = useResetModalState()

  const utils = trpcReact.useUtils()
  const updateFolderMutation = trpcReact.folder.updateFolder.useMutation({
    onSuccess() {
      closeModal()
      utils.folder.invalidate()
    },
  })

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          closeModal()
        }
      }}
    >
      <DialogContent onClose={resetModalState}>
        <DialogHeader>
          <DialogTitle>Rename</DialogTitle>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault()

            if (!modalState) return

            const data = new FormData(e.currentTarget)
            updateFolderMutation.mutate({
              folderId: modalState.id,
              name: data.get("name") as string,
            })
          }}
        >
          <Control label="Folder name">
            <Input name="name" required defaultValue={modalState?.name} />
          </Control>

          {updateFolderMutation.error && (
            <div className="text-red-500">
              {updateFolderMutation.error.message}
            </div>
          )}

          <div>
            <Button type="submit" isLoading={updateFolderMutation.isPending}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
