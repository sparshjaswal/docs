---
title: "9. Prompt engineering and structured outputs"
sidebar_position: 9
---

# Prompt engineering and structured outputs

**Prerequisites:** [LLM behavior](08-llms.md), JSON, APIs, and evaluation. Complete the [worked prompting lesson](../generative-ai/02-prompts-and-structured-output.md).

## What it is and why it matters

A prompt supplies instructions and context at inference time. Good prompt engineering makes a task explicit and tests whether the resulting system behaves as intended. It is not a collection of magic phrases, and it does not replace permissions, evidence, or application logic.

## Learn in this order

### Zero-shot prompting

Zero-shot means providing the task without worked input/output examples. State the goal, allowed evidence, constraints, output contract, and what to do when information is missing. Separate trusted instructions from supplied documents. Start here because it is easier to inspect and cheaper to maintain.

**Practice:** classify a ticket into three defined categories. Write clear category boundaries and an “insufficient information” behavior before trying the model.

### Few-shot prompting

Few-shot prompting adds a small number of representative examples. Examples demonstrate desired behavior and boundary cases without updating weights. They consume context and can introduce accidental patterns, such as always choosing the final category.

Select examples from development data, not the final test set. Keep formatting consistent, vary superficial details, and include meaningful edge cases. More examples can help or distract; measure rather than assume.

**Practice:** compare zero-shot with two examples and six examples on the same reserved inputs. Include a case that contradicts a superficial pattern in your demonstrations.

### Chain-of-thought research and useful explanations

Chain-of-thought prompting research studies examples containing intermediate solution steps. It is useful background for understanding how prompting can affect multi-step tasks. A generated explanation can still be wrong or unrelated to the computation that produced the answer.

