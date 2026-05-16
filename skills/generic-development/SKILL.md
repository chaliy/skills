---
name: generic-development
description: Common development conventions for agents working in any repository. Apply whenever authoring code, commits, or pull requests.
---

# Generic development conventions

Baseline rules that apply in any repository, regardless of language, framework, or tooling. Repo-level instructions may override individual points; otherwise these defaults hold.

## Style

- Terse. Drop filler. Minimum tokens for the same meaning.
- Prefer reading more code over guessing. If still stuck, ask with short concrete options.
- Unrecognized changes in the working tree: assume another agent or the human made them — keep going. Only stop and ask if continuing would cause issues.

## Branch base

- Always work on top of the latest default branch (`main` / `master`) from the remote.
- Sync before starting and before shipping: `git fetch origin <default>` then branch or rebase from `origin/<default>`.
- In worktrees and detached states, verify the branch (`git status --branch`, `git worktree list`) — do not assume `HEAD` tracks a branch.

## Attribution

All work is attributed to the real human user, never to an agent or bot.

- Git identity (`user.name`, `user.email`) must resolve to a real human. If the current identity is missing or agent-like, stop and ask — do not commit with a default or bot identity.
- Never set `GIT_AUTHOR_NAME`, `GIT_COMMITTER_NAME`, or `user.name` to an AI/bot identity ("Claude", "Cursor", "Copilot", "github-actions[bot]", and similar).
- No `Co-authored-by` trailers referencing AI tools.
- No "Generated with", "Authored by AI", agent session URLs, or similar attribution in commit messages, PR titles, PR bodies, code comments, or docs.
- Merge commits must also be authored by the real human.

## Commits

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): description`.

Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`, `build`, `ci`, `style`.

- Imperative mood, lower case, no trailing period.
- Use a scope when it adds clarity.
- Use `!` or a `BREAKING CHANGE:` footer for breaking changes.
- Use `chore` for repo meta updates (docs about the repo itself, `AGENTS.md`, configuration housekeeping).

One concern per commit. Do not mix unrelated changes (e.g. a fix plus a drive-by refactor) into a single commit.

## Pull requests

- PR titles follow the same Conventional Commits format as commit summaries, kept under 70 characters.
- One concern per PR. Small, incremental, reviewable in one sitting.
- Use the repo's PR template if one exists (e.g. `.github/pull_request_template.md`).
- Prefer **Squash and Merge** unless the repo specifies otherwise.
- Never merge when CI is red. No exceptions.
- Address every review comment before merging; merge only after CI is green.

## Branch & push hygiene

- Work on feature branches; never commit directly to the default branch.
- Never force-push without explicit permission from the human. Never force-push to shared branches.
- Do not skip safety nets: no `--no-verify`, no bypassing pre-commit / pre-push hooks, no disabling signing, no turning off tests to make CI pass.
- Run the repo's local pre-push / quality checks before `git push` if any exist (e.g. `just pre-push`, `npm run lint`, `make check`).
- If a hook or check fails, fix the underlying cause.

## Secrets and sensitive files

- Never commit secrets, credentials, tokens, API keys, private keys, or environment files containing them.
- Stage files explicitly by name. Avoid blanket commands like `git add -A` or `git add .` that can sweep in unintended files.
- If a secret is committed by mistake, stop and surface it to the human immediately rather than silently rewriting history.

## Root causes, not symptoms

- Fix the underlying problem, not the visible symptom. Don't suppress, swallow, or hide errors to make them go away.
- Don't loosen assertions, weaken tests, or relax type/lint rules just to get a green build.
- For bug fixes, write a failing test that reproduces the bug before fixing it.
- If the root cause is out of scope, say so explicitly instead of patching around it.

## Dependencies

- Do not add new dependencies casually. Prefer what's already in the project, and what's built into the language/runtime.
- When a new dependency is genuinely needed, surface it to the human (what it is, why, alternatives considered) before adding it.
- Keep lockfiles / manifests consistent with the change.

## Comments

- Keep comments minimal and high-signal.
- Write a comment when the code's purpose, intent, or reasoning is not obvious from reading it — including a brief description of *why* something is done, a non-obvious constraint, an invariant, a workaround, or surprising behavior.
- Document important design decisions as comments near the code that implements them (e.g. top of the file or near the relevant function).
- Do not narrate *what* the code does when well-named identifiers already make it clear.
- Do not include task context, ticket numbers, PR references, "added for X", or "used by Y" — that belongs in commit messages and PR descriptions.

## No speculative code

- Don't add error handling, fallbacks, or validation for cases that cannot happen. Validate at real system boundaries only.
- Don't introduce feature flags, abstractions, or extension points for hypothetical future needs.
- Don't leave half-finished scaffolding, stubbed functions, or `TODO` placeholders unless the human asked for them.

## Respect existing patterns

- Match the surrounding code's style, structure, and conventions before introducing new ones.
- If existing patterns seem wrong, raise it with the human instead of silently doing it differently in new code.
- Reuse existing helpers, utilities, and modules rather than reimplementing them.

## Destructive and shared-state actions

Confirm with the human before taking actions that are hard to reverse or visible to others, including but not limited to:

- Deleting files, branches, tags, releases.
- Resetting, rebasing published history, force-pushing.
- Dropping, truncating, or migrating data.
- Posting to issues, PRs, chat, email, or any external service.
- Changing CI/CD pipelines, permissions, or shared infrastructure.

When in doubt, ask first.
