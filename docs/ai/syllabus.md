---
title: "Syllabus, prerequisites, and study method"
sidebar_label: "Syllabus and lab directory"
sidebar_position: 14
---

# Syllabus, prerequisites, and study method

This curriculum is a sequence of explanations, worked examples, exercises, experiments, and independent projects. The sidebar lists every core lesson in order. The four levels describe increasing independence, not a promise of a qualification or job.

## Four levels of learning

| Level | Stages | You should be able to… | Evidence before advancing |
| --- | --- | --- | --- |
| Beginner | Orientation, Python/data, mathematics | Explain a small program and calculation without copying. | A tested data report and a comparison with assumptions. |
| Intermediate | Machine learning, deep learning, generative AI | Train a small model and explain why its evaluation is fair. | Baseline comparison, gradient check, error analysis, controlled generation. |
| Advanced | Model building, RAG, agents, bots, production | Connect models to useful systems with bounded failure behavior. | Saved model, evidence benchmark, durable action, release and rollback checks. |
| Expert practice | Research and one professional studio | Investigate an uncertain claim and defend a design under real constraints. | Reproducible experiment, alternatives, measured tradeoffs, independent review. |

The shared route deliberately teaches programming before frameworks, mathematics before training, evaluation before model comparison, retrieval before document-using agents, and application boundaries before independent deployment work.

## Use prerequisites actively

Each lesson's previous/next links follow the canonical sequence. Its opening prerequisite links point to the specific ideas it uses. A preview may name a later destination, but you are not expected to implement it before its lesson.

If you already know a topic, demonstrate it: explain a worked example without reading the answer, solve the exercise with a changed input, and inspect the completion evidence. If you cannot, use the linked lesson. A quiz score alone does not justify skipping a project.

The seven roles share a core foundation. Choose one [studio](./careers.md) after that core; you do not need to complete every studio. Use the [glossary](./glossary.md) to find a concept's main explanation instead of reading duplicate introductions.

## Check shared foundations at the point of use

Full-stack experience transfers well, but a familiar tool name does not prove a prerequisite. Use these checks to decide what to revisit. The AI route supplies its required concepts; the supporting tracks offer extra practice rather than mandatory detours.

