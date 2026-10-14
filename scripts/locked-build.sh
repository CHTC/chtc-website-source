#!/usr/bin/env bash
# Serialises `next build` across concurrent workers sharing this checkout.
# `next build` writes `.next/` and wipes `out/`, so two builds at once corrupt
# each other. Waits (up to ~30 min) for the lock, builds, copies the export to
# the directory given as $1 (optional) so the caller keeps a copy that the next
# worker's build cannot wipe, then releases the lock.
#
#   scripts/locked-build.sh [copy-of-out-dir] [full]
#
# By default runs `npx next build` (no pre/postbuild). Pass `full` as the
# second argument to run `pnpm build` (prebuild + build + postbuild).
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOCK="$ROOT/.build-lock"
COPY_TO="${1:-}"
MODE="${2:-quick}"
waited=0
until mkdir "$LOCK" 2>/dev/null; do
  if [ "$waited" -ge 1800 ]; then echo "locked-build: gave up waiting for $LOCK" >&2; exit 2; fi
  sleep 5; waited=$((waited+5))
done
trap 'rmdir "$LOCK" 2>/dev/null' EXIT
cd "$ROOT"
if [ -z "${GITHUB_TOKEN:-}" ] && command -v gh >/dev/null 2>&1; then
  export GITHUB_TOKEN="$(gh auth token 2>/dev/null || true)"
fi
if [ "$MODE" = "full" ]; then pnpm build; else npx next build; fi
status=$?
if [ "$status" -eq 0 ] && [ -n "$COPY_TO" ]; then
  rm -rf "$COPY_TO"; mkdir -p "$COPY_TO"; cp -R out/. "$COPY_TO"/
  echo "locked-build: export copied to $COPY_TO"
fi
exit $status
