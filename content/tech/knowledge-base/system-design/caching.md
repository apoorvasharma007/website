+++
title = "Caching Strategies"
weight = 3
date = "2026-04-29"
+++

Caching is one of the highest-leverage performance interventions in distributed systems. A well-placed cache can reduce database load by 90% and cut latency by an order of magnitude.

## Cache-Aside (Lazy Loading)

The application checks the cache first. On a miss, it fetches from the database and populates the cache.

```python
def get_user(user_id: int) -> dict:
    key = f"user:{user_id}"
    cached = redis.get(key)
    if cached:
        return json.loads(cached)

    user = db.query("SELECT * FROM users WHERE id = %s", user_id)
    redis.setex(key, 3600, json.dumps(user))  # TTL: 1 hour
    return user
```

**Pros:** Only caches data that is actually read. Cache failure doesn't break the system.

**Cons:** Cold start latency (first request always hits DB). Risk of stale data after writes.

> Cache-aside is the right default for most read-heavy workloads. Implement it first; add complexity only when the access pattern demands it.

## Write-Through

Every write to the database also updates the cache synchronously.

```python
def update_user(user_id: int, data: dict) -> None:
    db.execute("UPDATE users SET ... WHERE id = %s", user_id)
    key = f"user:{user_id}"
    redis.setex(key, 3600, json.dumps(data))
```

**Pros:** Cache is always consistent with the database.

**Cons:** Every write hits the cache regardless of read frequency. Unused data occupies cache memory.

## Write-Behind (Write-Back)

Writes go to cache immediately and are flushed to the database asynchronously.

**Pros:** Very low write latency.

**Cons:** Risk of data loss if the cache node fails before the write is persisted. Complex to implement correctly.

Use write-behind only when write latency is the bottleneck and you have acceptable durability tradeoffs (e.g., analytics counters, view counts).

## Cache Eviction Policies

When the cache is full, the eviction policy determines what gets removed:

| Policy | Description | Use case |
|---|---|---|
| LRU (Least Recently Used) | Evict the item not accessed longest | General purpose |
| LFU (Least Frequently Used) | Evict the item accessed least often | Hot/cold data patterns |
| TTL | Expire items after a fixed time | All caches — set as a safety net |
| FIFO | Evict oldest item regardless of access | Simple queues |

LRU is the Redis default and a good choice for most workloads.

## Cache sizing and TTL

### Sizing

Cache memory should hold the "hot set" — the data accessed by the top 80–90% of requests. For most applications this is a small fraction of total data. Start with a cache large enough to hold 20–30% of your most-read dataset and observe hit rates.

A hit rate below 80% suggests the cache is too small or the access pattern is too random to benefit from caching.

### TTL selection

| Data type | Suggested TTL |
|---|---|
| User session | 30 min – 2 hours |
| User profile | 1–24 hours |
| Product catalogue | 1–12 hours |
| Real-time metrics | 1–60 seconds |
| Static config | 24 hours + |

Set a TTL on every cached key. A cache without TTLs eventually fills with stale data.

## Cache stampede

When a popular cache key expires, many concurrent requests can simultaneously miss the cache and hammer the database. Prevention strategies:

- **Mutex/lock** — first request acquires a lock, fetches from DB, populates cache; others wait
- **Probabilistic early expiration** — refresh the cache before TTL expires with some probability as the expiry approaches
- **Background refresh** — a separate process refreshes popular keys before they expire
