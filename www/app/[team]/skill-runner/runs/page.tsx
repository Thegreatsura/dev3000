import type { Route } from "next"
import { redirect } from "next/navigation"
import { connection } from "next/server"

export default async function TeamSkillRunnerRunsPage() {
  await connection()
  redirect("/skill-runner/runs" as Route)
}
