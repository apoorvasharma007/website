+++
title = "Prompting"
weight = 1
date = "2026-04-29"
tags = ["ai", "prompting"]
+++

Prompting is the primary interface for directing language model behaviour. The quality of the prompt determines the quality of the output.

## Be Specific

Vague prompts produce vague responses. State the format, length, audience, and constraints explicitly.

| Vague | Specific |
|---|---|
| "Write a summary" | "Summarise in 3 bullet points for a non-technical audience" |
| "Improve this code" | "Refactor this Python function for readability; no logic changes" |
| "Write a blog post" | "Write a 500-word post for senior engineers on X, technical tone, no intro fluff" |

> The model will fill gaps in your prompt with its default assumptions. If the defaults don't match what you want, specify explicitly.

## Role and Context

Models respond to role framing. Telling the model it is a senior engineer, a sceptical reviewer, or a technical writer shapes the style and depth of the response.

```
System: You are a senior backend engineer reviewing a pull request.
        Identify correctness issues, performance risks, and missing tests.
        Be direct. No praise unless there is something genuinely good.

User: [paste PR diff]
```

Context that helps the model:
- Audience (who will read the output)
- Purpose (what the output will be used for)
- Constraints (length, format, what to avoid)
- Background (prior decisions, related code, domain context)

## Few-Shot Examples

Providing 2–3 examples of the desired input-output format dramatically improves consistency. Especially useful for structured outputs (JSON, tables) and tone matching.

```
Extract the action items from each note. Return JSON.

Note: "Call Sarah about the Q3 budget by Friday."
Action items: [{"task": "Call Sarah about Q3 budget", "deadline": "Friday", "owner": "user"}]

Note: "Send the design mockup to the client and schedule a review."
Action items: [{"task": "Send design mockup to client", "deadline": null, "owner": "user"},
               {"task": "Schedule design review", "deadline": null, "owner": "user"}]

Note: [your note here]
Action items:
```

## Chain-of-Thought

For reasoning tasks, instruct the model to think step by step before answering. This reduces errors on multi-step problems.

```
Solve this problem. Think through each step before giving the final answer.
```

Chain-of-thought helps most on:
- Arithmetic and logic puzzles
- Multi-condition reasoning ("if A and B but not C...")
- Code debugging and root-cause analysis

## Prompt structure for reliability

For production prompts where consistency matters:

```
[Role / persona]
[Task description]
[Constraints and format]
[Examples if needed]
[Input: {variable}]
[Output:]
```

Keep the variable input clearly delimited (XML tags, triple backticks, or labelled sections) so the model doesn't confuse instructions with input data.
