import type { Route } from "next"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default function TeamDevAgentRunsPage() {
  redirect("/dev-agents/runs" as Route)
}
