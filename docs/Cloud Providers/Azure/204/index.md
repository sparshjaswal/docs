---
id: az-204-study-guide
title: "AZ-204 Study Guide (Developer Associate)"
sidebar_label: "AZ-204 Study Guide"

description: A practical, step‑by‑step study plan to maximize your chances of passing Microsoft Azure AZ‑204 using official docs, hands‑on labs, checklists, and exam‑style drills.
---

Note: This guide follows the official AZ‑204 blueprint. Weights can change—always verify the latest on the official exam page before you start.

## Who this is for

- Developers (JS/TS, .NET, Python, Java) preparing for Azure Developer Associate (AZ‑204)
- You can build REST APIs or functions, read cloud docs, and run CLI commands

- You want a learning‑friendly path: short reads → guided labs → self‑checks → exam drills

:::tip Learning mindset
Aim for deep understanding + repeatable muscle memory. Each module ends with:

- Learn: Short, focused reading list from Microsoft Docs
- Build: A lab that forces you to touch the key features
- Check: Concept questions (closed‑book) and a tiny “proof” artifact (CLI output, resource IDs, KQL)
- Remember: Flashcards and a 60‑second recap
  :::

## How to use this guide

- Create a repo: az‑204/ with subfolders: 01-compute, 02-storage, 03-security, 04-observability, 05-integration, 06-iac
- Keep lab‑notes.md in each folder. Paste commands, IDs, screenshots, KQL, and answers
- After Week 4, do two timed mocks. For wrong answers, write why they were wrong and fix with mini‑labs

## Exam blueprint (check official page for updates)

- Develop Azure compute solutions: 25–30%
- Develop for Azure storage: 15–20%
- Implement Azure security: 20–25%
- Monitor, troubleshoot, and optimize Azure solutions: 15–20%

- Connect to and consume Azure services and third‑party services: 15–20%

## Prerequisites checklist

- Azure subscription you control (avoid RBAC blockers)
- Azure CLI installed and signed in: `az login`
- One runtime installed: Node.js LTS or .NET SDK or Python 3.x
- VS Code with Azure Tools + Bicep extensions
- Optional: Postman/REST Client extension for quick API calls

---

## Week‑by‑week plan (2–3 hrs/day)

### Week 1 — Compute + Serverless fundamentals

Learning objectives

- Choose between App Service, Functions, and Container Apps for common scenarios
- Use deployment slots, app settings vs Key Vault references, cold‑start mitigations

Read (60–90 min)

- App Service: plans, Linux containers, deployment slots, config, Key Vault references
- Azure Functions: triggers, bindings, scaling, Durable Functions patterns

Lab A — Minimal API on App Service (45–60 min)

- Create plan + app, deploy a hello API, verify with curl, capture resource IDs

```bash
az group create -n rg-az204-wk1 -l westeurope
az appservice plan create -g rg-az204-wk1 -n plan-wk1 --sku B1 --is-linux
az webapp create -g rg-az204-wk1 -p plan-wk1 -n app-wk1 --runtime 'NODE|18-lts'
```

Lab B — HTTP Function with Queue output (45–60 min)

- Create a Function app, HTTP trigger, and connect a Queue output binding

```bash
az storage account create -g rg-az204-wk1 -n stwk1$RANDOM -l westeurope --sku Standard_LRS --kind StorageV2
az functionapp create -g rg-az204-wk1 -n fn-wk1 --consumption-plan-location westeurope \
  --runtime node --runtime-version 18 --functions-version 4 \
  --storage-account <storageAccountName>
```

Self‑check (closed‑book)

- When do you prefer deployment slots over direct deploy? How do Key Vault references differ from app settings?
- When should Functions use Premium vs Consumption (latency, VNET, Always On)?

### Week 2 — Data + Messaging

Learning objectives

- Pick the right storage/messaging option; secure access via SAS/RBAC/Managed Identity
- Partition data properly in Cosmos DB and tune RU/s

Read (60–90 min)

- Storage (Blob/Queue/Table/Files) auth (SAS, RBAC), lifecycle mgmt, immutability
- Cosmos DB (SQL API) partitions, RU/s, consistency, indexing, TTL, SDK basics
- Messaging options: Service Bus vs Event Hubs vs Event Grid

