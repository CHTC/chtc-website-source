#!/bin/bash
# Publish the built site to CHTC/chtc.github.io, which the CS department's web
# server pulls to serve chtc.cs.wisc.edu. Ported from chtc-website-source's
# script/cideploy.
#
#   .github/workflows/deploy-csl.sh <site-dir>
#
# Expects an ssh-agent holding a deploy key for TARGET_REPO. Set NO_PUSH=1 to
# commit without pushing.
set -euo pipefail

SITE_DIR=$(cd "${1:?usage: deploy-csl.sh <site-dir>}" && pwd)
: "${TARGET_REPO:=CHTC/chtc.github.io}"
: "${BRANCH:=master}"
WORK_DIR=$(mktemp -d)
trap 'rm -rf "$WORK_DIR"' EXIT

git clone --depth 1 --quiet --branch "$BRANCH" "git@github.com:$TARGET_REPO.git" "$WORK_DIR"

# --delete mirrors the build exactly, so pages removed from the site go away
# there too. The repository's own .git and .gitignore are not part of the
# build and must survive it.
rsync -a --delete --filter='P /.git' --filter='P /.gitignore' --exclude='/.git' \
  "$SITE_DIR/" "$WORK_DIR/"

# The developer schedules live on the department's file system, not in this
# site. The server follows this link; staff/.htaccess puts it behind a login.
ln -sfn /p/condor/public/html/developers/schedules "$WORK_DIR/staff/schedules"

# GitHub Pages also serves this repository, and without this Jekyll would drop
# every path starting with an underscore, _next included.
touch "$WORK_DIR/.nojekyll"

cd "$WORK_DIR"
if [[ "${GITHUB_ACTIONS:-}" == true ]]; then
  git config user.email "actions@github.com"
  git config user.name "GitHub Actions"
fi
# -f because the repository's .gitignore ignores staff/schedules.
git add -f -A
if git diff --cached --quiet; then
  echo "No changes to deploy."
  exit 0
fi
git commit --quiet -m "Deploy ${GITHUB_SHA:-local build} - $(date -u +%Y-%m-%dT%H:%M:%SZ)"
if [[ -n "${NO_PUSH:-}" ]]; then
  git show --stat=200 --format='Would push: %s' | tail -n 40
  exit 0
fi
git push --quiet origin "$BRANCH"
echo "Deployed to $TARGET_REPO@$BRANCH."
