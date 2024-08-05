import { cn } from "~/lib/utils"

export const Spinner = ({ className }: { className?: string }) => {
  return (
    <span
      className={cn("i-mingcute-loading-3-fill animate-spin", className)}
    ></span>
  )
}