Lab — Storage + Functions (60–90 min)

- Blob SDK upload/download; Queue producer/consumer with Functions trigger
- Cosmos DB container, CRUD via SDK, RU/s tuning, TTL enabled

Self‑check

- When to choose Service Bus vs Event Hubs vs Event Grid? Give a 1‑sentence rule for each
- How would you choose a Cosmos DB partition key for orders?

### Week 3 — Security, Observability, APIs, Caching

Learning objectives

- Use Managed Identity + DefaultAzureCredential end‑to‑end
- Instrument with Application Insights and reason about traces/logs with KQL
- Protect/front APIs with API Management policies and cache wisely

Read (60–90 min)

- Managed Identity (system/user‑assigned), RBAC, Key Vault secrets/keys/certs
- Application Insights, distributed tracing, KQL basics
- API Management, revisions/versions, policies; Caching, CDN

Lab (90 min)

- Assign identity to Function/App; read secret from Key Vault with DefaultAzureCredential
- Add App Insights/OpenTelemetry SDK and view traces, dependencies, failures

- Front an API with APIM; add rate‑limit and JWT validate policies; enable response cache

Self‑check

- What’s the minimum role to read a secret from Key Vault from your app?
- How do you trace a failing dependency call end‑to‑end in App Insights?

### Week 4 — IaC + Containers + Optimization + Exam readiness

Learning objectives

- Deploy with Bicep modules; containerize and deploy to Container Apps/ACR
- Optimize for reliability/perf/cost; practice timed mocks

Read (60–90 min)

- Bicep fundamentals (params, vars, modules, conditions, loops), deployment scopes
- Container registry (ACR), Container Apps (or AKS basics), CI/CD with GitHub Actions
- Reliability, performance, cost, scaling options

Lab (90–120 min)

- Provision App Service + Storage + Key Vault with Bicep (secret ref from KV)
- Build/push an image to ACR; deploy to Container Apps; access KV via Managed Identity

- Timed mocks + weak‑area review; exam logistics checklist

---

## Deep‑dive by exam domain with decision guides

### 1) Develop Azure compute solutions (25–30%)

You should be able to choose and build with:

- App Service: Linux plans, startup commands, container support, slot swaps, health probes
- Azure Functions: triggers (HTTP, Timer, Queue, Service Bus), bindings, Durable patterns

- Container Apps: scale‑to‑zero, KEDA‑based scaling, revisions, Dapr integration

Common decisions

- Functions vs App Service: event‑driven/short‑lived vs long‑running/hosted web apps
- Timer vs Queue triggers: schedule vs work‑item processing with backpressure
- Cold start mitigations: Premium plan, pre‑warmed instances, Always On

Example: Minimal Function calling Key Vault with Managed Identity (Node.js)

```javascript
import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

export default async function (context, req) {
  const credential = new DefaultAzureCredential();
  const kvUrl = process.env.KEYVAULT_URL; // e.g., https://kv-wk1.vault.azure.net/
  const client = new SecretClient(kvUrl, credential);
  const secret = await client.getSecret('apiKey');
  context.res = { status: 200, body: { ok: true, keyLength: secret.value.length } };
}
```

Deployment slots (why/when)

- Blue/green deployments, staged config, warm‑up, swap with preview

Practice prompts (write in lab‑notes.md)

- “Migrate a monolith to Azure with minimal code changes—pick a compute option and justify”
- “Reduce cold‑start latency for a queue‑triggered workload—what changes do you make?”

### 2) Develop for Azure storage (15–20%)

Blob Storage essentials

- Redundancy (LRS/ZRS/GZRS/RA‑GZRS), tiers (Hot/Cool/Archive), immutability policies
- Auth: SAS vs RBAC (Azure AD). Prefer RBAC with Managed Identity for apps

Queue/Table basics

- Queue for simple work items; poison queues and DLQ patterns

- Table for schemaless key‑value; consider Cosmos DB if global scale/queries needed

Blob quickstart via SDK (Node.js)

