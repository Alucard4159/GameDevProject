---
inclusion: manual
description: Kiro vs Claude Code vs Cursor parity — what each tool can wire, per-tool hook mechanisms, and the permanent gaps. Installed by context-bootstrap; not a skill.
---

<!-- Installed steering, not a skill. Migrated from Context_Curation_Pack/CROSS_TOOL_COMPATIBILITY.md
     on 2026-08-21. `inclusion: manual` deliberately -- ~100 lines consulted only when
     changing IDE wiring or adding a tool. The hook-mechanism and gap analysis below is
     tool-level fact and survived the migration unchanged; the routing rows did not. -->

# Cross-tool parity

Kiro, Claude Code, and Cursor stay aligned using installed skills plus per-tool wiring.

**Skills are the portable core, and all three consume them natively.** Cursor added native Agent Skills support in version 2.4 (January 2026) — it discovers `SKILL.md` files from `.cursor/skills/`/`~/.cursor/skills/` (also `.agents/skills/`, and reads Claude/Codex skill directories for compatibility) using the same frontmatter shape Kiro and Claude Code use: `name`, `description` (the activation mechanism), `disable-model-invocation`. **Correction (2026-09-06 session, corrected same session):** an earlier pass through this file claimed Cursor had no native skill support and needed `plugin-export` to transform skills into `.mdc` rule files. That was checked against Cursor's own current documentation and was wrong — Cursor's skills model is not meaningfully different from Kiro's or Claude Code's. All three now deploy the same way: a directory junction from this repo's `<plugin>/skills/<name>/` into the tool's skill-discovery path (`deploy-kiro.ps1`, `deploy-cursor.ps1`, `deploy-claude.ps1` — one script per tool, same junction logic, different target directory).

**What's genuinely different across the three, and permanent:** Cursor's `.mdc` Rules (`.cursor/rules/`) are a separate component from Skills — always-on or glob-scoped guidance, roughly Cursor's equivalent of Kiro's `steering/`. Rules are not portable the way skills are; each tool's persistent-guidance mechanism (Kiro steering, Claude's `agent-routing.md`/`CLAUDE.md`, Cursor rules) still needs its own file, same as before. Hooks also differ per tool (see below) — that part of this file's analysis was correct and unaffected by the skills correction.

