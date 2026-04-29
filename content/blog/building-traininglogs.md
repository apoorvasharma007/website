+++
title = "Building traininglogs: A Python Pipeline for My Gym Data"
date = 2026-04-02T09:00:00Z
tags = ["tech", "fitness"]
summary = "How and why I built a parser that turns my messy training notes into structured JSON."
+++

For years I kept training logs in a notes app — freeform text, inconsistent formatting, impossible to query. I wanted to fix this without switching to an app I did not control.

The solution: write a parser that takes my existing format and outputs structured JSON. That is traininglogs.

## The problem with training data

Most fitness apps are opinionated about how you should log. They give you dropdowns and fields. I do not train like that — I write notes while I am resting between sets, and the format drifts based on how tired I am.

I needed a system that was tolerant of my input format but strict about its output.

## The architecture

The pipeline has three stages:

1. **Intake** — parse freeform markdown into a rough intermediate representation
2. **Model** — validate and type the data into Python dataclasses (`TrainingSession`, `Exercise`, `WorkingSet`)
3. **Persistence** — serialise to a canonical JSON schema and write to storage

The dataclass layer is the most important piece. Every field has a type, every serialisation has a defined key name, and invalid data raises a `TrainingLogValidationError` rather than silently passing through.

## The AI layer

I added an agent layer that lets me describe a session in natural language and have it structured automatically. This is the part I am still iterating on — getting the prompts tight enough that the output is reliable without needing manual correction.

## What I learned

Boring infrastructure matters more than the interesting parts. The parser is fine. The schema is fine. What actually makes the project useful is the fact that the serialisation contract is strictly defined and versioned. Without that, any downstream tool breaks when the format drifts.

The code is on [GitHub](https://github.com/apoorvasharma7/traininglogs).
