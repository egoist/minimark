import { atom, useAtom, useSetAtom } from "jotai"
import { useCallback, useMemo } from "react"

export const enum ModalId {
  new_link = "new_link",
  new_image = "new_image",
  new_note = "new_note",
  rename_tag = "rename_tag",
  delete_tag = "delete_tag",
}

type ModalState =
  | {
      id: ModalId.new_link
      state: null
    }
  | {
      id: ModalId.new_image
      state: null
    }
  | {
      id: ModalId.rename_tag
      state: { id: string; name: string } | null
    }
  | {
      id: ModalId.delete_tag
      state: { id: string; name: string } | null
    }

const modalIdAtom = atom<ModalId | null>(null)
const modalStateAtom = atom<ModalState | null>(null)

export const useModalId = () => useAtom(modalIdAtom)

export const useOpenModal = () => {
  const setModalId = useSetAtom(modalIdAtom)
  const setModalState = useSetAtom(modalStateAtom)

  return (state: ModalState) => {
    setModalState(state)
    setModalId(state.id)
  }
}

export const useModalState = <
  TModalId extends string,
  TModalState extends Extract<ModalState, { id: TModalId }>["state"]
>(
  id: TModalId
) => {
  const [state, setState] = useAtom(modalStateAtom)

  const modalState = useMemo(() => {
    if (!state) return null
    if (state.id !== id) return null
    return state.state as TModalState
  }, [id, state])

  const setModalState = (state: TModalState) => {
    setState({
      // @ts-expect-error
      id,
      state,
    })
  }

  return [modalState, setModalState] as const
}

export const useModalOpen = (id: ModalId) => {
  const [modalId, setModalId] = useModalId()

  const closeModal = useCallback(() => setModalId(null), [])

  return useMemo(() => {
    const isOpen = modalId === id

    return [isOpen, closeModal] as const
  }, [id, modalId, closeModal])
}

export const useResetModalState = () => {
  const setState = useSetAtom(modalStateAtom)

  return useCallback(() => setState(null), [])
}
