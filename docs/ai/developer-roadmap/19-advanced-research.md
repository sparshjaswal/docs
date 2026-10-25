---
title: "19. Advanced AI, knowledge graphs, robotics, and research"
sidebar_position: 19
---

# Advanced AI, knowledge graphs, robotics, and research

**Prerequisites:** the shared foundations and one independently evaluated application. Follow the [research lessons](../research/01-papers-and-experiments.md). You do not need to master every branch below; choose one primary specialization and one supporting branch.

## What it is and why it matters

Advanced practice means investigating uncertain claims and defending decisions with evidence. Expertise is domain-specific: a strong RAG engineer is not automatically a robotics researcher. Broad literacy helps you collaborate; depth comes from sustained projects, experiments, and review.

## Learn in this order

### Research methods

Read a paper in passes: problem and contribution, experiment design, method, then mathematical and implementation detail. Identify the baseline, dataset, split, assumptions, compute budget, and unresolved questions. An **ablation** changes or removes a component to test what contributed to the result.

Replicate a manageable result before inventing a large new architecture. Use multiple seeds when appropriate, report uncertainty and negative results, and distinguish failure to reproduce from evidence that a claim is false. Keep a clean final evaluation set.

**Practice:** reproduce one table or figure, then change one assumption. Write a short report explaining whether the evidence supports the claimed improvement.

### Reinforcement learning before robotics or adaptive control

Study states, observations, actions, policies, rewards, returns, and Markov decision processes. Learn value functions, Bellman relationships, tabular Q-learning, policy gradients, actor–critic methods, and model-based planning. Then study offline RL, off-policy evaluation, exploration, and reward design.

An action changes future data, so a static held-out prediction score is often insufficient. In offline RL, the dataset may not cover actions a new policy wants to take. Reward hacking is a specification problem, not simply a lack of training.

**Practice:** complete [line-world RL](../deep-learning/06-reinforcement-learning.md), change the reward, and compare behavior across seeds. Test termination separately from an external collection limit.

### Knowledge graphs and graph learning

A knowledge graph represents entities and relationships, often as subject–relation–object triples. Learn entity resolution, schemas, provenance, graph queries, and how relations change over time. A graph database stores and queries structure; a graph neural network learns representations from graph neighborhoods. They are different tools.

Graphs can support multi-hop queries or evidence paths, but extracted edges may be wrong. Graph-enhanced RAG still needs source citations, authorization, and evaluation against a simpler retrieval baseline.

**Practice:** build a small graph of repositories, services, owners, and dependencies from synthetic records. Answer multi-hop questions with explicit paths, then inject an incorrect edge and inspect its effect.

### Advanced multimodal systems

Study cross-modal alignment, missing modalities, temporal synchronization, representation fusion, and modality-specific robustness. A combined model may learn shortcuts, such as using text metadata instead of the intended image signal.

**Practice:** remove or corrupt one modality at a time in your module 11 project. Measure whether the system's confidence and fallback behavior respond appropriately. Compare one large combined model with a modular pipeline.

### Robotics

Add mechanics, coordinate frames, kinematics, dynamics, state estimation, planning, control, and simulation before learned robot policies. Perception estimates the world; control chooses physical actions under constraints. Errors can accumulate through both stages.

Learn imitation learning and reinforcement learning in simulation, then study sim-to-real differences such as delay, contact, sensor noise, and unmodeled dynamics. A text-planning agent alone is not a robot controller.

**Practice:** use a simulated cart-pole or mobile robot. Compare a simple controller with a learned policy under changed mass, delay, or noise. Keep physical deployment outside the learning project unless supervised by the appropriate experienced team.

### Self-improving agents and continual learning

An improvement loop collects failures, proposes changes, evaluates candidates, and promotes a version only if independent evidence supports it. “Self-improving” can refer to changing prompts, tools, memory, data, or model weights; say which one changes.

Keep the evaluator, held-out set, permissions, and promotion criteria outside the candidate's control. Otherwise it may improve the score by weakening the test. Use sandboxes, versioned experiments, bounded budgets, and rollback. Self-generated examples can amplify errors, and repeated test-set access can overfit the evaluation.

**Practice:** let a bounded script propose prompt variants for an offline extraction task. Evaluate on development data, select one candidate, and use the untouched final set once. Do not grant it authority to edit its grader or deploy itself.

### Other important specialization branches

| Branch | Additional prerequisites | First investigation |
| --- | --- | --- |
| Causal inference | Statistics, experiment design, causal graphs | Compare observational prediction with a randomized intervention; identify confounding. |
| Bayesian/probabilistic modeling | Probability, calculus, sampling | Fit a small posterior and check predictive uncertainty against a simple estimator. |
| Time-series forecasting | Time splits, seasonal structure | Compare seasonal-naive, statistical, and learned models with rolling evaluation. |
| Recommender systems | Ranking, matrix factorization, experiments | Evaluate cold start and feedback loops with time-aware splits. |
| Self-supervised and contrastive learning | Neural representations, sampling | Compare labeled-only training with representations learned from unlabeled data. |
| Active and continual learning | Evaluation under changing data | Choose informative labels and measure forgetting on earlier tasks. |
| Federated and private learning | Distributed systems, privacy accounting | Compare a central baseline with simulated client partitions; measure both quality and privacy assumptions. |
| Graph neural networks | Graph algorithms, neural networks | Predict node or graph labels while preventing edges from leaking test information. |