Do not treat requests for lengthy reasoning as a universal recommendation. For reasoning models, current [OpenAI guidance](https://developers.openai.com/api/docs/guides/reasoning-best-practices) favors clear goals and constraints over requiring a prescribed chain of thought. Ask for checkable calculations, cited evidence, concise justifications, or executable tests when those help the user. Evaluate the answer and observable work, not the length of an explanation.

**Practice:** compare direct answers with answers plus a short verification step on arithmetic or data-extraction cases. Score correctness and cost separately.

### ReAct: connect proposals to observations

ReAct research interleaves language-model decisions with actions and tool observations. At this stage, learn the distinction between proposing a lookup and receiving its result. A generated sentence saying “I searched” is not a search event.

The [agent module](13-ai-agents.md) later implements the control loop, authorization, and budgets. A prompt describing ReAct alone is not a secure agent runtime.

**Practice:** write a three-event trace: lookup proposed, tool result observed, supported answer returned. Replace the observation with an error and explain what should change.

### Structured outputs and context design

A structured output contract defines fields, types, required values, and allowed extras. JSON parsing checks syntax; schema validation checks structure; content evaluation checks meaning. Provider constrained-output features can help structure, but their supported schemas and failure handling are endpoint-specific. Consult the [official structured-output documentation](https://developers.openai.com/api/docs/guides/structured-outputs) for the chosen implementation.

Keep instructions, examples, retrieved evidence, and user input clearly separated. Budget context for the task and preserve source identifiers. Handle incomplete output, refusal, and service failure explicitly. A schema-valid action request still needs authorization.

**Practice:** reject unknown fields, wrong types, whitespace-only answers, and unsupported source IDs. Add a response with perfect structure but a reversed meaning, as in the core lesson.

## Mastery lab: a valid schema can still contain a wrong answer

Suppose a model extracts an invoice total. The output `{"amount": 120, "currency": "USD"}` may pass a schema while contradicting a source showing 102 EUR. Structural validation establishes shape; semantic validation compares the claim with evidence and business rules.

Build the validator independently of the model:

```python runnable
def validate(result, source):
    if set(result) != {"amount", "currency"}:
        return "schema"
    if type(result["amount"]) not in (int, float):
        return "schema"
    if result["currency"] != source["currency"]:
        return "currency"
    if result["amount"] != source["amount"]:
        return "amount"
    return "ok"
source = {"amount": 102, "currency": "EUR"}
print(validate({"amount": 120, "currency": "USD"}, source))
print(validate({"amount": 102, "currency": "EUR"}, source))
```

```text output
currency
ok
```

This fixture has authoritative structured source data; real extraction must first locate and interpret the evidence. Production money handling also needs an explicit decimal/minor-unit representation and rounding policy. Do not generalize the toy numeric equality to arbitrary floating-point amounts.

### Build a controlled prompt experiment

Compare zero-shot instructions with a few-shot variant using the same input cases and output contract. Keep examples separate from the reserved test set. Score valid structure, supported values, abstention, latency, and cost independently. Save the prompt version, model revision where available, generation settings, and evaluator version. Repeated runs reveal variability that a single screenshot hides.

Change one suspected cause at a time. If the model confuses subtotal and total, add a precise field definition and a counterexample, then test both similar and dissimilar invoices. Adding examples that exactly match the test set measures memorization of the evaluation.

### Debug, optimize, and design

For ReAct, separate model-proposed actions from tool execution and observations. The host validates tools and arguments; a convincing explanation is not authorization. For reasoning models, ask for concise verifiable outputs or evidence appropriate to the task rather than requiring a transcript of private internal reasoning.

Optimize by removing irrelevant context, using representative examples, narrowing the task, or choosing a less expensive model that passes the same evaluation. More instructions can conflict or obscure priority; prompt length is not quality.

**Production design:** keep the prompt and schema versioned, enforce output size and tool permissions outside the model, and handle refusal, truncation, parse failure, unsupported facts, and dependency failure as distinct states. Retries have a budget and should not turn an invalid proposal into an unreviewed action.

**Interview defense:** “The model always returns JSON; is the integration reliable?” Explain shape, meaning, authorization, and downstream effects as separate contracts. Give a test for each.

**Teach it:** show a structurally valid but factually wrong object. Ask a learner to identify which validator can detect which failure. Deliver a prompt ablation report, validator tests, a failure-state flow, and a short lesson on evidence versus fluency.

## Mini project and real-world use

Build a prompt evaluation harness for support-message extraction. Use 30 fictional or permitted messages with human-written expected behavior. Compare three prompt versions while keeping model configuration fixed. Save every raw result and failure category. Use repeated trials if outputs vary.

Uses include structured extraction, summarization, drafting, classification, and tool selection. For a simple fixed format, a parser or rule may be the better solution.

**Completion evidence:** versioned prompt, schema, development/final split, scorecard, regression examples, time/cost comparison, and a fallback. Scripted responses must be labeled fixture tests rather than live-model results.

## Interview questions

1. How do few-shot examples differ from fine-tuning?
2. Why can a longer prompt reduce quality?
3. Why is generated reasoning not proof of a correct result?
4. Which checks do parsing, schemas, and semantic evaluation provide?
5. How would you keep prompt experiments from contaminating the test set?

## Curated resources

- **Course:** [Full Stack LLM Bootcamp](https://fullstackdeeplearning.com/llm-bootcamp/spring-2023/), as conceptual background; use current API documentation for executable calls.
- **Book:** [AI Engineering](https://www.oreilly.com/library/view/ai-engineering/9781098166298/), Chip Huyen, for prompting as part of evaluated systems.
- **Papers:** [Chain-of-Thought Prompting](https://arxiv.org/abs/2201.11903) and [ReAct](https://arxiv.org/abs/2210.03629); compare their settings with your actual model.
- **GitHub:** [Promptfoo](https://github.com/promptfoo/promptfoo), for inspecting repeatable prompt evaluations and assertions.

**Previous:** [LLMs](08-llms.md) · **Next:** [Responsible AI](10-responsible-ai.md).
