# Deploying to Azure

The PDF-rendering service runs as an **Azure Container App**. The image bundles Chromium
(for Puppeteer) and is stored in **Azure Container Registry (ACR)**, pulled with a
**user-assigned managed identity** — no registry passwords. The service is stateless and
needs no database. CI/CD authenticates to Azure with **OIDC federated credentials**, so no
long-lived cloud secret is ever stored in the repository.

```
GitHub Actions ──OIDC──▶ Azure
      │
      ├─ az acr build ─────▶ ACR ──(managed identity pull)──▶ Container App (:8080 /health, /ready)
      └─ az containerapp update                                    Chromium renderer (1 vCPU / 2 GiB)
```

> Everything here is **deployment-ready** infrastructure-as-code. It has not been applied
> to a live subscription in this repository — follow the steps below to provision it in your
> own Azure account.

## Prerequisites

- Docker and git (the Azure CLI runs from a container — no host install needed).
- An Azure subscription and permission to create resource groups and role assignments.

```bash
az() { docker run --rm -it -v "$HOME/.azure:/root/.azure" mcr.microsoft.com/azure-cli az "$@"; }
az login
```

## 1. Provision the infrastructure

```bash
RG=thai-document-generator-rg
LOCATION=southeastasia

az group create -n "$RG" -l "$LOCATION"

az deployment group create \
  -g "$RG" \
  -f infra/main.bicep \
  -p infra/main.bicepparam
```

The deployment outputs `acrName`, `appName`, and `appUrl`. Note the ACR name and the
container-app name for the next step.

## 2. Wire up OIDC for GitHub Actions

Create an app registration with a **federated credential** scoped to this repository, then
grant it `Contributor` on the resource group:

```bash
APP_ID="$(az ad app create --display-name thai-document-generator-deploy --query appId -o tsv)"
az ad sp create --id "$APP_ID"

az ad app federated-credential create --id "$APP_ID" --parameters '{
  "name": "github-main",
  "issuer": "https://token.actions.githubusercontent.com",
  "subject": "repo:peemphetpimolzzz/thai-document-generator:ref:refs/heads/main",
  "audiences": ["api://AzureADTokenExchange"]
}'

SUB_ID="$(az account show --query id -o tsv)"
az role assignment create --assignee "$APP_ID" --role Contributor \
  --scope "/subscriptions/$SUB_ID/resourceGroups/$RG"
```

## 3. Configure the repository

**Settings → Secrets and variables → Actions**

| Kind | Name | Value |
|------|------|-------|
| Secret | `AZURE_CLIENT_ID` | the app registration's `appId` |
| Secret | `AZURE_TENANT_ID` | `az account show --query tenantId -o tsv` |
| Secret | `AZURE_SUBSCRIPTION_ID` | `az account show --query id -o tsv` |
| Variable | `AZURE_RESOURCE_GROUP` | `thai-document-generator-rg` |
| Variable | `ACR_NAME` | ACR name from step 1 |
| Variable | `APP_NAME` | container-app name from step 1 |

## 4. Deploy

Run the **Deploy (Azure)** workflow from the Actions tab (it is `workflow_dispatch` only
until the secrets above are set; re-enable the `push` trigger in `deploy.yml` to deploy on
every merge to `main`). It builds the image in ACR, then rolls out a new Container Apps
revision and prints the public URL. Verify:

```bash
curl -f "https://<appUrl>/health"
# Render a sample invoice
curl -X POST "https://<appUrl>/documents/invoice" \
  -H 'Content-Type: application/json' \
  --data @samples/invoice.sample.json -o invoice.pdf
```

## Known limitations

- **First revision is unhealthy until the real image is pushed** — the placeholder image
  listens on `:80` while the probes target `:8080`. This is expected for the infra-only
  bootstrap; the deploy workflow replaces the image and the service becomes healthy on the
  next revision.

## Teardown

```bash
az group delete -n "$RG" --yes --no-wait
```
