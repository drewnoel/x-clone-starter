#!/usr/bin/env node
"use strict"

// SessionStart hook: injects the current git branch, uncommitted file count,
// and last 3 commits as additional context at the start of each session.
// Cross-platform: uses execFileSync (no shell) so it works the same on
// macOS, Linux, and Windows as long as `git` is on PATH.

const { execFileSync } = require("child_process")

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

function git(args, cwd) {
  return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim()
}

function buildContext(cwd) {
  const branch = git(["rev-parse", "--abbrev-ref", "HEAD"], cwd)

  const statusOutput = git(["status", "--porcelain"], cwd)
  const uncommittedCount = statusOutput === "" ? 0 : statusOutput.split("\n").length

  const log = git(["log", "-3", "--oneline"], cwd)
  const commits = log === "" ? "(no commits yet)" : log

  return [
    "Git context:",
    `- Branch: ${branch}`,
    `- Uncommitted files: ${uncommittedCount}`,
    "- Last 3 commits:",
    commits
      .split("\n")
      .map((line) => `  ${line}`)
      .join("\n"),
  ].join("\n")
}

async function main() {
  let payload = {}
  try {
    const raw = await readStdin()
    payload = raw ? JSON.parse(raw) : {}
  } catch {
    payload = {}
  }

  const cwd = payload.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd()

  let additionalContext
  try {
    additionalContext = buildContext(cwd)
  } catch {
    // Not a git repo, git not installed, or some other failure — say
    // nothing rather than breaking session start.
    process.exit(0)
    return
  }

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "SessionStart",
        additionalContext,
      },
    }),
  )
  process.exit(0)
}

main()
