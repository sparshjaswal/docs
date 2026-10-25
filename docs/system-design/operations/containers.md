---
title: "Containers and orchestration"
slug: "/system-design/containers"
pagination_prev: "system-design/services/event-sourcing"
pagination_next: "system-design/operations/deployments"
---

<span id="containers-and-orchestration"></span>

# Containers and orchestration

Separate runtime isolation, scheduling, readiness, and liveness.

**Prerequisite / previous:** [Event sourcing, CQRS, and change data capture](../services/event-sourcing.md) · **Next:** [Deployments, configuration, and safe change](deployments.md)


An image packages an application's filesystem and startup metadata. A container runs processes using that image with isolation and resource controls. A virtual machine includes a guest operating system behind a hypervisor. Containers commonly share the host kernel; neither boundary prevents every security or resource-contention failure.

## From source to running process

A Docker client requests operations from an engine/daemon. A build produces image layers; a registry distributes images; running an image creates container state, networking, mounts, and a process. Pulling may use cached layers. A writable container layer is not a durable database plan. Volumes persist independently of a container's lifecycle, subject to their backing storage and deletion policy. Compose describes a multi-container application; it is not itself a guarantee of production availability.

Use a maintained minimal base image, pin a version or digest according to the update policy, rebuild for security fixes, and scan dependencies. An official image is not automatically vulnerability-free. Multi-stage builds keep build tools out of the runtime image. Use `.dockerignore`, put stable build steps before frequently changing ones, label ownership, and run with minimal privileges. Do not put secrets into image layers. Environment configuration supports portability, but CPU architecture, kernel capabilities, and external dependencies still matter.

## Kubernetes responsibilities

| Component | Responsibility | Failure implication |
| --- | --- | --- |
| API server | Validates and exposes cluster state operations | Control-plane access can fail while existing workloads continue |
| etcd | Stores Kubernetes control-plane state | Needs quorum, backups, and tested restoration |
| Scheduler | Assigns unscheduled Pods to nodes | It does not execute application jobs itself |
| Controllers | Reconcile desired and observed state | Reconciliation is asynchronous and must tolerate retries |
| Kubelet | Manages Pod execution on a node | Node failure requires detection and recovery |
| Service networking | Routes traffic toward eligible endpoints | Stale endpoints and network policy can break requests |

A Pod groups containers sharing a network namespace and selected volumes. Kubernetes networking implementations vary; kube-proxy is not mandatory in every implementation. A Deployment manages replaceable replicas; a StatefulSet supplies stable identities and storage associations, but does not implement database replication or backup for you. Jobs run finite work and may retry it, so job effects must tolerate repeated execution.

## Exposure and probes

ClusterIP normally exposes a virtual service address within the cluster; NodePort exposes a port on nodes; LoadBalancer asks an integration to provision a load balancer; ExternalName returns a DNS alias and does not proxy traffic. Ingress or Gateway implementations add routing capabilities with their own configuration. Actual reachability depends on routing and security rules. See [Kubernetes Service types](https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types).

Readiness controls whether a workload should receive service traffic. Liveness can restart an unhealthy container, and startup probes give slow startup time before other probes run. A failing downstream database should not automatically trigger simultaneous restarts of every healthy application process. See [Kubernetes probe behavior](https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/).

## Patterns and trade-offs

Declare realistic resource requests and limits and leave room for system components. A sidecar adds supporting behavior but also consumes resources and has lifecycle dependencies. Init containers perform preparation. Controllers and operators automate reconciliation; their retry, permission, and upgrade behavior becomes part of the system's reliability.

Rolling, canary, blue-green, recreate, and shadow strategies are explained once in [deployments](deployments.md). No strategy guarantees zero downtime: capacity, readiness, draining, session handling, and schema compatibility still matter. Shadow requests must not repeat production side effects. A/B testing measures product behavior and is not synonymous with a safe deployment strategy.

## Exercise and interview checks

A rolling update leaves half the replicas unready while the old replicas are terminated. Identify the capacity and rollout settings that could prevent this, and define rollback evidence. Next, kill a database Pod and explain what Kubernetes restores versus what the database must recover.

Tool charts can help discovery, but learning 120 ecosystem products is not a prerequisite. Choose a tool to satisfy a concrete requirement, identify its owner, and test loss of its control plane. Related: [storage](../data/storage.md), [observability](observability.md), and [resilience](resilience.md).

## Architecture flow

```mermaid
flowchart LR
  accTitle: The orchestrator schedules a container and gates traffic on readiness
  D[Desired workload] --> S[Scheduler]
 S --> N[Node runtime]
 N --> P[Container process]
 P --> R[Readiness result]
 R --> E[Eligible traffic endpoint]
```
