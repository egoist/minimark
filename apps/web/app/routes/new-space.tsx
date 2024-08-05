import { Link, useNavigate } from "@remix-run/react"
import { Button, buttonVariants } from "~/components/ui/button"
import { Control } from "~/components/ui/control"
import { Input } from "~/components/ui/input"
import { trpcReact } from "~/lib/trpc"

export default function Page() {
  const navigate = useNavigate()
  const utils = trpcReact.useUtils()
  const createSpaceMutation = trpcReact.space.createSpace.useMutation({
    onSuccess(space) {
      utils.user.getCurrentUser.invalidate()
      navigate(`/spaces/${space.id}`)
    },
  })

  return (
    <>
      <header className="fixed left-0 right-0 top-0 flex h-20 items-center justify-between px-5">
        <Link to="/" className={buttonVariants({ variant: "ghost" })}>
          <span className="i-tabler-chevron-left"></span>
          <span>Back</span>
        </Link>
      </header>

      <div className="grid h-dvh place-items-center">
        <div className="mx-auto -mt-20 w-full max-w-md p-5">
          <h1 className="mb-4 text-center text-3xl font-bold">New Space</h1>
          <div className="rounded-xl border bg-white p-8">
            <form
              className="grid gap-4"
              onSubmit={(e) => {
                e.preventDefault()

                const data = new FormData(e.currentTarget)
                createSpaceMutation.mutate({
                  name: data.get("name") as string,
                })
              }}
            >
              <Control label="Name">
                <Input required name="name" />
              </Control>
              <div>
                <Button type="submit" isLoading={createSpaceMutation.isPending}>
                  Create
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
