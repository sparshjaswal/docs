---
title: "17. MLOps and LLMOps: tracking, containers, CI/CD, and deployment"
sidebar_position: 17
---

# MLOps and LLMOps: tracking, containers, CI/CD, and deployment

**Prerequisites:** [AI engineering](16-ai-engineering.md), Git, automated tests, APIs, and basic operating-system/network concepts. You should already have one model or assistant worth operating.

## What it is and why it matters

MLOps manages the lifecycle of data, models, and applications. LLMOps applies related operational discipline to prompts, model services, retrieval indexes, tools, and evaluations. Neither is simply deploying a notebook behind an endpoint.

## Learn in this order

### Experiment tracking and MLflow

Record configuration, data version, code revision, environment, metrics, and artifacts for every important run. A model registry identifies artifacts and their lifecycle; it does not prove that a registered model is good.

[MLflow](https://mlflow.org/docs/latest/) supplies experiment and model-lifecycle capabilities, along with LLM/agent tracing and evaluation tools. Start by tracking a small reproducible comparison, then add registry and deployment features for a concrete need.

**Practice:** track three model configurations, attach the same evaluation report, reload the selected artifact in a clean environment, and reproduce its predictions within a declared tolerance.

### Data pipelines and training-serving consistency

Version schemas and transformations as carefully as weights. Validate new data, detect missing partitions, and keep labels aligned with prediction time. A feature computed differently during training and serving creates training-serving skew.

A feature store can help coordinate reused features, but adds operational responsibilities. Begin with a shared, tested transformation when that is enough. Batch pipelines, streaming systems, and event-driven retraining have different failure and freshness requirements.

**Practice:** compare offline features with features produced by the live prediction path for the same saved cases.

### Docker and reproducible packaging

A container packages application dependencies and startup behavior. It is useful for repeatable environments, not proof of security or numerical determinism. Keep build-time and runtime configuration clear, pin dependencies, avoid embedded credentials, and use suitable resource limits.

GPU workloads also depend on driver/runtime compatibility and model artifacts. A container that starts successfully may still fail when loading weights or serving the first request.

**Practice:** containerize the service, run it from a clean build, and test startup with missing configuration, invalid model files, and a constrained memory limit. Follow [Docker's learning material](https://docs.docker.com/get-started/).

### CI/CD and release gates

Continuous integration checks changes automatically. Continuous delivery prepares a reproducible release; deployment promotes it to an environment. Include code tests, data/schema checks, artifact validation, task evaluation, and access-boundary tests.

Version the model, prompt, tokenizer, index, and tool contracts together when a release depends on their combination. Use a staged rollout and a rollback plan that restores compatible components. A code merge need not automatically trigger expensive retraining.

**Practice:** make a deliberately worse candidate fail a quality gate while a code-only fix still passes the appropriate fast checks.

### Kubernetes and production operations

Kubernetes schedules and manages containerized workloads. Learn Pods, Deployments, Services, configuration, secrets, persistent storage, resource requests/limits, readiness/liveness probes, and rollout behavior. GPU scheduling requires suitable device support and capacity planning.

Use it when orchestration needs justify it. A single service on a simpler platform can be easier to operate. Autoscaling on CPU alone may not reflect GPU queues, memory pressure, or token-generation load.

**Practice:** deploy the container in a local learning cluster using the [Kubernetes basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/). Simulate a failing replica, then demonstrate readiness handling and rollback.

### Monitoring and continuous evaluation

Monitor availability, queues, errors, latency, cost, drift, and task quality. Labels may arrive later than requests. Input drift is a signal to investigate, not a command to retrain immediately. Index freshness and provider-version changes can affect an LLM application without changing your code.

**Practice:** simulate a data shift, stale index, and provider failure separately. Write alerts tied to an action and an owner. Reevaluate after a change instead of assuming an old benchmark still applies.

## Mastery lab: release a compatible bundle, then roll it back

A model release is more than a weight file. It may depend on a tokenizer, feature transform, label mapping, prompt, index, adapter, runtime, and decision threshold. A rollback that restores only the weights can leave an incompatible system.

### Implement artifact compatibility checking

```python runnable
def compatible(model, serving):
    required = ("features", "tokenizer", "labels")
    return [key for key in required if model[key] != serving[key]]
model = {"features": "f2", "tokenizer": "t1", "labels": "l1"}
serving = {"features": "f1", "tokenizer": "t1", "labels": "l1"}
print(compatible(model, serving))
```

```text output
['features']
```

This detects version disagreement, not whether either version is correct. A real release manifest also records artifact digests, source/data references, evaluation evidence, dependency lockfiles, and configuration. Verify integrity and permitted artifact sources before loading; some serialization formats can execute code.

### Build the delivery path

Record an experiment in MLflow or an equivalent tracker, export the selected artifact, build a container, run smoke and quality checks, and deploy to a limited environment. Treat Docker as packaging and Kubernetes as orchestration; neither establishes model quality. Prefer a simpler deployment when it meets scale and operations requirements.

In CI, test deterministic transformations and contracts quickly. Run representative model evaluation in a controlled job with recorded versions. Keep a reserved release set separate from the examples used repeatedly for prompt/model tuning. A registry approval should point to evidence rather than a descriptive label alone.

### Debug, optimize, and design recovery

Reproduce a production request using the exact released bundle and appropriately protected input fixture. Compare environment, preprocessing, model settings, and dependent index state before retraining. Monitor infrastructure symptoms immediately; evaluate accuracy when suitable labels arrive. A changing input distribution is a reason to investigate, not automatic proof that retraining helps.

Exercise rollback before an incident. Include state/schema compatibility and in-flight jobs in the drill. A database migration may make a previous application image unsafe even when that image still starts. Use backwards-compatible migration stages where needed.

Optimize build caches, artifact downloads, startup, batch processing, and idle capacity against measured costs. Autoscaling must consider queue wait, cold starts, GPU availability, and service readiness; CPU utilization alone may not represent model-serving demand.

**Interview defense:** “The new image is healthy, but quality collapsed.” Separate liveness, readiness, contract validity, and task quality. Describe a canary comparison and a rollback trigger tied to the actual user outcome.

**Teach it:** hand a learner two individually valid artifacts with incompatible feature versions. Ask why the deployment can start successfully and still be wrong. Deliver a reproducible bundle, CI gate, monitored canary, rollback drill, and incident report.

## Mini project and real-world use

Operate your assistant through one staged release. Track the artifacts, package the service, run CI evaluations, deploy a small version, and perform a rollback drill. Kubernetes is an advanced extension; the release evidence is required whichever platform you choose.

Uses include repeated model releases, multi-team platforms, enterprise retrieval systems, and any application with ongoing quality or availability requirements.

**Completion evidence:** reproducible artifact, CI report, deployment manifest or equivalent, quality gate, monitoring dashboard, rollback demonstration, and an incident runbook.

## Interview questions

1. What must be versioned besides model weights?
2. Why can a reproducible container still produce slightly different numerical results?
3. How does a readiness probe differ from liveness?
4. What evidence should trigger retraining versus fixing the data pipeline?
5. How can an index rollback break compatibility with the running application?
6. When is Kubernetes unnecessary complexity?

## Curated resources

- **Course:** [Full Stack Deep Learning](https://fullstackdeeplearning.com/course/2022/) plus the official Docker and Kubernetes tutorials linked above.
- **Book:** [Machine Learning Systems](https://mlsysbook.ai/), for lifecycle and operational tradeoffs.
- **Paper:** [Hidden Technical Debt in Machine Learning Systems](https://papers.nips.cc/paper/5656-hidden-technical-debt-in-machine-learning-systems), for dependencies beyond the model.
- **GitHub:** [MLflow](https://github.com/mlflow/mlflow) and [Full Stack Deep Learning labs](https://github.com/full-stack-deep-learning/fsdl-text-recognizer-2022-labs), for tracking and deployed-system examples.

**Previous:** [AI engineering](16-ai-engineering.md) · **Next:** [AI system design](18-system-design.md).
