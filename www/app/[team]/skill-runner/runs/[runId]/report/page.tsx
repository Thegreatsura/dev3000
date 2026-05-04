import { WorkflowReportRoute } from "@/app/dev-agents/runs/[id]/report/page"

export default async function TeamSkillRunnerRunReportPage({
  params
}: {
  params: Promise<{ team: string; runId: string }>
}) {
  const { team, runId } = await params

  return <WorkflowReportRoute params={Promise.resolve({ id: runId })} routeKind="skill-runner" teamSlug={team} />
}
