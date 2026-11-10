---
inclusion: manual
description: Windows/macOS/Linux parity rules for scripts, hooks, CI, and Docker. Installed into a project by context-bootstrap; not a skill. Read it when touching any of those.
---

<!-- Installed steering, not a skill. Migrated from Context_Curation_Pack/CROSS_OS_COMPATIBILITY.md
     on 2026-08-21. `inclusion: manual` deliberately: this is ~50 lines of reference
     consulted only when tooling changes, so always-on would tax every session for
     content most sessions never need. The skills that care read it by path --
     `context-closure`'s Cross-OS gate and `context-bootstrap`'s hook install. -->

# Cross-OS compatibility

Keep Windows, macOS, and Linux aligned using installed skills plus project-local code.

## What bootstrap installs

| Capability | Windows | macOS / Linux |
|---|---|---|
| Bootstrap | AI prompt (any tool) | AI prompt (any tool) |
| Cursor closure hook | `context-closure-stop.py` via `hooks.windows.json` (`python -u`) | `context-closure-stop.py` via `hooks.unix.json` (`python3 -u`) |
| Paths in substituted files | Forward slashes | Same |

The Python hook scripts are copied into every bootstrapped project; `hooks.json` selects the Python runner for the OS that ran bootstrap. Project-local hook paths and env vars live in `.context/CONTEXT_HOOKS.md`.

**Why Python for Cursor `stop` on Windows:** Cursor's PowerShell-hosted stop hooks often exit 0 with empty captured stdout, so `followup_message` never injects. Prefer `python -u` with flush + short delay; keep ASCII-safe JSON (`ensure_ascii=True`).


## Contract

- **Paths in docs:** forward slashes in shared examples unless a platform literal is intentional.
- **Commands:** give **Windows (PowerShell)** and **Unix (bash)** variants wherever copy-paste steps appear — in skills and in `.context/`.
- **Hooks:** changing Cursor closure behaviour requires updating **`context-closure-stop.py`** and the OS-specific hook JSON runner. On Windows, `hooks.json` must keep `python -u` for `stop` — do not regress to `powershell -File`.
- **Unix hook runtime:** `python3` for the Cursor stop runner; fail **open** if Python is missing — a closure reminder is not worth breaking the session over.
- **Line endings:** no CRLF-only shell scripts without a `.gitattributes` note.
- **Regex on CRLF:** `(?m)$` does not match before `\r`. A pattern like `^## Mission$` silently matches nothing on a CRLF file. Use `\r?$`.
- **PowerShell specifics:** `;` not `&&` as separator; `$env:TEMP` not `%TEMP%`, which PowerShell does not expand and will treat as a literal filename.
- **Writing UTF-8 without BOM:** `[System.IO.File]::WriteAllText($path, $text, (New-Object System.Text.UTF8Encoding $false))`. `Out-File` and `>` add a BOM that breaks frontmatter parsing.
- **Why `.ps1.txt`:** PowerShell scripts ship with a `.txt` suffix and are renamed on install, because a bare `.ps1` in a transferred archive trips execution-policy and mail/AV filters.

## For AI assistants (required)

When you implement, refactor, document, or review **scripts, hooks, CI, Docker, or runbook commands**:

1. **Read this file first.**
2. Do **not** add OS-only automation without a parallel script or an explicit note in `DECISIONS.md` / `AGENT_LEARNINGS.md`.
3. **Project skills:** runnable blocks need Windows **and** Unix forms, or a documented exception.
4. **Plugin changes:** edit the canonical plugin and re-sync project wiring — never fork plugin logic into the app repo.

## Closure gate (when tooling changed)

If the session touched scripts, hooks, CI, Docker, or skill commands, `context-closure` verifies:

- [ ] Commands work or are documented for **Windows and Unix**
- [ ] Hook scripts still aligned if closure behaviour changed
- [ ] New OS gotchas captured in `AGENT_LEARNINGS.md`

## Related

- `cross-tool-parity.md` — companion guide for Kiro vs Claude vs Cursor
- `context-bootstrap` — installs the OS-specific hook variant described here
- `context-closure` — runs the Cross-OS gate above
- `.context/CONTEXT_HOOKS.md` — installed hook behaviour in this project
