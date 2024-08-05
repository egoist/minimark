import { trpcReact } from "~/lib/trpc"
import { Button } from "./ui/button"
import { Control } from "./ui/control"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { ModalId, useModalOpen, useResetModalState } from "~/lib/store"

export const NewFolderModal = () => {
  const [isOpen, closeModal] = useModalOpen(ModalId.new_folder)
  const resetModalState = useResetModalState()

  const utils = trpcReact.useUtils()
  const createFolderMutation = trpcReact.folder.createFolder.useMutation({
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
          <DialogTitle>New Folder</DialogTitle>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault()

            const data = new FormData(e.currentTarget)
            createFolderMutation.mutate({
              name: data.get("name") as string,
            })
          }}
        >
          <Control label="Folder name">
            <Input name="name" required />
          </Control>

          {createFolderMutation.error && (
            <div className="text-red-500">
              {createFolderMutation.error.message}
            </div>
          )}

          <div>
            <Button type="submit" isLoading={createFolderMutation.isPending}>
              Confirm
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
