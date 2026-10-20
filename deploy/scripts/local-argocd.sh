#!/usr/bin/env bash
# Sets up the GitOps flow on a local kind cluster:
# kind cluster -> Argo CD (Helm) -> ApplicationSet -> tic-tac-toe dev and prod.
#
# Environment variables (all optional):
#   CLUSTER       kind cluster name                          (default: tic-tac-toe)
#   REVISION      Git branch or tag Argo CD follows          (default: main)
#   REPO_URL      Git repository Argo CD reads               (default: this repo on GitHub)
#   GITHUB_TOKEN  read access to this repo, needed while it is private
#   GHCR_TOKEN    token with read:packages, needed while the images are private
#   GHCR_USER     GitHub user that owns GHCR_TOKEN           (default: JonHadar)
set -euo pipefail

CLUSTER="${CLUSTER:-tic-tac-toe}"
REVISION="${REVISION:-main}"
ARGOCD_CHART_VERSION="10.10.5"
DEFAULT_REPO_URL="https://github.com/JonHadar/Tic-Tac-Toe-Game---TypeScript-MUI-Express.git"
REPO_URL="${REPO_URL:-$DEFAULT_REPO_URL}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

for tool in kind kubectl helm; do
  command -v "$tool" > /dev/null || { echo "Missing required tool: $tool" >&2; exit 1; }
done

if ! kind get clusters | grep -qx "$CLUSTER"; then
  echo "==> Creating kind cluster '$CLUSTER'"
  kind create cluster --name "$CLUSTER" --wait 120s
fi
kubectl config use-context "kind-$CLUSTER" > /dev/null

echo "==> Installing Argo CD (chart $ARGOCD_CHART_VERSION)"
helm repo add argo https://argoproj.github.io/argo-helm > /dev/null 2>&1 || true
helm repo update argo > /dev/null
helm upgrade --install argocd argo/argo-cd \
  --version "$ARGOCD_CHART_VERSION" \
  --namespace argocd --create-namespace \
  --set 'configs.params.server\.insecure=true' \
  --wait --timeout 5m

if [[ -n "${GITHUB_TOKEN:-}" ]]; then
  echo "==> Adding repository credentials"
  kubectl -n argocd apply -f - <<YAML
apiVersion: v1
kind: Secret
metadata:
  name: tic-tac-toe-repo
  labels:
    argocd.argoproj.io/secret-type: repository
stringData:
  type: git
  url: $REPO_URL
  username: git
  password: $GITHUB_TOKEN
YAML
fi

for env in dev prod; do
  kubectl create namespace "tic-tac-toe-$env" --dry-run=client -o yaml | kubectl apply -f - > /dev/null
  if [[ -n "${GHCR_TOKEN:-}" ]]; then
    kubectl -n "tic-tac-toe-$env" create secret docker-registry ghcr-pull \
      --docker-server=ghcr.io --docker-username="${GHCR_USER:-JonHadar}" --docker-password="$GHCR_TOKEN" \
      --dry-run=client -o yaml | kubectl apply -f - > /dev/null
  fi
done

echo "==> Applying the ApplicationSet ($REPO_URL @ $REVISION)"
sed -e "s|targetRevision: main|targetRevision: $REVISION|" \
    -e "s|repoURL: $DEFAULT_REPO_URL|repoURL: $REPO_URL|" \
    "$ROOT/deploy/argocd/applicationset.yaml" \
  | kubectl apply -f -

cat <<TEXT

Argo CD is running. Open the UI:
  kubectl -n argocd port-forward svc/argocd-server 8080:80
  http://localhost:8080   user: admin
  password: kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 -d

dev syncs automatically; sync prod from the UI (or see deploy/README.md).
Remove everything with: kind delete cluster --name $CLUSTER
TEXT
