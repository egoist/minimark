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
import AutosizeTextarea from "react-textarea-autosize"
import { useRef } from "react"

export const NewNoteModal = () => {
  const params = useParams()
  const spaceId = params.spaceId!
  const [isOpen, closeModal] = useModalOpen(ModalId.new_note)
  const resetModalState = useResetModalState()

  const utils = trpcReact.useUtils()
  const createNoteItemMutation = trpcReact.item.createNoteItem.useMutation({
    onSuccess() {
      closeModal()
      utils.item.invalidate()
    },
  })

  const formRef = useRef<HTMLFormElement>(null)

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
          <DialogTitle>New Note</DialogTitle>
        </DialogHeader>
        <div className="grow overflow-auto rounded-lg">
          <form
            ref={formRef}
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault()

              const data = new FormData(e.currentTarget)
              createNoteItemMutation.mutate({
                spaceId,
                content: data.get("content") as string,
              })
            }}
          >
            <AutosizeTextarea
              className="outline-none p-3 rounded-lg bg-zinc-100 resize-none"
              minRows={3}
              required
              name="content"
              placeholder="Write here..."
            />

            {createNoteItemMutation.error && (
              <div className="text-red-500">
                {createNoteItemMutation.error.message}
              </div>
            )}
          </form>
        </div>

        <div className="shrink-0">
          <Button
            type="button"
            onClick={() => {
              formRef.current?.requestSubmit()
            }}
            isLoading={createNoteItemMutation.isPending}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
