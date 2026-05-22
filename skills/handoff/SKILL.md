---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up. Output as markdown in the chat response so it can be copied and pasted elsewhere.
argument-hint: "What will the next session be used for?"
---

Write a handoff document summarising the current conversation so a fresh agent can continue the work.

## Output

Emit the document directly in the chat response as a single markdown block, ready to copy and paste into another tool. Do not save it to a file, the workspace, or the OS temporary directory.

## What's in main vs. what's local

Only reference artifacts by path or URL when they exist on the default branch (`main` / `master`) of the remote. Treat anything else as not yet shared.

Before referencing any artifact, verify it is on `origin/<default>`:

- Uncommitted working-tree changes, untracked files, and stashes — inline the relevant contents in the handoff.
- Local commits not yet pushed — inline the diff or relevant excerpts.
- Commits pushed to a feature branch but not merged to main — inline the diff or relevant excerpts, and note the branch name.
- Draft PRs, draft issues, local scratch files — inline the relevant content.

Only file paths, commits, PRs, and issues that are reachable from `origin/<default>` may be referenced by path or URL alone. Everything else must be embedded directly in the handoff so the next agent has full context without needing access to local state.

## Required sections

- **Goal** — what the next session is meant to accomplish (use the user's arguments if provided).
- **Context** — background needed to continue, with inlined local content where required.
- **State** — what is done, what is in progress, what is blocked. Note the branch name and whether work is committed/pushed.
- **Next steps** — concrete actions for the successor agent.
- **Suggested skills** — skills the next agent should invoke.

## Content guidelines

- Do not duplicate content that is already on `main`. Reference it by path or URL.
- Redact sensitive information: API keys, passwords, tokens, personally identifiable information.
- If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.
- Keep it terse. Minimum tokens for the same meaning.
