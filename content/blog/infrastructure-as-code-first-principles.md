+++
title = "Infrastructure as Code: First Principles"
date = 2025-11-05T09:00:00Z
tags = ["tech", "cloud", "devops", "iac"]
summary = "Why IaC is not just about automation, and the principles that make it actually work."
+++

Infrastructure as Code is often sold as a productivity tool — write code, spin up servers faster. That framing is correct but incomplete. The real value is reproducibility and auditability, not speed.

## The actual problem IaC solves

Manual infrastructure has two failure modes. First, configuration drift — resources change over time and the actual state diverges from what you think it is. Second, undocumented dependencies — someone added a security group rule six months ago and nobody knows why it is there.

IaC solves both by making infrastructure declarative and version-controlled. The state lives in code. The history lives in git.

## Principles I follow

**Idempotency above all.** Every apply should produce the same result regardless of how many times you run it. If your scripts are not idempotent, they are not IaC — they are shell scripts with extra steps.

**Keep state remote and locked.** Local state files are how teams collide. Use remote state with locking from day one. The cost is near zero; the benefit is avoiding corrupted state at 2am.

**Separate environments via workspaces or directories, not variables.** A single root module with an `environment` variable is a footgun. Separate modules or directories make prod/staging/dev genuinely isolated.

**Treat modules as APIs.** A module's inputs and outputs are its contract. Changing a module's interface is a breaking change. Version your modules.

## The thing nobody tells you

The hard part of IaC is not writing the code — it is keeping it in sync with reality when engineers make manual changes in a hurry. The discipline required is cultural, not technical. Without it, you end up with a codebase that documents what infrastructure looked like at initial deployment and nothing more.

The fix is to treat out-of-band changes as bugs and fix them before they accumulate.