```javascript
import { BlobServiceClient } from '@azure/storage-blob';

const client = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
const container = client.getContainerClient('images');
await container.createIfNotExists();
const blob = container.getBlockBlobClient('hello.txt');
await blob.uploadData(Buffer.from('hi'));
```

Cosmos DB decisions

- Partition key drives scale and RU cost; choose high‑cardinality access path
- Consistency: Eventual (cheapest), Session (default), Strong (regional, highest RU)
- Indexing policy: exclude large blobs; include only query paths
- TTL: auto‑expire data to control cost

Exam‑style scenario

- “Order service with hot sellers causing RU spikes—what 3 changes reduce cost without breaking SLAs?”

### 3) Implement Azure security (20–25%)

Identity in code

- Use DefaultAzureCredential and Managed Identity; avoid connection strings

- Store secrets in Key Vault; grant minimal roles (Secrets User) to workload identity

App Service/Functions security

- AuthN using Microsoft Entra (Easy Auth) vs app‑level MSAL libraries
- Restrict public access: IP restrictions, Private Endpoints, VNET integration where needed

Key Vault patterns

- Secret versioning/rotation; soft‑delete + purge‑protect; RBAC vs access policies

Sample: .NET using DefaultAzureCredential

```csharp
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;

var client = new SecretClient(new Uri(Environment.GetEnvironmentVariable("KEYVAULT_URL")), new DefaultAzureCredential());
KeyVaultSecret secret = await client.GetSecretAsync("apiKey");
Console.WriteLine(secret.Value.Length);
```

Quick checks

- What’s the minimum role to read a secret? Why not use connection strings in code?
- How would you secure a public app behind Private Endpoints?

### 4) Monitor, troubleshoot, and optimize (15–20%)

App Insights must‑knows

- Track dependencies, requests, exceptions; sampling to control ingestion cost
- Live Metrics and Application Map for quick triage

KQL snippets you should recall

```kusto
requests
| where timestamp > ago(1h)
| summarize count() by resultCode
```

```kusto
exceptions
| where timestamp > ago(1h)
| summarize by type, innermostMessage
```

Alerting

- Metric alerts for error rates/latency; Log alerts for KQL conditions; action groups

Troubleshooting drill

- “An API shows 5% 5xx in last hour. Which 3 KQL queries do you run and what actions follow?”

### 5) Connect to and consume Azure/3rd‑party services (15–20%)

Messaging choices

- Service Bus: enterprise messaging, at‑least‑once, sessions, transactions
- Event Hubs: high‑throughput streaming/telemetry
- Event Grid: reactive events, low‑overhead pub/sub across Azure services

Reliability patterns

- Idempotency keys, retries with backoff, DLQ handling, poison message triage

Service Bus trigger sample (Functions)

```javascript
module.exports = async function (context, mySbMsg) {
  context.log('Service Bus topic message:', mySbMsg);
};
```

Function.json binding shape (reference)

```json
{
  "bindings": [
    {
      "type": "serviceBusTrigger",
      "direction": "in",
      "name": "mySbMsg",
      "topicName": "orders",
      "subscriptionName": "default",
      "connection": "SERVICEBUS_CONNECTION"
    }
  ]
}
```

Exam‑style scenario

- “You must notify downstream systems when a blob lands. Pick the service and show the event flow.”

---

## API Management, caching, CDN (exam‑relevant)

APIM policy examples

```xml
<policies>
  <inbound>
    <rate-limit calls="10" renewal-period="60" />
    <validate-jwt header-name="Authorization" failed-validation-httpcode="401">
      <openid-config url="https://login.microsoftonline.com/<tenant>/v2.0/.well-known/openid-configuration" />
      <audiences>
        <audience>api://your-app-id</audience>
      </audiences>
    </validate-jwt>
    <cache-lookup vary-by-developer="true" vary-by-developer-groups="true" />
  </inbound>
  <backend />
  <outbound>
    <cache-store duration="60" />
  </outbound>
</policies>
```

CDN/caching decisions

- Cache where responses are deterministic and reused
- Avoid caching user‑specific content unless you use per‑user cache keys

---

## Infrastructure as Code (Bicep) and CI/CD

Bicep starter

