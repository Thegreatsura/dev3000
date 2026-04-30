import { readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"

const MAX_DURATION_SECONDS = {
  steps: 800,
  workflows: 60
}

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
  for (const key of Object.keys(MAX_DURATION_SECONDS)) {
    if (parsed?.[key]?.maxDuration === "max") {
      parsed[key].maxDuration = MAX_DURATION_SECONDS[key]
      changed = true
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
