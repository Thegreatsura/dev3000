import type { Route } from "next"
import { redirect } from "next/navigation"

export default function TeamSkillRunnerRunsPage() {
  redirect("/skill-runner/runs" as Route)
}
