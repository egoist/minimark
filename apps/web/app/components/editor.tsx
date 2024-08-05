import "prosekit/basic/style.css"

import { defineBasicExtension } from "prosekit/basic"
import {
  createEditor,
  htmlFromNode,
  jsonFromHTML,
  type NodeJSON,
  type Editor as EditorType,
  nodeFromHTML,
  union,
} from "prosekit/core"
import { useCallback, useMemo, useState } from "react"
import { definePlaceholder } from "prosekit/extensions/placeholder"

import { ProseKit, useDocChange, useEditor } from "prosekit/react"
import { InlinePopover } from "prosekit/react/inline-popover"
import { cn } from "~/lib/utils"

const createExtension = ({
  placeholder = "",
}: { placeholder?: string } = {}) => {
  return union([defineBasicExtension(), definePlaceholder({ placeholder })])
}

type EditorExtension = ReturnType<typeof createExtension>

export type MinimarkEditorType = EditorType<EditorExtension>

export type PromiseMirrorNode = ReturnType<typeof nodeFromHTML>

function BubbleMenu() {
  const editor = useEditor<EditorExtension>({ update: true })

  const tools = [
    {
      id: "bold",
      icon: "i-lucide-bold",
      apply: () => editor.commands.toggleBold(),
      canApply: () => editor.commands.toggleBold.canApply(),
      active: () => editor.marks.bold.isActive(),
    },
    {
      id: "italic",
      icon: "i-lucide-italic",
      apply: () => editor.commands.toggleItalic(),
      canApply: () => editor.commands.toggleItalic.canApply(),
      active: () => editor.marks.italic.isActive(),
    },
    {
      id: "underline",
      icon: "i-lucide-underline",
      apply: () => editor.commands.toggleUnderline(),
      canApply: () => editor.commands.toggleUnderline.canApply(),
      active: () => editor.marks.underline.isActive(),
    },
  ]

  return (
    <InlinePopover className="border rounded-xl shadow p-1 space-x-1 bg-white">
      {tools.map((tool) => {
        return (
          <button
            key={tool.id}
            disabled={!tool.canApply()}
            onClick={tool.apply}
            className={cn(
              "w-8 h-8 inline-flex items-center justify-center rounded-lg",
              tool.active() ? "bg-zinc-200" : "hover:bg-zinc-100"
            )}
          >
            <div className={tool.icon}></div>
          </button>
        )
      })}
    </InlinePopover>
  )
}

export const useMinimarkEditor = ({
  defaultHTML,
  placeholder,
}: { defaultHTML?: string; placeholder?: string } = {}) => {
  const editor = useMemo(() => {
    return createEditor({
      extension: createExtension({ placeholder }),
      defaultHTML,
    })
  }, [defaultHTML, placeholder])

  return editor
}

export function MinimarkEditor({
  editor,
  handleChange,
}: {
  editor: MinimarkEditorType
  handleChange: (editor: EditorType) => void
}) {
  // Create a new editor instance whenever `defaultDoc` changes

  const handleDocChange = useCallback(
    () => handleChange(editor),
    [handleChange, editor]
  )

  useDocChange(handleDocChange, { editor })

  return (
    <ProseKit editor={editor}>
      <div className="relative grow">
        <div ref={editor.mount} className="outline-none h-full prose"></div>
        <BubbleMenu />
      </div>
    </ProseKit>
  )
}
