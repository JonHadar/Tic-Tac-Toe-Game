# Deployment

How Tic-Tac-Toe gets from a commit to running environments.

```mermaid
flowchart LR
    Dev[Pull request] --> CI[CI: tests, scan,<br/>kind deploy test]
    CI -->|merge to main| Publish[Publish images<br/>to GHCR]
    Publish --> Git[(Git: Helm chart<br/>+ values files)]
    Git -->|automated sync| DevEnv[tic-tac-toe-dev]
    Git -->|manual sync| ProdEnv[tic-tac-toe-prod]
    Argo[Argo CD<br/>ApplicationSet] -.watches.-> Git
```

## Layout

| Path | What it is |
|---|---|
| [`helm/tic-tac-toe/`](helm/tic-tac-toe) | Helm chart for the client and the server |
| [`helm/tic-tac-toe/values-dev.yaml`](helm/tic-tac-toe/values-dev.yaml) | dev environment |
| [`helm/tic-tac-toe/values-prod.yaml`](helm/tic-tac-toe/values-prod.yaml) | prod environment: pinned image tag, 2 client replicas |
| [`argocd/applicationset.yaml`](argocd/applicationset.yaml) | Argo CD ApplicationSet that creates one Application per environment |
| [`scripts/local-argocd.sh`](scripts/local-argocd.sh) | Runs the whole setup on a local kind cluster |

## GitOps with Argo CD

Git is the source of truth: Argo CD continuously compares what is in the repository with what runs in the cluster.

- **One ApplicationSet, two Applications.** A list generator creates `tic-tac-toe-dev` and `tic-tac-toe-prod`, each deploying the chart into its own namespace with its own values file.
- **dev** has automated sync with `prune` and `selfHeal`: every change on `main` is applied, removed resources are deleted, and manual changes in the cluster are reverted.
- **prod** syncs only when someone presses Sync, so releases are deliberate.
- The difference is a single `autoSync` flag per environment, applied through the ApplicationSet's `templatePatch`.

## Run it locally

Requires Docker, [kind](https://kind.sigs.k8s.io), kubectl and Helm.

```bash
./deploy/scripts/local-argocd.sh
```

The script creates a kind cluster, installs Argo CD with its Helm chart, and applies the ApplicationSet. While the repository and images are private, pass credentials:

```bash
GITHUB_TOKEN=<token with read access to the repo> \
GHCR_TOKEN=<token with read:packages> \
./deploy/scripts/local-argocd.sh
```

| Variable | Purpose | Default |
|---|---|---|
| `CLUSTER` | kind cluster name | `tic-tac-toe` |
| `REVISION` | branch or tag Argo CD follows | `main` |
| `REPO_URL` | repository Argo CD reads (e.g. a fork) | this repository |
| `GITHUB_TOKEN` | repository credentials for Argo CD | none |
| `GHCR_TOKEN` / `GHCR_USER` | image pull secret `ghcr-pull` in both namespaces | none / `JonHadar` |

Open the Argo CD UI:

```bash
kubectl -n argocd port-forward svc/argocd-server 8080:80
# http://localhost:8080, user admin, password:
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 -d
```

Play the dev environment:

```bash
kubectl -n tic-tac-toe-dev port-forward svc/tic-tac-toe-client 3000:80
```

Remove everything: `kind delete cluster --name tic-tac-toe`.

## Releasing to prod

1. A change is merged to `main`; CI tests it and publishes images tagged `sha-<commit>`.
2. dev picks up the change automatically.
3. To release it, open a pull request that sets `image.tag` in `values-prod.yaml` to the tested `sha-<commit>`.
4. After it is merged, sync `tic-tac-toe-prod` in Argo CD.
