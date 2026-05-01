export const SKILL_RUNNER_WORKER_PROJECT_NAME = "d3k-skill-runner"
export const SKILL_RUNNER_WORKER_REPO = "vercel-labs/dev3000"
export const SKILL_RUNNER_WORKER_ROOT_DIRECTORY = "www"
export const SKILL_RUNNER_WORKER_MODE_ENV = "SKILL_RUNNER_WORKER_MODE"
export const SKILL_RUNNER_WORKER_SHELL_VERSION_ENV = "SKILL_RUNNER_WORKER_SHELL_VERSION"
export const SKILL_RUNNER_RUNTIME_MANIFEST_VERSION = "1"

export type SkillRunnerExecutionMode = "hosted" | "self-hosted"
export type SkillRunnerWorkerStatus = "unconfigured" | "provisioning" | "ready" | "error" | "outdated"

export interface SkillRunnerWorkerVersionPayload {
  workerMode: "control-plane" | "self-hosted-worker"
  workerShellVersion?: string
  workerBranch?: string
  runtimeManifestVersion: string
}

export interface SkillRunnerTeamSettings {
  executionMode: SkillRunnerExecutionMode
  workerBaseUrl?: string
  workerProjectId?: string
  workerStatus?: SkillRunnerWorkerStatus
}
