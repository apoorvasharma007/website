+++
title = "Evaluating AI Systems"
weight = 3
date = "2026-04-29"
tags = ["ai", "evaluation", "testing"]
+++

Evaluation is the hardest part of building AI systems. Without it, you cannot tell whether a change to your prompt, retrieval, or model improved anything.

## Why evaluation is hard

Unlike traditional software, AI systems don't have deterministic outputs. A change that improves one output may degrade another. Evaluation must:

- Cover a representative sample of the input distribution
- Measure what actually matters to users (not just perplexity or BLEU)
- Be fast enough to run on every change

> You can't improve what you don't measure. Build your eval harness before you start tuning.

## Offline vs Online Evaluation

| | Offline | Online |
|---|---|---|
| When | Before deployment | After deployment |
| Data source | Curated test set | Real user traffic |
| Speed | Fast | Slow (requires traffic) |
| Risk | None | Affects real users |
| Signal | Leading indicator | Ground truth |

Use offline evaluation to iterate quickly. Use online evaluation (A/B tests, shadow mode) to confirm offline gains hold in production.

## Evaluation methods

### Reference-based

Compare model output to a gold-standard answer. Useful when there is a clear correct answer.

```python
def exact_match(prediction: str, reference: str) -> float:
    return float(prediction.strip() == reference.strip())

def f1_token_overlap(prediction: str, reference: str) -> float:
    pred_tokens = set(prediction.lower().split())
    ref_tokens = set(reference.lower().split())
    if not pred_tokens or not ref_tokens:
        return 0.0
    common = pred_tokens & ref_tokens
    precision = len(common) / len(pred_tokens)
    recall = len(common) / len(ref_tokens)
    if precision + recall == 0:
        return 0.0
    return 2 * precision * recall / (precision + recall)
```

### LLM-as-judge

Use a stronger model to score the output of a weaker model. Scales better than human evaluation and is more nuanced than reference-based metrics.

```
Judge prompt:
Rate the following answer on a scale of 1–5 for:
- Accuracy (does it correctly answer the question?)
- Completeness (does it cover all relevant points?)
- Conciseness (is it appropriately brief?)

Question: {question}
Reference answer: {reference}
Model answer: {prediction}

Return JSON: {"accuracy": N, "completeness": N, "conciseness": N, "reasoning": "..."}
```

LLM judges have known biases: preference for longer answers, position bias, self-preference. Mitigate by averaging across multiple judge runs and using calibration examples.

### Task-specific metrics

| Task | Metrics |
|---|---|
| RAG / QA | Answer correctness, context recall, context precision |
| Summarisation | ROUGE, BERTScore, factual consistency |
| Code generation | Execution accuracy, test pass rate |
| Classification | Accuracy, F1, confusion matrix |
| Chatbot | User satisfaction, session length, deflection rate |

## Building a test set

A good test set is:

- **Representative** — covers the real distribution of user queries, including edge cases
- **Challenging** — easy examples don't differentiate models
- **Stable** — doesn't change between runs (use a fixed seed for sampling)
- **Labelled** — each example has a ground-truth answer or criteria

Start with 50–100 examples. This is enough to detect regressions on most tasks. Scale up when you need finer discrimination between similar models.

### Adversarial examples

Include cases that are known to fail or are particularly hard:

- Queries outside the knowledge base (expected: "I don't know")
- Ambiguous questions with multiple valid answers
- Questions requiring multi-hop reasoning
- Prompt injection attempts
