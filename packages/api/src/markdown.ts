import Turndown from "turndown"
import { gfm } from "turndown-plugin-gfm"

const turndown = new Turndown()
turndown.use(gfm)

export function htmlToMarkdown(input: string) {
  return turndown.turndown(input)
}
