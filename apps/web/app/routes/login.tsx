import { Link, MetaFunction } from "@remix-run/react"
import { LoginForm } from "~/components/login-form"

export const meta: MetaFunction = () => {
  return [
    {
      title: "Login in - Minimark",
    },
  ]
}

export default function Page() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center">
      <h1 className="mb-5 text-3xl font-bold">
        <Link to="/" prefetch="intent">
          Minimark
        </Link>
      </h1>
      <LoginForm />
    </div>
  )
}
