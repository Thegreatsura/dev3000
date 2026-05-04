import type { Route } from "next"
import { redirect } from "next/navigation"
import { connection } from "next/server"

export default async function TeamDevAgentRunsPage() {
  await connection()
  redirect("/dev-agents/runs" as Route)
}
