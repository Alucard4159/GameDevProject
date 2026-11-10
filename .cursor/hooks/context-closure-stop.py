#!/usr/bin/env python3
"""Cursor stop hook — unconditional context-update check after every response.

Windows workaround: Cursor's PowerShell-hosted stop hooks often lose stdout
(empty OUTPUT / "Failed to parse hook stdout as JSON"). Invoking this via
`python -u` with an explicit flush + short delay before exit is the reliable
path on Windows. Keep behavior aligned with the OS-specific hooks.json runner
(hooks.windows.json / hooks.unix.json) — that is the parity surface now that
per-OS .ps1/.sh hook files are retired.

Loop guard: Cursor sometimes leaves loop_count at 0 across follow-up turns (and
duplicate project+user stop hooks used to inject twice). We stamp
.context/.cursor-stop-followup.json per conversation_id and refuse a second
followup within STOP_FOLLOWUP_COOLDOWN_SEC (default 120).
"""
from __future__ import annotations

import json
import os
import sys
import time
from pathlib import Path

CONTEXT_PROMPT = (
    "Context closure:\n"
    "\n"
    "If this session made **material** changes:\n"
    "1. Identify which project directories you edited. If you touched files "
    "outside this project's own directory, route the update to whichever "
    "project *owns* the change, not whichever `.context/` is physically "
    "nearest: (a) if the edited repo has its own `.context/` folder, that "
    "owns it; (b) if the edited repo uses a different mechanism for the same "
    "job (a plugin's CHANGELOG.md + SUGGESTIONS.md pair, etc.), use that "
    "instead of inventing a `.context/` folder that doesn't match its "
    "conventions; (c) if it's a multi-repo initiative with a declared "
    "WORKSPACE_ROOT, route there per that pointer. State which target you "
    "picked and why in one line -- 'nearest' is never the justification.\n"
    "2. Update each relevant `.context/` file. Pay special attention to "
    "DECISIONS.md — any 'why did we do it this way' choice (even small ones "
    "like fallback behavior, display logic, or cost calculation approach) "
    "should be recorded there with rationale. Also check cross-file "
    "consistency: if TODO.md was marked done, RECENT_CHANGES.md needs a "
    "corresponding entry; if ARCHITECTURE.md changed, PROJECT_STATE.md may "
    "need updating too. Only touch a file if there's a real inconsistency, "
    "not just because another .context/ file was edited.\n"
    "3. Run the `context-closure` skill (from the `context` plugin) and "
    "return its literal fenced Output Contract closure block verbatim — do "
    "not summarize it into prose.\n"
    "\n"
    "If minor or already current, say so briefly and stop."
)

COOLDOWN_SEC = int(os.environ.get("STOP_FOLLOWUP_COOLDOWN_SEC", "120"))


def debug(msg: str) -> None:
    if os.environ.get("CONTEXT_HOOK_DEBUG") != "1":
        return
    log = Path(os.environ.get("TEMP") or os.environ.get("TMPDIR") or "/tmp") / (
        "context-closure-hook.log"
    )
    try:
        with log.open("a", encoding="utf-8") as f:
            f.write(f"{time.strftime('%Y-%m-%dT%H:%M:%S')} {msg}\n")
    except OSError:
        pass


def emit(obj: dict) -> None:
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    sys.stdout.write(json.dumps(obj, ensure_ascii=True) + "\n")
    sys.stdout.flush()
    time.sleep(0.1)


def emit_empty() -> int:
    emit({})
    return 0


def find_repo_root(start: Path) -> Path:
    cur = start.resolve()
    for _ in range(10):
        if (cur / ".git").exists():
            return cur
        if cur.parent == cur:
            break
        cur = cur.parent
    return start.resolve()


def get_and_clear_pending_notices(repo_root: Path) -> list[str]:
    path = repo_root / ".context" / ".cursor-file-edit-notices.json"
    if not path.is_file():
        return []
    notices: list[str] = []
    try:
        raw = path.read_text(encoding="utf-8")
        parsed = json.loads(raw)
        if isinstance(parsed, list):
            notices = [str(x) for x in parsed]
        elif isinstance(parsed, str):
            notices = [parsed]
    except (OSError, json.JSONDecodeError):
        notices = []
    try:
        path.unlink(missing_ok=True)
    except OSError:
        pass
    return notices


def followup_stamp_path(repo_root: Path) -> Path:
    return repo_root / ".context" / ".cursor-stop-followup.json"


def recently_followed_up(repo_root: Path, conversation_id: str) -> bool:
    if not conversation_id:
        return False
    path = followup_stamp_path(repo_root)
    if not path.is_file():
        return False
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return False
    if data.get("conversation_id") != conversation_id:
        return False
    try:
        ts = float(data.get("ts", 0))
    except (TypeError, ValueError):
        return False
    return (time.time() - ts) < COOLDOWN_SEC


def stamp_followup(repo_root: Path, conversation_id: str) -> None:
    if not conversation_id:
        return
    ctx = repo_root / ".context"
    if not ctx.is_dir():
        return
    path = followup_stamp_path(repo_root)
    try:
        path.write_text(
            json.dumps(
                {"conversation_id": conversation_id, "ts": time.time()},
                ensure_ascii=True,
            )
            + "\n",
            encoding="utf-8",
        )
    except OSError:
        pass


def context_prompt(pending: list[str]) -> str:
    if not pending:
        return CONTEXT_PROMPT
    return "\n".join(pending) + "\n\n" + CONTEXT_PROMPT


def main() -> int:
    if os.environ.get("CONTEXT_SKIP_HOOK") == "1":
        debug("exit: CONTEXT_SKIP_HOOK=1")
        return emit_empty()

    raw = os.environ.get("CONTEXT_STOP_HOOK_PAYLOAD")
    if raw is None:
        try:
            raw = sys.stdin.read()
        except OSError:
            raw = ""

    payload: dict = {}
    if raw and raw.strip().startswith("{"):
        try:
            parsed = json.loads(raw)
            if isinstance(parsed, dict):
                payload = parsed
        except json.JSONDecodeError:
            payload = {}

    try:
        loop_count = int(payload.get("loop_count", 0) or 0)
    except (TypeError, ValueError):
        loop_count = 0
    conversation_id = str(
        payload.get("conversation_id") or payload.get("session_id") or ""
    )
    debug(f"invoked loop_count={loop_count} conversation_id={conversation_id}")

    # loop_count>=1: AI already responded to our followup — stay silent.
    if loop_count >= 1:
        debug(f"exit: loop_count={loop_count} (AI responded to hook)")
        return emit_empty()

    script_dir = Path(__file__).resolve().parent
    repo_root = find_repo_root(script_dir.parent.parent)

    # Defensive: Cursor may keep loop_count at 0 across follow-up turns.
    if recently_followed_up(repo_root, conversation_id):
        debug("exit: cooldown (already followed up this conversation recently)")
        return emit_empty()

    pending = get_and_clear_pending_notices(repo_root)
    if pending:
        debug(f"surfacing {len(pending)} queued file-edit notice(s)")

    stamp_followup(repo_root, conversation_id)
    debug("followup: unconditional context check")
    emit({"followup_message": context_prompt(pending).strip()})
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:  # fail open
        debug(f"error: {exc}")
        raise SystemExit(emit_empty())
