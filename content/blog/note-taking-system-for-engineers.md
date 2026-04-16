+++
title = "A Note-Taking System That Actually Works for Engineers"
date = 2026-03-01T09:30:00Z
tags = ["productivity", "systems", "engineering"]
summary = "Most note-taking systems fail because they optimise for capture, not retrieval. Here is what I do instead."
+++

I have tried most of the popular note-taking systems. What I have found: the problem is almost never capture. People take notes. The problem is retrieval — finding the right note when you need it, two months later, when you cannot remember what you titled it.

## The failure mode

Complex hierarchical folder structures look organised and become useless. The problem is that you have to decide, at capture time, where something belongs. That decision is hard to make correctly because you do not yet know how you will need to retrieve it.

## What actually works

**Flat structure with good search.** One folder. No subfolders. Title notes specifically enough that search surfaces the right one. "Python - filtering dicts while preserving order" beats "Python notes".

**Date-stamped daily notes for ephemeral stuff.** Things that do not need to be retrieved later — meeting notes, daily tasks, scratch thinking — go in a daily note. These are searchable if needed but not meant to be organised.

**Atomic permanent notes for things worth keeping.** If something is worth thinking about again, it gets its own note with a specific title, a summary of the insight in my own words, and links to related notes. Not too many of these — the bar for permanence should be high.

**Tags for cross-cutting concerns.** I use a small number of tags: `#cloud`, `#training`, `#python`, `#architecture`, `#reading`. These are orthogonal to the title and let me surface notes across different topics.

## The tools do not matter much

I use plain markdown files in a single directory, version-controlled with git. Obsidian is a good GUI for this if you prefer one. The principles above work in any tool.

The trap is spending time optimising the system rather than using it. A mediocre system used consistently is more valuable than a perfect system you are still designing.
