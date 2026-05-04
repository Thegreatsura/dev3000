import type { Route } from "next"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default function TeamSkillRunnerRunsPage() {
  redirect("/skill-runner/runs" as Route)
}
