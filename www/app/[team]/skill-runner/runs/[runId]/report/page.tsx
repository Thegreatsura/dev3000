import type { Route } from "next"
import { redirect } from "next/navigation"

export default async function TeamSkillRunnerRunReportPage({
  params
}: {
  params: Promise<{ team: string; runId: string }>
}) {
  const { runId } = await params
  redirect(`/skill-runner/runs/${runId}/report` as Route)
}
