# skills

Personal Claude Code skills.

## Adding a new skill

Each skill lives in its own folder under `skills/`:

```
skills/
  <skill-name>/
    SKILL.md
```

`SKILL.md` starts with YAML frontmatter, followed by the skill body:

```markdown
---
name: skill-name
description: When to use this skill (one or two sentences).
---

Instructions for the skill go here.
```

Guidelines:
- `name` must match the folder name (kebab-case).
- `description` should make it obvious when the skill applies.
- Keep the body focused — instructions, not narration.
- Add supporting files (scripts, templates) next to `SKILL.md` in the same folder.
