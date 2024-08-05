import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Control } from "./ui/control"
import { trpcReact } from "~/lib/trpc"
import { cn } from "~/lib/utils"
import { useCurrentUserQuery } from "~/lib/query"

export function LoginForm() {
  const requestLoginCodeMutation = trpcReact.auth.requestLoginCode.useMutation()
  const trpcUtils = trpcReact.useUtils()
  const loginMutation = trpcReact.auth.login.useMutation({
    onSuccess() {
      trpcUtils.invalidate()
    },
  })
  const currentUserQuery = useCurrentUserQuery()
  return (
    <form
      className="w-full max-w-sm"
      onSubmit={(e) => {
        e.preventDefault()

        const data = new FormData(e.currentTarget)

        if (requestLoginCodeMutation.data) {
          loginMutation.mutate({
            email: data.get("email") as string,
            code: data.get("code") as string,
          })
          return
        }

        requestLoginCodeMutation.mutate({
          email: data.get("email") as string,
        })
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Login</CardTitle>
          <CardDescription
            className={cn(requestLoginCodeMutation.data && "text-green-500")}
          >
            {requestLoginCodeMutation.data
              ? `We just sent you a login code`
              : `We'll send you a login code to your email`}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Control label="Email">
              <Input type="email" placeholder="" name="email" required />
            </Control>

            {requestLoginCodeMutation.data && (
              <Control label="Login code">
                <Input
                  type="text"
                  placeholder="Enter code"
                  name="code"
                  required
                  autoFocus
                />
              </Control>
            )}
          </div>

          <Button
            className="w-full"
            type="submit"
            isLoading={
              requestLoginCodeMutation.isPending ||
              loginMutation.isPending ||
              (loginMutation.isSuccess && currentUserQuery.isRefetching)
            }
          >
            {requestLoginCodeMutation.data ? "Log in" : "Send login code"}
          </Button>

          {/* <Button
            variant="outline"
            className="w-full"
            type="button"
            startContent={
              <span className="i-tabler-brand-google-filled text-lg text-red-600"></span>
            }
          >
            Login with Google
          </Button> */}
        </CardContent>
      </Card>
    </form>
  )
}