```bicep
param location string = resourceGroup().location
param appName string
param planName string

resource plan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: planName
  location: location
  sku: {
    name: 'B1'
    tier: 'Basic'
    size: 'B1'
    capacity: 1
  }
}

resource site 'Microsoft.Web/sites@2022-03-01' = {
  name: appName
  location: location
  properties: {
    serverFarmId: plan.id
    httpsOnly: true
  }
}
```

GitHub Actions to deploy Bicep (simplified)

```yaml
name: deploy
on: [push]
jobs:
  bicep:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: azure/login@v2
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
      - name: Deploy
        run: |
          az group create -n rg-az204-ci -l westeurope
          az deployment group create \
            -g rg-az204-ci \
            -f infra/main.bicep \
            -p appName=app-ci planName=plan-ci
```

---

## Evidence to collect for each lab

- az commands executed (with timestamps) and resulting resource IDs
- Screenshots of successful requests (Functions HTTP 200, APIM test console)
- App Insights query results (copy KQL + screenshot)
- Git commits/PR links for IaC and app code

## Common pitfalls (exam traps)

- Putting secrets in app settings vs using Key Vault or DefaultAzureCredential
- Misusing Service Bus vs Event Hubs vs Event Grid
- Wrong Cosmos DB partition key; RU hot partitions; forgetting TTL/index tuning

- Cold starts on latency‑sensitive Functions; wrong plan choice
- Missing retries/idempotency/DLQ handling in messaging flows
- Lack of structured logging and correlation IDs

:::caution Avoid MDX pitfalls

- Keep code fences balanced and label the language (`bash, `javascript, `csharp, `yaml)
- Escape angle brackets in prose or wrap examples in code fences
- Prefer admonitions (like this block) over raw JSX in Markdown
  :::

---

## Mock exam strategy

- Two weeks out: short topic quizzes; write why wrong answers are wrong
- One week out: two full timed mocks; review only weak sections on Docs
- 2–3 days out: redo labs fast to rebuild muscle memory
- Day before: checklist + environment sanity (CLI auth, KQL basics)

## Day‑before exam checklist

- CLI logged in; know `az account show` and `az role assignment list`
- Can deploy a small Bicep (App Service + Storage + Key Vault) with parameters
- Can write an HTTP Function with a Queue/Blob output binding and test locally and in Azure

- Can front an API with APIM and apply rate‑limit/JWT validate policies

## Curated Microsoft Docs (start here, then branch as needed)

- App Service: https://learn.microsoft.com/azure/app-service/
- Azure Functions: https://learn.microsoft.com/azure/azure-functions/
- Durable Functions: https://learn.microsoft.com/azure/azure-functions/durable/durable-functions-overview
- Storage (Blob/Queue/Table): https://learn.microsoft.com/azure/storage/
- Cosmos DB: https://learn.microsoft.com/azure/cosmos-db/
- Service Bus: https://learn.microsoft.com/azure/service-bus-messaging/
- Event Grid: https://learn.microsoft.com/azure/event-grid/
- Event Hubs: https://learn.microsoft.com/azure/event-hubs/
- Managed identity: https://learn.microsoft.com/entra/identity/managed-identities-azure-resources/overview
- Key Vault: https://learn.microsoft.com/azure/key-vault/
- Application Insights: https://learn.microsoft.com/azure/azure-monitor/app/app-insights-overview
- API Management: https://learn.microsoft.com/azure/api-management/
- Bicep: https://learn.microsoft.com/azure/azure-resource-manager/bicep/overview
- Container Apps: https://learn.microsoft.com/azure/container-apps/
- GitHub Actions for Azure: https://learn.microsoft.com/azure/developer/github/

## Exam logistics and policy

- Official exam: https://learn.microsoft.com/credentials/certifications/azure-developer/
- Read ID requirements, online proctoring setup, reschedule, retake policy, NDA

## Success tips

- Favor SDK + Managed Identity + Key Vault over connection strings
- Build small, reusable Bicep modules; automate deploys
- Instrument everything (logs/metrics/traces) and test failure paths
- Use least privilege RBAC; avoid broad Contributor for runtime identities
