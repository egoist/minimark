import * as React from "react"
import AutosizeTextarea from "react-textarea-autosize"

import { cn } from "~/lib/utils"

export type TextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "style"
>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <AutosizeTextarea
        className={cn(
          "border-input placeholder:text-muted-foreground focus-visible:ring-ring focus-visible:border-ring flex min-h-[60px] w-full resize-none rounded-md border bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Textarea.displayName = "Textarea"

export { Textarea }
