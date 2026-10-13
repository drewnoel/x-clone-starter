#!/usr/bin/env node
"use strict"

// PreToolUse hook: blocks Claude from reading secret .env files (.env,
// .env.local, .env.production, ...) while still allowing .env.example.
// Fails open on anything unexpected so it never breaks an unrelated tool call.

const ENV_FILE_RE = /^\.env(\.[^/\\]+)?$/i
const ENV_TOKEN_RE =
  /(?:^|[\s'"=/\\<>|;&(:])(\.env(?:\.[\w.-]+)?)(?=$|[\s'"<>|;&)])/gi

function isSecretBasename(basename) {
  if (!basename) return false
  const lower = basename.toLowerCase()
  if (lower === ".env.example") return false
  return ENV_FILE_RE.test(lower)
}

function basenameFromPath(p) {
  if (!p || typeof p !== "string") return null
  const normalized = p.replace(/\\/g, "/")
  const parts = normalized.split("/")
  return parts[parts.length - 1] || null
}

function pathDenyReason(p) {
  const basename = basenameFromPath(p)
  if (!isSecretBasename(basename)) return null
  return `Blocked: "${basename}" is a secret env file and must not be read. Use .env.example to see which variables exist, or ask the user for a specific non-secret value.`
}

function commandDenyReason(command) {
  if (!command || typeof command !== "string") return null
  const matches = command.matchAll(ENV_TOKEN_RE)
  for (const match of matches) {
    const token = match[1]
    const basename = basenameFromPath(token)
    if (isSecretBasename(basename)) {
      return `Blocked: this command references "${basename}", a secret env file, and must not be run. Use .env.example to see which variables exist, or ask the user for a specific non-secret value.`
    }
  }
  return null
}

function denyReasonFor(payload) {
  const toolName = payload.tool_name
  const input = payload.tool_input || {}

  switch (toolName) {
    case "Read":
    case "Edit":
    case "MultiEdit":
    case "NotebookEdit":
      return pathDenyReason(input.file_path)
    case "Grep":
      return pathDenyReason(input.path) || pathDenyReason(input.glob)
    case "Bash":
      return commandDenyReason(input.command)
    default:
      return null
  }
}

function readStdin() {
  return new Promise((resolve) => {
    let data = ""
    process.stdin.setEncoding("utf8")
    process.stdin.on("data", (chunk) => {
      data += chunk
    })
    process.stdin.on("end", () => resolve(data))
    process.stdin.on("error", () => resolve(data))
  })
}

async function main() {
  let payload
  try {
    const raw = await readStdin()
    payload = JSON.parse(raw)
  } catch {
    process.exit(0)
    return
  }

  let reason
  try {
    reason = denyReasonFor(payload)
  } catch {
    process.exit(0)
    return
  }

  if (reason) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: reason,
        },
      }),
    )
  }

  process.exit(0)
}

main()
