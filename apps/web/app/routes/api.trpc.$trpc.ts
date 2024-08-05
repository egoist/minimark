import { LoaderFunctionArgs } from "@remix-run/node"
import { createHandler } from "@workspace/api"

export const loader = (args: LoaderFunctionArgs) => {
  return createHandler({
    request: args.request,
  })
}

export const action = loader
