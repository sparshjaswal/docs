---
title: Cloud engineering
sidebar_label: Cloud engineering
sidebar_position: 0
slug: /cloud-engineering
description: Move a working application into a controlled cloud environment and verify identity, recovery, cost, and cleanup.
---

# Cloud engineering

## Overview

Cloud services provide compute, storage, and networking through managed interfaces. Your task is to choose the responsibilities you want the provider to operate and verify those you still own. Begin with a working [task service](../system-design/case-studies/task-service.md) and [networking fundamentals](../system-design/foundations/networking.md).

The hands-on provider track here is [Azure developer labs](Azure/204/index.md). The decision sequence below applies across providers; product names alone do not establish equivalent guarantees.

## Why it exists

A local process has one machine and one developer watching it. A deployed service needs identity, persistent state, access controls, delivery, and recovery when nobody is watching. Renting compute handles only part of that problem.

## Mental model

Think of a deployment as a set of contracts: who can call it, where state survives, how much load it accepts, and what happens when a dependency fails. A managed service transfers some operation to the provider; it does not transfer responsibility for your application's data and access policy. See [Microsoft's shared responsibility model](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility).

## Visual explanation

| Decision | Evidence to collect | Canonical lesson |
| --- | --- | --- |
| Compute and scaling | Startup behavior, concurrency limit, health signals | [Cloud service selection](../system-design/operations/cloud-platforms.md) |
| Data and backups | Query contract and a successful restore | [Storage](../system-design/data/storage.md) |
| Identity and permissions | Allowed action succeeds; unrelated action is denied | [Authentication](../system-design/interfaces/authentication.md) |
| Delivery | Repeatable configuration and a tested rollback | [Deployments](../system-design/operations/deployments.md) |
| Detection and recovery | A failed request connected to its dependency | [Observability](../system-design/operations/observability.md) |

## How it works

1. State workload, data sensitivity, recovery needs, and a lab budget.
2. Choose a region and services from those requirements; check current quotas and plan features.
3. Create a separate lab environment with an inventory of owned resources.
4. Deploy the simplest working request path and attach monitoring.
5. Give the workload an identity and grant only its required operations.
6. Add persistence and background processing with explicit retry contracts.
7. Recreate the environment, exercise recovery, and verify cleanup.

## Real-world example

The task API stores a record and later processes a notification. First deploy only the API and persistence. Add a queue when the request should not wait for the notification. Deliberately fail the worker after its side effect and before acknowledgement; the expected result is a controlled duplicate-handling outcome, not an unexplained second notification.

Use the [Azure labs](Azure/204/index.md) for service-specific steps. No cloud account is needed to write the design or run the local task service.

## Trade-offs

A managed application platform reduces machine maintenance while constraining runtime and network choices. Containers improve packaging consistency but still need image updates, limits, and observability. Functions suit bounded event-triggered work when their execution and scaling contracts fit. Compare the measured workload and operational burden before choosing.

## Failure scenarios

| Trigger | Symptom | Detection and recovery |
| --- | --- | --- |
| Identity exists without a data-access role | Application authenticates but requests are denied | Inspect principal, scope, and role; test the intended operation. |
| Resource limit is reached | Throttling or failed deployments | Observe quota use; reduce demand or request capacity deliberately. |
| Database unavailable during startup | Deployment never becomes ready | Separate startup from readiness and bound dependency waits. |
| Lab appears idle but resources remain | Continued charges | Reconcile the resource inventory, including retained disks and backups. |

## Production considerations

Use infrastructure as code after understanding the manual setup. Test restore, not just backup creation. Record recovery objectives and deployment ownership. Estimate cost from traffic, compute time, storage, egress, and telemetry with explicit units; verify provider pricing for the selected region and plan. A budget alert is a notification, not an automatic spending cap.

## Exercises

Design the task service deployment on paper. Name the principal for each dependency, the failure signal, the recovery action, and the resources that remain billable when the app receives no requests.

<details>
<summary>Expected review evidence</summary>

The API and worker have identifiable permissions; the database has a tested restore path; retries are bounded; a rollback does not assume an incompatible schema can be reversed. Cleanup accounts for resources outside the application's immediate process. A screenshot of a successful homepage does not establish these properties.

</details>

## Interview questions & answers

<details>
<summary>What does a managed database remove from your responsibilities?</summary>

It can transfer parts of provisioning and platform operations according to its service contract. You still own schema, queries, access, data handling, and verifying that backup and recovery settings meet your application's needs.

</details>

**Revision cues:** workload → service contract → identity → state → recovery → cost. **Key takeaways:** deploy one working path first, verify responsibilities with evidence, and make recovery and cleanup reproducible.

## Further reading

- [Azure Well-Architected Framework](https://learn.microsoft.com/en-us/azure/well-architected/).
- [Azure budgets](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-acm-create-budgets).
