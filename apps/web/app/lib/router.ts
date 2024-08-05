import { useSearchParams } from "@remix-run/react"

export const useRouteQuery = () => {
  const [searchParams] = useSearchParams()

  const query: Record<string, string | string[]> = {}

  for (const [key, value] of searchParams) {
    if (query[key] !== undefined) {
      query[key] = [value].concat(query[key])
    } else {
      query[key] = value
    }
  }

  return query
}

export const stringifyRouteQuery = (
  query: Record<string, string | string[]>
) => {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      for (const v of value) {
        searchParams.append(key, v)
      }
    } else {
      searchParams.set(key, value)
    }
  }

  const res = searchParams.toString()
  return res ? `?${res}` : ""
}