Use the [causal research lesson](../research/04-causal-and-reproducible-studies.md), [calibration/time lesson](../machine-learning/08-calibration-and-time.md), and [recommendation lesson](../machine-learning/06-clustering-and-recommendations.md) as bridges. These branches are a map of further study, not claims that a single introductory experiment completes the field.

## Mastery lab: distinguish improvement from selection

A new method wins on one seed and loses on four. Reporting only the winning seed answers “can I find a favorable run?” rather than “does the method improve the task?” Define the experimental unit, paired comparison, primary metric, and selection procedure before seeing the final evaluation.

```python runnable
baseline = [70, 72, 71, 73, 74]
candidate = [71, 71, 70, 72, 73]
differences = [b-a for a,b in zip(baseline,candidate)]
print(differences)
print(sum(differences)/len(differences))
print(max(differences))
```

```text output
[1, -1, -1, -1, -1]
-0.6
1
```

The best paired difference is positive, but the mean difference is negative. Five runs are a small illustration, not a universal sample-size rule. Independent data units and training seeds answer different uncertainty questions; document what you varied and what remained fixed.

### Implement a narrow mechanism in each advanced branch

For knowledge graphs, implement typed edges and a provenance-preserving query before adding a GNN; a graph database and a learned graph model solve different problems. For reinforcement learning, implement a tiny environment, Bellman target, and tabular update before deep policies. Distinguish termination from a time-limit truncation when bootstrapping. For robotics, model coordinates, sensing, control frequency, and actuator bounds before learned control.

For multimodal research, implement one alignment or fusion baseline and evaluate cross-modal failures. For causal inference, draw a causal graph and state the identification assumptions before estimating an effect. For continual or “self-improving” agents, keep candidate generation separate from promotion: a candidate must pass a reserved evaluation and authorized release process before changing deployed behavior.

### Debug, optimize, and build a defensible system

Start from a reproduced baseline. Change one meaningful component, hold resources comparable, and report ablations and negative results. If replication fails, compare preprocessing, splits, initialization, optimizer schedule, evaluation code, and compute budget before concluding that the claim is wrong.

Optimize experiments with small diagnostic runs, cached deterministic preprocessing, and explicit stopping criteria. Do not repeatedly inspect the held-out test and then call it held out. Keep a record of failed configurations so the reported result reflects the search, not only the winner.

A research system needs data/code/environment provenance, checkpoints, independent evaluation, and a clear boundary between experiments and deployed operation. Robotics experiments begin in simulation and controlled conditions with an appropriate safety design; successful simulation alone does not establish physical reliability.

**Interview defense:** “The new method beats the published number.” Ask whether datasets, splits, preprocessing, metrics, resource budgets, and tuning effort are comparable. Propose a matched baseline before attributing the difference to the method.

**Teach it:** show only the best difference above, ask for a conclusion, then reveal all runs. Have the learner design a fair follow-up study. Deliver a reproduction package, one falsifiable extension, paired results with uncertainty, an ablation, and an explanation that distinguishes evidence from speculation.

## Mini project and real-world use

Choose one: a graph-supported service dependency assistant, a simulated-control comparison, a multimodal robustness study, or a controlled prompt-improvement experiment. Form a narrow question and predeclare the comparison. Share runnable code, data instructions, results, and limitations.

Uses include scientific discovery, planning, industrial inspection, knowledge management, adaptive services, and simulation. Research output can be a well-supported negative result.

**Completion evidence:** reproduced baseline, one controlled extension, uncertainty analysis, an ablation, independent review, and a claim no stronger than the evidence.

## Interview questions

1. What distinguishes an ablation from changing several components at once?
2. Why does offline RL need assumptions beyond supervised train/test separation?
3. How do a knowledge graph, graph database, and GNN differ?
4. What can go wrong between simulator success and physical control?
5. Why must an improvement agent be unable to modify its own grader?
6. What result would make you reject your preferred research hypothesis?

## Curated resources

- **Courses:** [Stanford CS234](https://web.stanford.edu/class/cs234/) for RL, [CS224W](https://web.stanford.edu/class/cs224w/) for graph learning, and [MIT Underactuated Robotics](https://underactuated.mit.edu/) for control and robotics.
- **Books:** [Reinforcement Learning: An Introduction](https://mitpress.mit.edu/9780262039246/reinforcement-learning/), Sutton and Barto, and the [Underactuated Robotics text](https://underactuated.mit.edu/).
- **Papers:** [Knowledge Graphs](https://arxiv.org/abs/2003.02320) for graph foundations, [RT-2](https://arxiv.org/abs/2307.15818) for a vision-language-action research example, and [SWE-agent](https://arxiv.org/abs/2405.15793) for agent/environment interface research. None establishes unrestricted self-improvement.
- **GitHub:** [Gymnasium](https://github.com/Farama-Foundation/Gymnasium), [PyTorch Geometric](https://github.com/pyg-team/pytorch_geometric), and [MuJoCo](https://github.com/google-deepmind/mujoco), selected according to your branch.

**Previous:** [System design](18-system-design.md) · **Next:** choose your [portfolio capstone](portfolio.md) and [study plan](study-plans.md).
