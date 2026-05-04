import { WorkflowRunsPage } from "@/app/dev-agents/runs/page"

export default async function TeamDevAgentRunsPage({ params }: { params: Promise<{ team: string }> }) {
  const { team } = await params
  return <WorkflowRunsPage routeKind="dev-agent" teamSlug={team} />
}
