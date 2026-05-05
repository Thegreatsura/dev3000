import { HOSTED_SKILL_RUNNER_TEAM_IDS } from "@/lib/skill-runner-config"

const HOSTED_SKILL_RUNNER_TEAM_ID_SET = new Set<string>(HOSTED_SKILL_RUNNER_TEAM_IDS)

function decodeJwtPayload(token: string | undefined): Record<string, unknown> | null {
  const [, payload] = token?.split(".") || []
  if (!payload) return null

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Record<string, unknown>
  } catch {
    return null
  }
}

export function isHostedSkillRunnerTeamId(teamId: string | null | undefined): boolean {
  const trimmed = teamId?.trim()
  return Boolean(trimmed && HOSTED_SKILL_RUNNER_TEAM_ID_SET.has(trimmed))
}

export function getCurrentVercelTeamId(): string | undefined {
  const systemTeamId = process.env.VERCEL_ORG_ID?.trim() || process.env.VERCEL_TEAM_ID?.trim()
  if (systemTeamId) return systemTeamId

  const oidcOwner = decodeJwtPayload(process.env.VERCEL_OIDC_TOKEN)?.owner
  return typeof oidcOwner === "string" && oidcOwner.trim() ? oidcOwner.trim() : undefined
}

export function isSelfHostedSkillRunnerRuntime(): boolean {
  const teamId = getCurrentVercelTeamId()
  if (!teamId) return process.env.VERCEL === "1"
  return !isHostedSkillRunnerTeamId(teamId)
}
