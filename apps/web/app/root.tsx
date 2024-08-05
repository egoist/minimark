import "./css/tailwind.css"
import "prosekit/basic/style.css"
import "./css/prose.css"
import {
  Links,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import { TRPCReactProvider } from "./lib/trpc"
import { RedirectToSpaceWhenLoggedIn } from "./components/redirect-to-space"

export const meta: MetaFunction = () => {
  return [
    {
      title: "Minimark",
    },
    {
      name: "description",
      content: "Minimal bookmarking app",
    },
  ]
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <TRPCReactProvider>
      <RedirectToSpaceWhenLoggedIn />
      <Outlet />
    </TRPCReactProvider>
  )
}
