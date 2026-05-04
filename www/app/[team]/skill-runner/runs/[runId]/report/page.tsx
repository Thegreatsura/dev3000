import type { Route } from "next"
import { redirect } from "next/navigation"
import { connection } from "next/server"

export default async function TeamSkillRunnerRunReportPage({
  params
}: {
  params: Promise<{ team: string; runId: string }>
}) {
  await connection()
  const { runId } = await params
  redirect(`/skill-runner/runs/${runId}/report` as Route)
}
