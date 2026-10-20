#!/usr/bin/env bash
# Opens a pull request that releases the image currently running in dev to prod:
# it copies image.tag from values-dev.yaml to values-prod.yaml.
# Requires git, yq (v4) and an authenticated GitHub CLI (gh).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CHART="$ROOT/deploy/helm/tic-tac-toe"

for tool in git yq gh; do
  command -v "$tool" > /dev/null || { echo "Missing required tool: $tool" >&2; exit 1; }
done

cd "$ROOT"
git fetch -q origin main

# Read both tags from main as it is on GitHub, not from the working tree.
TAG="$(git show origin/main:deploy/helm/tic-tac-toe/values-dev.yaml | yq '.image.tag')"
CURRENT="$(git show origin/main:deploy/helm/tic-tac-toe/values-prod.yaml | yq '.image.tag')"

if [[ "$TAG" == "$CURRENT" ]]; then
  echo "prod already runs $TAG"
  exit 0
fi

BRANCH="release/prod-$TAG"
git switch -q -c "$BRANCH" origin/main
TAG="$TAG" yq -i '.image.tag = strenv(TAG)' "$CHART/values-prod.yaml"
git commit -q -am "Release $TAG to prod"
git push -q -u origin "$BRANCH"

gh pr create --base main --head "$BRANCH" \
  --title "Release $TAG to prod" \
  --body "Promotes the image tested in dev to prod: \`$CURRENT\` → \`$TAG\`.

After merging, sync \`tic-tac-toe-prod\` in Argo CD."
