#!/usr/bin/env node
"use strict"

// PreToolUse hook: blocks Claude from directly editing lockfiles and
// generated files (pnpm-lock.yaml, routeTree.gen.ts). These are owned by
// pnpm / the TanStack Router plugin and should only change via running the
// real tooling (pnpm install, pnpm dev / pnpm build), never a hand edit.
// Fails open on anything unexpected so it never breaks an unrelated tool call.

const GUARDED_FILES = [
  { basename: "pnpm-lock.yaml", kind: "lockfile", regenerateWith: "pnpm install" },
  { basename: "routetree.gen.ts", kind: "generated file", regenerateWith: "pnpm dev or pnpm build" },
]

function basenameFromPath(p) {
  if (!p || typeof p !== "string") return null
  const normalized = p.replace(/\\/g, "/")
  const parts = normalized.split("/")
  return parts[parts.length - 1] || null
}

function guardedFileFor(p) {
  const basename = basenameFromPath(p)
  if (!basename) return null
  const lower = basename.toLowerCase()
  return GUARDED_FILES.find((f) => f.basename === lower) || null
}

function pathDenyReason(p) {
  const guarded = guardedFileFor(p)
  if (!guarded) return null
  const basename = basenameFromPath(p)
  return `Blocked: "${basename}" is a ${guarded.kind} and must not be hand-edited. Run ${guarded.regenerateWith} to regenerate it instead.`
}

function denyReasonFor(payload) {
  const toolName = payload.tool_name
  const input = payload.tool_input || {}

  switch (toolName) {
    case "Edit":
    case "MultiEdit":
    case "Write":
    case "NotebookEdit":
      return pathDenyReason(input.file_path)
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
