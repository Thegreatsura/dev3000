import { generateMetadata, WorkflowReportRoute } from "@/app/dev-agents/runs/[id]/report/page"

export { generateMetadata }

export default function SkillRunnerWorkflowReportPage({ params }: { params: Promise<{ id: string }> }) {
  return <WorkflowReportRoute params={params} routeKind="skill-runner" />
}
