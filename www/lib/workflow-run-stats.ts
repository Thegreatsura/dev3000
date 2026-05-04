import type { DevAgent } from "@/lib/dev-agents"
import type { WorkflowRun } from "@/lib/workflow-storage"

export interface WorkflowRunStatsSummary {
  runCount: number
  avgCost?: string
}

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

function isWorkflowRunForDevAgent(run: WorkflowRun, devAgent: Pick<DevAgent, "id" | "name" | "legacyWorkflowType">) {
  if (run.devAgentId === devAgent.id) {
    return true
  }

  if (devAgent.legacyWorkflowType && run.type === devAgent.legacyWorkflowType) {
    return true
  }

  return Boolean(run.devAgentName && run.devAgentName === devAgent.name)
}

export function summarizeWorkflowRunsForDevAgent(
  runs: WorkflowRun[],
  devAgent: Pick<DevAgent, "id" | "name" | "legacyWorkflowType">
): WorkflowRunStatsSummary {
  const matchingRuns = runs.filter((run) => isWorkflowRunForDevAgent(run, devAgent))
  const costs = matchingRuns
    .map((run) => run.costUsd)
    .filter((cost): cost is number => typeof cost === "number" && Number.isFinite(cost) && cost > 0)

  const avgCost =
    costs.length > 0 ? formatUsd(costs.reduce((total, cost) => total + cost, 0) / costs.length) : undefined

  return {
    runCount: matchingRuns.length,
    avgCost
  }
}
