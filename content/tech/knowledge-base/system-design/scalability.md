+++
title = "Scalability"
weight = 1
date = "2026-04-29"
tags = ["system-design", "scalability"]
+++

Scalability is the ability to handle increased load without proportional increases in resources or degraded performance.

![Layered architecture](/diagrams/system-design-layers.svg)

## Vertical vs Horizontal Scaling

Vertical scaling adds capacity to a single machine (more CPU, RAM). Simple but has a ceiling and single point of failure. Horizontal scaling adds more machines. More complex — requires load balancing and stateless services — but scales without bound.

| Dimension | Vertical | Horizontal |
|---|---|---|
| Complexity | Low | High |
| Cost | Expensive per unit | Cheaper at scale |
| Ceiling | Physical hardware limit | Effectively unlimited |
| Failure mode | Single point of failure | Graceful degradation |
| State management | Simple | Requires external session store |

> Start with vertical scaling. It's simpler and fast enough for most early-stage systems. Switch to horizontal when you hit limits or need redundancy.

## Stateless Services

Horizontal scaling requires stateless application servers. Move session state to a shared store (Redis, a database). Any instance can handle any request.

Stateful architecture (bad for horizontal scale):

```
User A → always routed to Server 1 (sticky sessions)
User B → always routed to Server 2
If Server 1 dies → User A's session is lost
```

Stateless architecture (correct):

```
User A → any server, session state read from Redis
If a server dies → next request routes to another; session intact
```

## Caching

Serving from cache dramatically reduces database load. Layer caches at each level:

- **CDN** — static assets (images, JS, CSS), global distribution
- **Application cache** — computed results stored in Redis or Memcached; typical TTL 1–60 min
- **Database query cache** — expensive aggregations stored at the ORM or database layer

Cache invalidation is the hard part. Strategies:

1. **TTL-based** — cache expires after a fixed time. Simple; tolerates stale data.
2. **Write-through** — update cache on every write. Keeps cache fresh; adds write latency.
3. **Cache-aside** — application checks cache first, falls back to DB, populates cache. Most common.

## Load Balancing

A load balancer distributes incoming requests across multiple servers. Algorithms:

- **Round robin** — distribute evenly in sequence. Works when servers are uniform.
- **Least connections** — route to the server with the fewest active connections. Better for variable request durations.
- **IP hash** — route same IP to same server. Useful when session stickiness is needed but moving state is not yet feasible.

## Measuring scalability

The goal of scalability work is not to add complexity — it is to maintain a specific SLA under increased load. Define the SLA first:

- P99 latency < 200ms
- Error rate < 0.1%
- Availability > 99.9%

Then load-test until the SLA breaks. Fix the bottleneck. Repeat.
