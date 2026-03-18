import { auth } from "../../../auth"

export default defineEventHandler(async (event) => {
  const origin = getHeader(event, "origin")
  if (origin && (origin.includes("127.0.0.1") || origin.includes("localhost"))) {
    setHeaders(event, {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true"
    })
  }

  if (event.method === "OPTIONS") {
    return null
  }

  return auth.handler(toWebRequest(event))
})
