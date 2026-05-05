import { execFileSync } from "node:child_process"
import { SKILL_RUNNER_RUNTIME_MANIFEST_VERSION, type SkillRunnerWorkerVersionPayload } from "@/lib/skill-runner-config"
import { isSelfHostedSkillRunnerRuntime } from "@/lib/skill-runner-runtime"

function resolveCurrentGitBranch(): string | undefined {
  const envBranch = process.env.VERCEL_GIT_COMMIT_REF?.trim()
  if (envBranch) return envBranch

  try {
    const branch = execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim()
    return branch || undefined
  } catch {
    return undefined
  }
}

function resolveCurrentGitSha(): string | undefined {
  const envSha = process.env.VERCEL_GIT_COMMIT_SHA?.trim()
  if (envSha) return envSha

  try {
    const sha = execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim()
    return sha || undefined
  } catch {
    return undefined
  }
}

function resolveCurrentShellVersion(): string | undefined {
  return resolveCurrentGitSha()
}

export async function GET() {
  const payload: SkillRunnerWorkerVersionPayload = {
    workerMode: isSelfHostedSkillRunnerRuntime() ? "self-hosted-worker" : "control-plane",
    workerShellVersion: resolveCurrentShellVersion(),
    workerBranch: resolveCurrentGitBranch(),
    runtimeManifestVersion: SKILL_RUNNER_RUNTIME_MANIFEST_VERSION
  }

  return Response.json(payload, {
    headers: {
      "Cache-Control": "no-store, max-age=0"
    }
  })
}