**Claude Code correction, found while fixing the above:** this file (and the consuming project's `CLAUDE.md`) previously assumed Claude Code was already reading this repo's skills "natively," with no deploy step. That was also never actually true for this repo — checked directly: no `.claude/skills/` in any consuming project, no `~/.claude/skills/`, no plugin-marketplace entry pointing here. `deploy-claude.ps1` closes that gap the same way `deploy-kiro.ps1` always has for Kiro.

**Project skills need the identical fix, one level down — found and closed 2026-09-06 (later, same session line of work).** Everything above is about *plugin* skills (deployed from this repo to the user's global `~/.kiro/skills/` etc.). A consuming project's own product-specific skills (its `skills/<name>/SKILL.md`, distinct from anything here) have the same discovery problem for the same reason: `skills/` at a project's repo root isn't a documented discovery path for any of the three tools either. `context-bootstrap` now installs `templates/project-skills/Setup-ProjectSkillDiscovery.ps1.txt`/`setup-project-skill-discovery.sh` (step 5a) — same junction logic as the plugin deploy scripts, run once per machine against the *project's* skill paths instead of the user's global ones. Before this fix, a project's own skills relied entirely on hand-maintained routing tables, with native discovery never actually engaged — this was caught on a consuming project specifically (a project bootstrapped before this fix existed) and then fixed at the template level so every future `context-bootstrap` run gets it by default.

## What bootstrap installs

| Capability | Kiro | Claude Code | Cursor |
|---|---|---|---|
| Skills | ✅ native, junction via `deploy-kiro.ps1` (`~/.kiro/skills/`) | ✅ native, junction via `deploy-claude.ps1` (`~/.claude/skills/`) | ✅ native (since 2.4), junction via `deploy-cursor.ps1` (`~/.cursor/skills/`) |
| Universal standards | `.kiro/steering/kiro-universal-standards.md` | `.claude/universal-standards.md` | `.cursor/rules/cursor-universal-standards.mdc` |
| Evidence-first | `.kiro/steering/kiro-evidence-first.md` | embedded in `.claude/agent-routing.md` | `.cursor/rules/cursor-evidence-first.mdc` |
| Deploy consent | `.kiro/steering/kiro-deploy-safety.md` | embedded in `.claude/agent-routing.md` | `.cursor/rules/cursor-deploy-explicit-consent.mdc` |
| Install consent | `.kiro/steering/kiro-workstation-consent.md` | embedded in `.claude/agent-routing.md` | `.cursor/rules/cursor-workstation-consent.mdc` |
| Routing | `.kiro/steering/kiro-context-agents-routing.md` | `.claude/agent-routing.md` | `.cursor/rules/context-agents-routing.mdc` |
| Session start | `.kiro/steering/kiro-session-start.md` | embedded in `.claude/agent-routing.md` | `.cursor/rules/cursor-session-start.mdc` |
| **Context closure** | `.kiro/hooks/context-closure-agentStop.kiro.hook` | `.claude/settings.json` + `.claude/hooks/context-closure-stop.py` | `.cursor/hooks.json` + `context-closure-stop.py` + `context-file-edit-check.py` |
| File-edit: context consistency | folded into the `agentStop` closure hook (see note) | `.claude/hooks/file-edit-check.py` (`PostToolUse` on Write\|Edit — AI writes only) | `.cursor/hooks/context-file-edit-check.py` (`afterFileEdit`, fire-and-forget) queues a notice; `context-closure-stop.py` (`stop`) reads and surfaces it — see "Correction" note below for why it's two hooks, not one |
| Per-turn routing pointer | ✅ `inclusion: always` steering (full content) | `.claude/hooks/routing-reminder.py` (`UserPromptSubmit` — pointer only) | ✅ `alwaysApply: true` MDC (full content) |
| Manual-only-skill routing sync (once per session) | `.kiro/hooks/plugin-routing-sync-sessionStart.json` (`SessionStart`) | `.claude/settings.json`'s `SessionStart` entry | `.cursor/hooks.json`'s `sessionStart` entry |

**Known Windows quirks with skill junctions** (not permanent gaps — active bugs as of this writing, tracked upstream, not something to work around in this repo): Cursor 2.4.x had a bug where junctioned/symlinked skills vanished from discovery after an IDE restart (fixed in 2.5). Claude Code currently has two open Windows issues — junctioned skills are missing from the desktop app's `/` command menu even though the agent resolves and uses them correctly (`anthropics/claude-code#68318`), and a skill junctioned in the current session can fail on its very first invocation immediately after session start, then work normally after any other tool call runs (`anthropics/claude-code#41177`). Both deploy scripts' headers document these; if a skill seems to half-work right after deploying, check there before assuming the junction failed.

**Note on the context-consistency row:** an earlier version used a dedicated Kiro `fileEdited` hook on `.context/*.md`. That hook was **deleted** — paired with the `agentStop` closure hook it formed a confirmed, uncapped re-trigger cycle. Both the consistency check and the `CONTEXT_INDEX.md` refresh now happen inside the `agentStop` hook instead of on every save.

**Retired rows.** The former `specialists-registry-sync` and `steering-registry-sync` hooks are gone with the registries they maintained — skills are discovered natively, so there is nothing to register. Do not re-add a registry hook.

Installed hook behaviour for a given project is recorded in `.context/CONTEXT_HOOKS.md`.

## Contract

Plain Markdown plus stdlib-only, read-only Python helpers in each skill's `scripts/`. Hooks fail open. No product names in templates. Secret-safe headers.

---

## Hook mechanism details

All three tools support automatic closure reminders. The mechanism differs.

### Kiro (reference — works reliably)

`.kiro/hooks/context-closure-agentStop.kiro.hook`

```json
{
  "enabled": true,
  "when": { "type": "agentStop" },
  "then": { "type": "askAgent", "prompt": "<closure instructions>" }
}
```

`askAgent` injects a follow-up prompt after stop. Most reliable of the three: native, and always fires on agent stop.

### Claude Code

`.claude/settings.json` + `.claude/hooks/context-closure-stop.py`

```json
{ "hooks": { "Stop": [{ "matcher": "", "hooks": [{ "type": "command", "command": "python", "args": [".claude/hooks/context-closure-stop.py"] }] }] } }
```

(Unix bootstrap uses `python3`. Claude Code does **not** use `-u` — that flag is Cursor-specific to work around a Windows stdout-capture issue.)

Reads JSON from stdout. `{ "decision": "block", "reason": "..." }` blocks the stop and injects the reason as a follow-up; `{}` lets the stop complete.

**`settings.json` belongs in `.claude/` (project-level), not `~/.claude/`.** User-level would apply the hook globally instead of scoping it to this repo.

### Cursor

`.cursor/hooks.json` + `.cursor/hooks/context-closure-stop.py`

```json
{ "hooks": { "stop": [{ "command": "python -u .cursor/hooks/context-closure-stop.py", "loop_limit": 1 }] } }
```

(Unix bootstrap uses `python3 -u`. The stop hook is Python-only — do not point Windows `stop` at PowerShell; Cursor often captures empty stdout for that path. `loop_limit: 1` plus a per-conversation cooldown stamp in the script — Cursor often leaves `loop_count` at 0, so do not rely on that alone.)

Reads `{ "followup_message": "..." }` from stdout. At `loop_count=0` the script returns the check prompt unconditionally (matching Kiro); at `loop_count>=1` it exits silently.

## Permanent gaps

Kiro is the reference implementation. These are tool limitations, **not backlog items**.

| Capability | Kiro | Claude Code | Cursor | Status |
|---|---|---|---|---|
| Native skills | ✅ | ✅ | ✅ (since 2.4) | Closed — all three deploy by junction |
| Unconditional check after every response | ✅ `agentStop` | ✅ `Stop` + `stop_hook_active` guard | ✅ stop hook `loop_count=0` | Closed |
| File-edit detection | ✅ folded into `agentStop` | ✅ `PostToolUse` on Write\|Edit | ✅ `afterFileEdit` (queue) + `stop` (surface) — see note | Closed, weaker: turn-end not instant |
| Per-turn rule injection | ✅ full content | ✅ pointer only | ✅ full content | Claude: partial |
| Per-turn hook for arbitrary reminders | ❌ no per-prompt hook | ✅ `UserPromptSubmit` | ❌ no per-prompt hook | Claude advantage |

### Cursor file-edit hook — correction (2026-09-06, later session)

**This was previously documented as a permanent gap ("Cursor's hook API supports `stop` and `start` lifecycle events only — no `fileEdited` or `PostToolUse` equivalent") — that claim was checked against Cursor's own current documentation and is wrong.** Cursor's `afterFileEdit` hook is real: "Fires after the Agent edits a file; useful for formatters or accounting of agent-written code" (confirmed directly, `cursor.com/docs/agent/hooks`). It's matched by tool type (`Write`, `TabWrite`, etc.) via its `matcher` field, and is listed as supported in cloud agents too. Its input payload is `{file_path, edits: [{old_string, new_string}]}` (confirmed via the third-party Cupcake reference doc, which enumerates exact per-hook fields).

**But it's a genuinely weaker mechanism than Claude Code's equivalent, not a like-for-like port.** `afterFileEdit` is confirmed **fire-and-forget** — its documented response is `{}`, with no `additional_context` or any other output field the way `postToolUse` has. So a Cursor `afterFileEdit` hook can *detect* a condition (e.g. "this file edit should have updated a sibling") but has **no way to inject that finding back into the conversation** the moment it fires. Claude Code's `file-edit-check.py` works specifically because `PostToolUse` supports `additional_context`; a literal Cursor port of that script would run, but its finding would go nowhere. The only Cursor hook confirmed able to inject something back into the conversation is `stop` (via `followup_message`), so a real Cursor implementation would need a two-hook design: `afterFileEdit` writes a flag/notice to a state file, and the existing `stop` hook (already installed, already checked every turn) reads it and surfaces it as part of its own `followup_message` — not a direct per-edit notice, but the closest equivalent achievable with documented Cursor hooks today.

**Built 2026-09-06 (later session, same session as this correction).** `context-file-edit-check.py` (Cursor's `afterFileEdit`) queues a notice to `.context/.cursor-file-edit-notices.json` when a project skill, `.context/*.md`, or canonical plugin content is edited — mirroring Claude Code's three detection branches (`file-edit-check.py`). Since `afterFileEdit` can't inject anything back into the conversation itself, the stop runner (`context-closure-stop.py`) reads and clears that file and prepends any queued notices to its own `followup_message`. This means a Cursor file-edit notice surfaces at the **end of the current turn**, not the instant of the edit — a real, permanent difference from Claude Code's inline `PostToolUse` notice, not a temporary gap. Both hooks are wired into `hooks.windows.json`/`hooks.unix.json`'s `afterFileEdit`/`stop` entries and installed by `context-bootstrap` step 4c.

**Windows stop-stdout fix (2026-09-13):** Cursor on Windows often runs PowerShell-hosted `stop` hooks (exit 0) but records `OUTPUT: (empty)` and drops `followup_message`. Canonical Cursor `stop` now uses `python -u` / `python3 -u` `context-closure-stop.py` (flush + short delay, ASCII-safe JSON). Verified against Hooks Output on a consuming project before contributing back.

### Claude Code: pointer, not full re-injection

Kiro and Cursor inject full rule content every turn (`inclusion: always` / `alwaysApply: true`). Claude Code reads project context at session start only. `routing-reminder.py` fires on every prompt and emits a one-line pointer to `agent-routing.md` and `universal-standards.md`, keeping references visible under compression without re-injecting content.

The tradeoff cuts both ways: the model must still open the file for detail, but full re-injection costs 1000–3000+ tokens per prompt when several always-on steering files are active. The pointer approach is strictly cheaper on long sessions.

## Cursor's `.cursor/rules/` has no subfolder support

Unlike skills (junctioned as a whole directory, so this doesn't apply to them), Cursor Rules must sit flat in `.cursor/rules/` — a rule at `.cursor/rules/some-folder/file.mdc` is silently ignored, confirmed against Cursor's own documentation and forum. This matters for any project's own hand-maintained `.mdc` rules (like the consuming project's `project-*.mdc` files), not for skills.

## Adding a new tool

1. Create `context/skills/context-bootstrap/templates/ide-wiring/<tool>/`.
2. Write `deploy-<tool>.ps1` and `deploy-<tool>.sh` if the tool discovers skills from a filesystem directory by junction/symlink (true for every tool encountered so far) — dot-source `deploy-common.ps1` and source `deploy-common.sh`, then call the shared deploy helpers with the new tool's target directory and label, mirroring the thin wrapper shape used by the existing tools. Don't reimplement the junction/list/remove logic per tool — that's exactly the drift `deploy-common.ps1` / `deploy-common.sh` exist to prevent (see their own headers, and `plugin/SUGGESTIONS.md` S-019).
3. Wire the closure hook using that tool's mechanism.
4. Add the tool's column to the tables above.

## Related

- `cross-os-compatibility.md` — Windows vs macOS/Linux parity
- `context-bootstrap` — installs the wiring described here
- `../../deploy-kiro.ps1`, `../../deploy-cursor.ps1`, `../../deploy-claude.ps1` — the three thin per-tool wrappers (target directory, tool label, tool-specific post-deploy note)
- `../../deploy-kiro.sh`, `../../deploy-cursor.sh`, `../../deploy-claude.sh` — the Unix wrappers that share the same behavior on macOS/Linux
- `../../deploy-common.ps1`, `../../deploy-common.sh` — the shared junction/list/remove logic all three wrappers call, so the logic itself can't drift between tools the way the header comments legitimately do
