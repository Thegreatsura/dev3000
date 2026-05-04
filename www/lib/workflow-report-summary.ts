import type { WorkflowReport } from "@/types"

export function getFinalSummaryMarkdown(agentAnalysis?: string) {
  if (!agentAnalysis) return ""

  const legacyFinalOutputMatch = agentAnalysis.match(/## Final Output\s+([\s\S]*)$/)
  if (legacyFinalOutputMatch?.[1]?.trim()) {
    return legacyFinalOutputMatch[1].trim()
  }

  const transcriptFinalSummaryMatch = agentAnalysis.match(
    /### Final summary\s+\*\*User:\*\*[\s\S]*?\*\*Claude:\*\*\n([\s\S]*?)\n\*\*Result JSON:\*\*/i
  )

  return transcriptFinalSummaryMatch?.[1]?.trim() || ""
}

export function extractAshFinalMessage(agentAnalysis?: string): string {
  if (!agentAnalysis) return ""

  const markerIndex = agentAnalysis.indexOf("**Stream Events:**")
  if (markerIndex === -1) return ""

  const fenceIndex = agentAnalysis.indexOf("```ndjson", markerIndex)
  if (fenceIndex === -1) return ""

  const ndjsonStart = agentAnalysis.indexOf("\n", fenceIndex)
  if (ndjsonStart === -1) return ""

  let finalMessage = ""
  for (const line of agentAnalysis.slice(ndjsonStart + 1).split("\n")) {
    const trimmed = line.trim()
    if (trimmed === "```") break
    if (!trimmed) continue

    try {
      const event = JSON.parse(trimmed) as {
        type?: string
        data?: {
          finishReason?: string
          message?: string
        }
      }
      if (
        event.type === "message.completed" &&
        event.data?.finishReason === "stop" &&
        typeof event.data.message === "string"
      ) {
        finalMessage = event.data.message.trim()
      }
    } catch {
      // Ignore non-JSON transcript lines.
    }
  }

  return finalMessage
}

export function getGeneratedReportMarkdown(report: WorkflowReport): string {
  const storedReport = report.generatedReportMarkdown?.trim()
  if (storedReport) return storedReport

  if (report.workflowType === "deepsec-security-scan") {
    return extractAshFinalMessage(report.agentAnalysis) || getFinalSummaryMarkdown(report.agentAnalysis)
  }

  return ""
}

export function getGeneratedReportCostUsd(markdown: string): number | null {
  const contentWithoutCode = markdown.replace(/```[\s\S]*?```/g, "")

  for (const rawLine of contentWithoutCode.split("\n")) {
    const line = rawLine
      .replace(/^[-*]\s+/, "")
      .replace(/\*\*/g, "")
      .trim()
    const match = line.match(/^Cost:\s*(.+)$/i)
    if (!match) continue

    const costMatch = match[1].match(/~?\$([\d,]+(?:\.\d+)?)/)
    if (!costMatch) return null

    const amount = Number(costMatch[1].replace(/,/g, ""))
    return Number.isFinite(amount) ? amount : null
  }

  return null
}

export function getWorkflowReportCostUsd(report: WorkflowReport): number | undefined {
  const generatedCost = getGeneratedReportCostUsd(getGeneratedReportMarkdown(report))
  if (typeof generatedCost === "number" && Number.isFinite(generatedCost) && generatedCost > 0) {
    return generatedCost
  }

  if (typeof report.costUsd === "number" && Number.isFinite(report.costUsd) && report.costUsd > 0) {
    return report.costUsd
  }

  return undefined
}
