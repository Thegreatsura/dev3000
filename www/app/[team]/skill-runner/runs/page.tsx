import { WorkflowRunsPage } from "@/app/dev-agents/runs/page"

export default async function TeamSkillRunnerRunsPage({ params }: { params: Promise<{ team: string }> }) {
  const { team } = await params
  return <WorkflowRunsPage routeKind="skill-runner" teamSlug={team} />
}
