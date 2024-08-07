import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  httpLink,
  loggerLink,
  splitLink,
  unstable_httpBatchStreamLink,
} from "@trpc/client"
import { createTRPCReact, createTRPCQueryUtils } from "@trpc/react-query"
import SuperJSON from "superjson"
import { type AppRouter } from "@workspace/api"
import { CreateQueryUtils } from "@trpc/react-query/shared"

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000, // to prevent fetching ssr queries again
        retry: false,
      },
    },
  })

let clientQueryClientSingleton: QueryClient | undefined
const getQueryClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createQueryClient()
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= createQueryClient())
}

const createTrpcClient = () => {
  return trpcReact.createClient({
    links: [
      loggerLink({
        enabled: (op) =>
          import.meta.env.DEV ||
          (op.direction === "down" && op.result instanceof Error),
      }),

      splitLink({
        condition: () => {
          // return op.type === "query" && import.meta.env.PROD
          return false
        },
        true: unstable_httpBatchStreamLink({
          transformer: SuperJSON,
          url: "/api/trpc",
          headers: () => {
            const headers = new Headers()
            return headers
          },
        }),
        false: httpLink({
          transformer: SuperJSON,
          url: "/api/trpc",
          headers: () => {
            const headers = new Headers()
            return headers
          },
        }),
      }),
    ],
  })
}

let trpcClientSingleton: ReturnType<typeof trpcReact.createClient> | undefined
export const getTrpcClient = () => {
  if (typeof window !== "undefined") return createTrpcClient()
  return (trpcClientSingleton ??= createTrpcClient())
}

export const trpcReact = createTRPCReact<AppRouter>()

let trpcQueryUtilsSingleton: CreateQueryUtils<AppRouter> | undefined
export const getTrpcQueryUtils = () => {
  return (trpcQueryUtilsSingleton ??= createTRPCQueryUtils({
    queryClient: getQueryClient(),
    client: getTrpcClient(),
  }))
}

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  const trpcClient = getTrpcClient()

  return (
    <QueryClientProvider client={queryClient}>
      <trpcReact.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </trpcReact.Provider>
    </QueryClientProvider>
  )
}
