import { Link } from "@remix-run/react"
import homePreview from "~/assets/home-preview.png"

const footerLinks = [
  {
    href: "/privacy",
    label: "Privacy",
  },
]

export default function Page() {
  return (
    <>
      <header className="border-b">
        <div className="mx-auto flex h-20 max-w-screen-lg items-center justify-between px-4">
          <h1 className="text-lg font-bold">
            <Link to="/" prefetch="intent">
              Minimark
            </Link>
          </h1>

          <div className="flex items-center gap-5">
            <Link
              to="/login"
              prefetch="intent"
              className="inline-flex h-9 items-center rounded-full border px-4 font-semibold hover:bg-zinc-50"
            >
              Log In
            </Link>
          </div>
        </div>
      </header>

      <section>
        <div className="mx-auto max-w-screen-lg px-4 pt-32 text-center">
          <div className="mx-auto max-w-[85%]">
            <span className="mx-auto inline-flex h-8 items-center rounded-full border px-3 text-sm font-semibold">
              Alpha release
            </span>
            <h2 className="mt-4 text-3xl font-black leading-tight md:text-6xl">
              One App for All Your{" "}
              <span className="text-purple-500">Bookmarks</span>,{" "}
              <span className="text-orange-500">Notes</span> and{" "}
              <span className="text-green-500">Files</span>
            </h2>
          </div>
        </div>
      </section>

      <section>
        <img src={homePreview} />
      </section>

      <footer className="mt-20 border-t py-20 text-sm">
        <div className="mx-auto flex max-w-screen-lg items-center justify-between px-4">
          <div>&copy; 2024 Minimark</div>

          <div className="flex items-center gap-5">
            {footerLinks.map((link) => {
              return (
                <Link
                  to={link.href}
                  key={link.href}
                  className="hover:text-blue-500"
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>
      </footer>
    </>
  )
}
