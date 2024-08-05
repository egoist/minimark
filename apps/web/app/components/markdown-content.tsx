import Markdown from "react-markdown"

export const MarkdownContent = ({ children }: { children: string }) => {
  return <Markdown className="prose">{children}</Markdown>
}