| Foundation | Demonstrate before relying on it | AI lesson to revisit | Optional shared track |
| --- | --- | --- | --- |
| Functions, objects, and state | Separate a pure decision from a side effect; explain mutable state ownership. | [Python control and functions](./foundations/03-control-and-functions.md) | [Design patterns](../design-pattern/index.md) |
| Collections and complexity | Explain lookup versus scan cost and handle duplicate record IDs. | [Collections and files](./foundations/04-collections-and-files.md) | [Data structures](../DSA/index.md) |
| Independent testing | Find a counterexample to a plausible implementation, then verify the fix. | [Debugging and tests](./foundations/05-debugging-and-tests.md) | [JavaScript testing and review](../javascript/index.md#8-expert-practice-testing-compatibility-and-performance) |
| Reproducible environments | Recreate behavior from versions, commands, configuration, and data. | [Environments and packages](./foundations/06-git-environments-and-packages.md) | [Backend engineering](../system-design/case-studies/task-service.md) |
| Data integrity | Detect a join that multiplies rows and distinguish missing values from zero. | [SQL and data audit](./foundations/07-data-tables-and-sql.md) | [Backend engineering](../system-design/case-studies/task-service.md) |
| Asynchronous work | Explain timeout, cancellation, ordering, and bounded concurrency. | [Python developer mastery lab](./developer-roadmap/02-python-for-ai.md) | [JavaScript asynchronous execution](../javascript/index.md#4-intermediate-asynchronous-execution-and-errors) |
| Web boundaries | Trace request, session, authentication, authorization, and response. | [Local chatbot](./bots/02-build-a-chatbot.md), then [serving](./engineering/01-serving-and-apis.md) | [Backend engineering](../system-design/case-studies/task-service.md) |
| System reasoning | Estimate with units, identify failure ownership, and defend a simpler alternative. | [AI architecture](./engineering/04-architecture-and-cost.md) | [System design](../system-design/README.md) |

For the mathematical prerequisites, use the AI mathematics stage even if you already build applications. Being comfortable with APIs does not replace tracing derivatives, uncertainty, or evaluation leakage. The [developer study plans](./developer-roadmap/study-plans.md) allocate time for those gaps.

## A realistic study cycle

Full-stack developers can follow the [expanded developer roadmap](./developer-roadmap/index.md), with explicit [weekly plans and daily schedules](./developer-roadmap/study-plans.md) and [portfolio briefs](./developer-roadmap/portfolio.md). Use its prerequisite gates to decide which familiar software topics to review and which AI foundations need sustained practice.

For each lesson, spend one session reading and tracing, another running and changing examples, and a final short session explaining the result from memory. Session lengths depend on background and accessibility needs. Plan additional time for debugging and projects rather than treating page count as study time.

Keep three artifacts: a learning log, runnable experiments, and a decision journal. The log records questions. Experiments record inputs, code, and outputs. The journal records why you chose a method and what evidence would change your mind.

Study groups can compare reasoning, swap failure cases, and review reports. Each learner should still run the experiment and explain the result independently.

## Lab directory

Download files from their linked lesson, then run the shown command in the download directory. The default offline programs require Python 3.10+ and the standard library. They do not call a paid API or download model weights.

| Stage | Main lab and instructions | Command after downloading |
| --- | --- | --- |
| Python/data | [Audit a reading log](./foundations/07-data-tables-and-sql.md) | `python reading_audit.py` |
| Mathematics | [Compare methods](./mathematics/04-experiments-and-uncertainty.md) | `python method_comparison.py` |
| Machine learning | [Delivery regression](./machine-learning/07-validation-and-explanations.md) | `python delivery_regression.py` |
| Deep learning | [Train XOR](./deep-learning/02-training-and-pytorch.md) | `python xor_network.py` |
| Reinforcement learning | [Learn in a line world](./deep-learning/06-reinforcement-learning.md) | `python line_world.py` |
| Generation | [A tiny language model](./generative-ai/04-multimodal-generation.md) | `python tiny_language_model.py --self-test` |
| Model building | [Train, save, and reload](./model-building/03-train-a-small-model.md) | `python train_language_model.py --self-test` |
| Retrieval | [Evidence search](./rag/04-rag-evaluation.md) | `python evidence_search.py --self-test` |
| Hybrid retrieval | [Rank fusion](./rag/05-hybrid-search-lab.md) | `python hybrid_retrieval.py --self-test` |
| Agents | [Bounded control loop](./agents/04-agent-evaluation.md) | `python bounded_agent.py --self-test` |
| Model agents | [Model/tool adapter](./agents/05-build-a-model-agent.md) | `python model_agent.py --self-test` |
| Durable actions | [Recover a reservation](./agents/07-durable-workflows.md) | `python durable_action.py --self-test` |
| Bots | [Browser chatbot](./bots/02-build-a-chatbot.md) | `python chatbot.py --self-test` |
| Serving | [Local service](./engineering/01-serving-and-apis.md) | `python service.py` |
| Release | [Quality gate](./engineering/04-architecture-and-cost.md) | `python release_gate.py` |
| Context | [Token budget](./engineering/05-token-and-context-budgets.md) | `python token_budget.py --self-test` |
| Research | [Feature experiment](./research/03-research-directions.md) | `python feature_experiment.py` |

The serving and bot lessons explain the separate commands that start an HTTP server. Read their localhost binding and shutdown instructions before launching a persistent process.

## Understand execution labels

**Offline fixture:** predetermined responses or rankings test application rules. They do not demonstrate live-model quality.

**Tiny trained model:** an actual small learning algorithm changes parameters or counts. It is useful for inspecting mechanics, not evidence of general language understanding.

**Optional package lab:** requires the named packages. The [array/chart lab](./foundations/08-data-tools.md) and PyTorch recipes are examples. Install into an isolated environment and record the versions you actually used.

**Optional live integration:** needs a model host or other named service. The model-agent lesson includes a local-model route. Reevaluate behavior with the real model; fixture success does not transfer automatically.

**Design or capacity exercise:** produces an explicit estimate or test plan. Label it accordingly; do not present an estimated memory budget as a measured hardware result.

## Project handoff template

For each major project, submit the problem, baseline, inputs and provenance, code and environment, evaluation split, results, failure examples, alternatives, and limitations. Include setup and verification commands. A reviewer should not need your memory to reproduce the result.

Run the [stage checkpoints](./assessments.md) before proceeding. Keep existing exercises and summaries as repeated opportunities to apply concepts, while returning to the canonical lesson for explanations.

**Start:** [What AI is, and what you will build](./orientation.md)
