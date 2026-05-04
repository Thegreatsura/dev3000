import type { Route } from "next"
import { notFound, redirect } from "next/navigation"
import { DevAgentsDashboardShell } from "@/components/dev-agents/dashboard-shell"
import { getCurrentUser } from "@/lib/auth"
import { getSignInPath } from "@/lib/auth-redirect"
import { getDefaultDevAgentsRouteContext, getDevAgentsRouteContext } from "@/lib/dev-agents-route"
import { listWorkflowRuns } from "@/lib/workflow-storage"
import DevAgentRunsClient from "./runs-client"

type RunsRouteKind = "dev-agent" | "skill-runner"

function getRunsPath(routeKind: RunsRouteKind, teamSlug?: string): string {
  const section = routeKind === "skill-runner" ? "skill-runner" : "dev-agents"
  return teamSlug ? `/${teamSlug}/${section}/runs` : `/${section}/runs`
}

export default async function DevAgentRunsPage() {
  return <WorkflowRunsPage routeKind="dev-agent" />
}

export async function WorkflowRunsPage({ routeKind, teamSlug }: { routeKind: RunsRouteKind; teamSlug?: string }) {
  const user = await getCurrentUser()
  const requestedRunsHref = getRunsPath(routeKind, teamSlug)

  if (!user) {
    redirect(getSignInPath(requestedRunsHref))
  }

  const [runs, routeContext] = await Promise.all([
    listWorkflowRuns(user.id),
    teamSlug ? getDevAgentsRouteContext(teamSlug) : getDefaultDevAgentsRouteContext()
  ])

  if (!routeContext.selectedTeam) {
    if (routeContext.defaultTeam) {
      redirect(
        `/${routeContext.defaultTeam.slug}/${routeKind === "skill-runner" ? "skill-runner" : "dev-agents"}/runs` as Route
      )
    }
    notFound()
  }

  const runsHref = getRunsPath(routeKind, teamSlug ? routeContext.selectedTeam.slug : undefined)

  return (
    <DevAgentsDashboardShell
      teams={routeContext.teams}
      selectedTeam={routeContext.selectedTeam}
      section="runs"
      runsHref={runsHref}
    >
      <DevAgentRunsClient
        userId={user.id}
        initialRuns={runs}
        teamSlug={teamSlug ? routeContext.selectedTeam.slug : undefined}
      />
    </DevAgentsDashboardShell>
  )
}
