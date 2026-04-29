+++
title = "What I Learned Deploying on Azure for the First Time"
date = 2026-03-10T10:00:00Z
tags = ["tech", "devops"]
summary = "Notes from my first production deployment on Azure — what surprised me, what tripped me up, and what I would do differently."
+++

I recently shipped a project to Azure for the first time after spending years on AWS. Here are the things that surprised me.

## The portal is more usable than I expected

AWS has trained me to live in the CLI. Azure's portal is actually well-designed for exploration — especially when you are trying to understand how resources relate to each other. I still prefer Infrastructure as Code for anything repeatable, but the portal is useful for learning the topology.

## Resource groups are a genuinely good idea

Everything goes in a resource group. You can delete a resource group and everything inside it disappears cleanly. No hunting for orphaned security groups or forgotten load balancers. This is one of those small decisions that makes operations much less painful over time.

## Managed identities are the right default

Stop putting secrets in environment variables. Azure Managed Identities let your compute access other Azure resources — Key Vault, Storage, databases — without credentials. The SDK picks it up automatically. Use this from day one.

## The pricing calculator is honest

I found Azure's pricing estimates to be more accurate than AWS's. The cost analysis in the portal is also genuinely useful after deployment — not perfect, but good enough to catch surprises early.

The overall experience was smoother than I expected. The main friction was learning the naming conventions (everything is slightly different from AWS) rather than anything fundamental.
