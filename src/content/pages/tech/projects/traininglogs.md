---
title: "traininglogs"
side: "tech"
type: "Project"
order: 1
description: "A Python pipeline that parses free-text training session logs into a structured NoSQL/JSON schema. Includes dataclass models, a CLI, and an agent layer for AI-assisted log intake."
date: "2026-10-13"
sourceUrl: "https://github.com/apoorvasharma007/traininglogs"
docsUrl: "https://apoorvasharma007.github.io/traininglogs/design.html"
liveUrl: "https://apoorvasharma007.github.io/traininglogs/"
---

## What It Does

It takes my freeform training notes and turns them into structured, validated sessions. The parser is tolerant of how I write and strict about what it outputs.

1. **Intake.** Parse freeform markdown into a rough intermediate representation.
2. **Model.** Validate and type the data into Python dataclasses such as `TrainingSession`, `Exercise` and `WorkingSet`.
3. **Persistence.** Serialise to a canonical JSON schema and write to storage.

## Why I Built It

For years I kept training logs in a notes app. They were freeform text with inconsistent formatting, impossible to query. I wanted to fix this without switching to an app I did not control.
