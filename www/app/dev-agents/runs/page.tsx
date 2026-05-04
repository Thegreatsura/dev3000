import type { Route } from "next"
import { notFound, redirect } from "next/navigation"
import { DevAgentsDashboardShell } from "@/components/dev-agents/dashboard-shell"
import { getCurrentUser } from "@/lib/auth"
import { getSignInPath } from "@/lib/auth-redirect"
import { getDefaultDevAgentsRouteContext } from "@/lib/dev-agents-route"
import { listWorkflowRuns } from "@/lib/workflow-storage"
import DevAgentRunsClient from "./runs-client"

export default async function DevAgentRunsPage() {
  return <WorkflowRunsPage routeKind="dev-agent" />
}

export async function WorkflowRunsPage({ routeKind }: { routeKind: "dev-agent" | "skill-runner" }) {
  const user = await getCurrentUser()
  const runsHref = routeKind === "skill-runner" ? "/skill-runner/runs" : "/dev-agents/runs"

  if (!user) {
    redirect(getSignInPath(runsHref))
  }

  const [runs, routeContext] = await Promise.all([listWorkflowRuns(user.id), getDefaultDevAgentsRouteContext()])

  if (!routeContext.selectedTeam) {
    if (routeContext.defaultTeam) {
      redirect(
        `/${routeContext.defaultTeam.slug}/${routeKind === "skill-runner" ? "skill-runner" : "dev-agents"}/runs` as Route
      )
    }
    notFound()
  }

  return (
    <DevAgentsDashboardShell
      teams={routeContext.teams}
      selectedTeam={routeContext.selectedTeam}
      section="runs"
      runsHref={runsHref}
    >
      <DevAgentRunsClient userId={user.id} initialRuns={runs} />
    </DevAgentsDashboardShell>
  )
}
