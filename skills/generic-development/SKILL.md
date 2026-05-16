---
name: generic-development
description: Common development conventions for agents working in personal repositories. Apply whenever authoring code, commits, or pull requests.
---

# Generic development conventions

Baseline rules that apply across all repositories. More specific repo-level instructions may override individual points, but these defaults hold otherwise.

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

## Pull requests

PR titles follow the same Conventional Commits format as commit summaries.

PR body conventions: _to be defined._
