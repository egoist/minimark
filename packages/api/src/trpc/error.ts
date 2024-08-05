import { TRPCError } from "@trpc/server"
import { TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc"

export class ServerError extends TRPCError {
  constructor(message: string, code?: TRPC_ERROR_CODE_KEY) {
    super({
      message,
      code: code || "INTERNAL_SERVER_ERROR",
    })
  }
}

export const unauthorized = () =>
  new ServerError("unauthorized", "UNAUTHORIZED")
