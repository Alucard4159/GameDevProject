#!/usr/bin/env python3
"""Cursor afterFileEdit hook - detects context/skill/plugin file edits and queues a notice.

This mirrors the shell and PowerShell ports:
- stdout is always `{}` because Cursor's afterFileEdit is fire-and-forget
- notices are appended to `.context/.cursor-file-edit-notices.json`
- `CONTEXT_SKIP_HOOK=1` disables the hook for the session
- `CONTEXT_HOOK_DEBUG=1` logs to `TEMP`/`TMPDIR` and fails open on logging errors
"""
from __future__ import annotations

import json
import os
import sys
import tempfile
import time
from pathlib import Path

CONTEXT_META_FILES = {"WORKSPACE.md", "CONTEXT_HOOKS.md", "CONTEXT_INDEX.md"}
SPECIALIST_META_FILES = {"README.md", "PLAYBOOKS_BOUNDARY.md", "PROJECT_STEERING.md"}
_CORPUS_PARTS = ("/skills/", "/playbooks/", "/standards/", "/templates/", "/checklists/", "/docs/")


def _plugin_readme(rel_posix: str) -> bool:
    """Plugin-root README.md (repo-relative). Corpus READMEs do not count."""
    if not rel_posix.endswith("/README.md") and rel_posix != "README.md":
        return False
    # Project skills README, nested corpus READMEs — not plugin scope.
    if rel_posix == "skills/README.md" or "/skills/" in f"/{rel_posix}":
        return False
    return not any(part in f"/{rel_posix}" for part in _CORPUS_PARTS)


def repo_relative_posix(file_path: str, repo_root: Path) -> str | None:
    """Return posix path relative to repo_root, or None if file is outside."""
    try:
        return Path(file_path).resolve().relative_to(repo_root.resolve()).as_posix()
    except (ValueError, OSError):
        root_s = repo_root.resolve().as_posix().replace("\\", "/").rstrip("/")
        norm = file_path.replace("\\", "/").strip()
        # Case-insensitive prefix match for Windows drive letters.
        if norm.lower().startswith(root_s.lower() + "/"):
            return norm[len(root_s) + 1 :]
        return None


def classify_edit(rel_posix: str) -> str | None:
    """Classify a repo-relative edit: context | project-skill | plugin | None."""
    parts = rel_posix.split("/")
    file_name = parts[-1] if parts else ""

    if len(parts) == 2 and parts[0] == ".context" and file_name.endswith(".md"):
        return "context"

    # Project skills live only at repo-root skills/<name>/SKILL.md
    if (
        len(parts) == 3
        and parts[0] == "skills"
        and file_name == "SKILL.md"
    ):
        return "project-skill"

    # Plugin skill / reference: <plugin>/skills/<name>/(SKILL.md|reference-*.md)
    if (
        len(parts) >= 4
        and parts[1] == "skills"
        and parts[0] not in {"", ".", ".context", "skills"}
        and (
            file_name == "SKILL.md"
            or (file_name.startswith("reference-") and file_name.endswith(".md"))
        )
    ):
        return "plugin"

    if _plugin_readme(rel_posix):
        return "plugin"

    return None


def debug(message: str) -> None:
    if os.environ.get("CONTEXT_HOOK_DEBUG") != "1":
        return
    log_root = os.environ.get("TEMP") or os.environ.get("TMPDIR") or tempfile.gettempdir()
    log_path = Path(log_root) / "context-file-edit-hook.log"
    try:
        with log_path.open("a", encoding="utf-8") as handle:
            handle.write(f"{_utc_timestamp()} {message}\n")
    except OSError:
        pass


def _utc_timestamp() -> str:
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


def emit_empty() -> int:
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    sys.stdout.write("{}\n")
    sys.stdout.flush()
    return 0


def find_repo_root(start: Path) -> Path | None:
    cur = start.resolve()
    for _ in range(10):
        if (cur / ".context").is_dir() or (cur / ".git").exists():
            return cur
        if cur.parent == cur:
            break
        cur = cur.parent
    return None


def resolve_repo_root(script_dir: Path) -> Path | None:
    for candidate in (Path.cwd(), script_dir):
        root = find_repo_root(candidate)
        if root is not None:
            return root
    return None


