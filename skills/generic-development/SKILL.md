---
name: generic-development
description: Common development conventions for agents working in personal repositories. Apply whenever authoring code, commits, or pull requests.
---

# Generic development conventions

Baseline rules that apply across all repositories, regardless of language, framework, or tooling. More specific repo-level instructions may override individual points, but these defaults hold otherwise.

## Attribution

All work is attributed to the human. Do not add AI/agent attribution anywhere:

- No "Co-Authored-By", "Generated with", or similar trailers in commit messages.
- No AI attribution in PR titles, descriptions, code comments, or docs.
- No session URLs or tool-identifying footers in committed artifacts.

The human is the author of every commit and PR.

## Commits

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <short summary>

<optional body>

<optional footer>
```

Common types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `perf`, `build`, `ci`, `style`.

- Summary in the imperative mood, lower case, no trailing period.
- Use a scope when it adds clarity (e.g. `feat(auth): ...`).
- Use `!` or a `BREAKING CHANGE:` footer for breaking changes.

One concern per commit. Do not mix unrelated changes (e.g. a fix plus a drive-by refactor) into a single commit.

## Pull requests

PR titles follow the same Conventional Commits format as commit summaries.

One concern per PR. Keep PRs small and focused so they can be reviewed in one sitting.

PR body conventions: _to be defined._

## Branch & push hygiene

- Work on feature branches; never commit directly to `main` / `master` / the default branch.
- Never force-push without explicit permission from the human. Never force-push to shared branches.
- Do not skip safety nets: no `--no-verify`, no bypassing pre-commit / pre-push hooks, no disabling signing, no turning off tests to make CI pass.
- If a hook or check fails, fix the underlying cause.

## Secrets and sensitive files

- Never commit secrets, credentials, tokens, API keys, private keys, or environment files containing them.
- Stage files explicitly by name. Avoid blanket commands like `git add -A` or `git add .` that can sweep in unintended files.
- If a secret is committed by mistake, stop and surface it to the human immediately rather than silently rewriting history.

## Root causes, not symptoms

- Fix the underlying problem, not the visible symptom. Don't suppress, swallow, or hide errors to make them go away.
- Don't loosen assertions, weaken tests, or relax type/lint rules just to get a green build.
- If the root cause is out of scope, say so explicitly instead of patching around it.

## Dependencies

- Do not add new dependencies casually. Prefer what's already in the project, and what's built into the language/runtime.
- When a new dependency is genuinely needed, surface it to the human (what it is, why, alternatives considered) before adding it.
- Keep lockfiles / manifests consistent with the change.

## Comments

- Keep comments minimal and high-signal.
- Write a comment when the code's purpose, intent, or reasoning is not obvious from reading it — including a brief description of *why* something is done, a non-obvious constraint, an invariant, a workaround, or surprising behavior.
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
