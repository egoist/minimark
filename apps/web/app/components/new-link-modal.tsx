import { trpcReact } from "~/lib/trpc"
import { Button } from "./ui/button"
import { Control } from "./ui/control"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import {
  useModalId,
  useModalState,
  useModalOpen,
  useResetModalState,
  ModalId,
} from "~/lib/store"
import { useParams } from "@remix-run/react"

export const NewLinkModal = () => {
  const params = useParams()
  const spaceId = params.spaceId!
  const [isOpen, closeModal] = useModalOpen(ModalId.new_link)
  const resetModalState = useResetModalState()

  const utils = trpcReact.useUtils()
  const createLinkItemMutation = trpcReact.item.createLinkItem.useMutation({
    onSuccess() {
      closeModal()
      utils.item.invalidate()
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
          <DialogTitle>New Link</DialogTitle>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault()

            const data = new FormData(e.currentTarget)
            createLinkItemMutation.mutate({
              spaceId,
              url: data.get("url") as string,
            })
          }}
        >
          <Control label="URL">
            <Input required name="url" type="url" />
          </Control>

          {createLinkItemMutation.error && (
            <div className="text-red-500">
              {createLinkItemMutation.error.message}
            </div>
          )}

          <div>
            <Button type="submit" isLoading={createLinkItemMutation.isPending}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
