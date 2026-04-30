import { readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"

const WORKFLOW_MAX_DURATION_SECONDS = 800

const configPaths = [
  join(process.cwd(), "app/.well-known/workflow/v1/config.json"),
  join(process.cwd(), ".next/server/app/.well-known/workflow/v1/config.json")
]

async function patchConfig(configPath) {
  let parsed
  try {
    parsed = JSON.parse(await readFile(configPath, "utf8"))
  } catch (error) {
    if (error?.code === "ENOENT") return false
    throw error
  }

  let changed = false
  for (const key of ["steps", "workflows"]) {
    if (parsed?.[key]?.maxDuration === "max") {
      parsed[key].maxDuration = WORKFLOW_MAX_DURATION_SECONDS
      changed = true
    }

    const triggers = parsed?.[key]?.experimentalTriggers
    if (Array.isArray(triggers)) {
      for (const trigger of triggers) {
        if (trigger?.type === "queue/v2beta") {
          trigger.type = "queue/v1beta"
          changed = true
        }
      }
    }
  }

  if (!changed) return false

  await writeFile(configPath, `${JSON.stringify(parsed, null, 2)}\n`)
  return true
}

const patched = []
for (const configPath of configPaths) {
  if (await patchConfig(configPath)) patched.push(configPath)
}

if (patched.length > 0) {
  console.log(
    `Patched Workflow maxDuration in ${patched.length} generated config file${patched.length === 1 ? "" : "s"}.`
  )
}