def load_payload() -> dict:
    raw = os.environ.get("CONTEXT_FILE_EDIT_PAYLOAD")
    if raw is None:
        try:
            raw = sys.stdin.read()
        except OSError:
            raw = ""
    if not raw or not raw.strip().startswith("{"):
        return {}
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        return {}
    return parsed if isinstance(parsed, dict) else {}


def extract_file_path(payload: dict) -> str:
    file_path = payload.get("file_path")
    if isinstance(file_path, str) and file_path:
        return file_path
    tool_input = payload.get("tool_input")
    if isinstance(tool_input, dict):
        nested = tool_input.get("file_path")
        if isinstance(nested, str) and nested:
            return nested
    return ""


def append_notice(repo_root: Path, message: str) -> None:
    context_dir = repo_root / ".context"
    if not context_dir.is_dir():
        return
    path = context_dir / ".cursor-file-edit-notices.json"
    notices: list[str] = []
    if path.is_file():
        try:
            parsed = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            parsed = []
        if isinstance(parsed, list):
            notices = [str(item) for item in parsed]
        elif isinstance(parsed, str):
            notices = [parsed]
    notices.append(message)
    try:
        path.write_text(json.dumps(notices, ensure_ascii=True), encoding="utf-8")
    except OSError:
        pass


def main() -> int:
    if os.environ.get("CONTEXT_SKIP_HOOK") == "1":
        debug("exit: CONTEXT_SKIP_HOOK=1")
        return emit_empty()

    payload = load_payload()
    if not payload:
        return emit_empty()

    file_path = extract_file_path(payload)
    if not file_path:
        return emit_empty()

    norm = file_path.replace("\\", "/").strip()
    file_name = Path(norm).name

    script_dir = Path(__file__).resolve().parent
    repo_root = resolve_repo_root(script_dir)
    if repo_root is None:
        debug("exit: repo root not found")
        return emit_empty()

    # Prefer root nearest the edited file (multi-root / wrong cwd), then script/cwd.
    file_root = find_repo_root(Path(norm).parent) if norm else None
    if file_root is not None:
        repo_root = file_root

    rel = repo_relative_posix(norm, repo_root)
    debug(f"path={norm} rel={rel}")
    if rel is None:
        debug("exit: path outside repo root")
        return emit_empty()

    if file_name in {"CHANGELOG.md", "SUGGESTIONS.md"}:
        return emit_empty()

    kind = classify_edit(rel)
    if kind == "context":
        if file_name in CONTEXT_META_FILES:
            debug(f"exit: context meta-file {file_name}")
            return emit_empty()
        message = (
            "[File-edit check] You edited `.context/"
            f"{file_name}`. Check if any sibling context files need corresponding "
            "updates to stay consistent (e.g. TODO.md marked done -> RECENT_CHANGES.md "
            "entry; ARCHITECTURE.md changed -> PROJECT_STATE.md). Only update if there is "
            "a real inconsistency."
        )
        append_notice(repo_root, message)
        debug(f"queued: context file {file_name}")
        return emit_empty()

    if kind == "project-skill":
        if file_name in SPECIALIST_META_FILES:
            debug(f"exit: specialist meta-file {file_name}")
            return emit_empty()
        message = (
            "[File-edit check] You wrote a project skill at `"
            f"{file_name}`. List it in `skills/README.md` and add a row to each tool's "
            "routing file (Kiro, Claude, Cursor)."
        )
        append_notice(repo_root, message)
        debug(f"queued: specialist file {file_name}")
        return emit_empty()

    if kind == "plugin":
        message = (
            "[Plugin-change check] You edited canonical plugin content (`"
            f"{file_name}`). Plugins deploy by junction, so this change is live "
            "everywhere immediately. Before committing, add a dated `CHANGELOG.md` entry "
            "(a commit message is not the changelog)."
        )
        append_notice(repo_root, message)
        debug(f"queued: plugin content {rel}")
        return emit_empty()

    debug("exit: path not monitored")
    return emit_empty()


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:  # fail open
        debug(f"error: {exc}")
        raise SystemExit(emit_empty())
