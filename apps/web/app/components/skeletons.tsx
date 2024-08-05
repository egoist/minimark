import { memo } from "react"
import { cn } from "~/lib/utils"

const bgClass = "bg-zinc-200 dark:bg-zinc-800"

const Bar = ({
  w,
  h,
  className,
}: {
  w?: number
  h?: number
  className?: string
}) => {
  return (
    <div
      style={{
        width: `${(w || 1) * 100}%`,
        height: `${30 * (h || 1)}px`,
      }}
      className={cn(
        bgClass,
        "rounded-lg",
        h && h < 0.8 && "rounded-md",
        className,
      )}
    ></div>
  )
}

export const PostLoading = memo(() => {
  return (
    <div className="animate-pulse">
      <div className="grid gap-2">
        <Bar w={0.5} h={1.2} />
        <Bar w={0.2} h={0.8} />
      </div>

      {new Array(3).fill(null).map((_, i) => (
        <div key={i} className="grid gap-1.5 mt-8">
          <Bar />
          <Bar />
          <Bar />
        </div>
      ))}
    </div>
  )
})

export const LinksLoading = memo(() => {
  return (
    <div className="animate-pulse grid gap-5 px-2 py-2 pl-6">
      {new Array(20).fill(null).map((_, i) => {
        return (
          <div key={i} className="grid gap-1">
            <Bar h={0.8} />
            <Bar h={0.5} w={0.3} />
          </div>
        )
      })}
    </div>
  )
})

export const FoldersLoading = memo(() => {
  return (
    <div className="grid gap-2 animate-pulse">
      {new Array(10).fill(null).map((_, i) => (
        <div key={i} className="grid gap-1">
          <Bar h={0.6} />
        </div>
      ))}
    </div>
  )
})

export const TopLinksLoading = memo(() => {
  return (
    <div className="grid gap-2 animate-pulse">
      {new Array(2).fill(null).map((_, i) => (
        <div key={i} className="grid gap-1">
          <Bar h={0.8} />
        </div>
      ))}
    </div>
  )
})
