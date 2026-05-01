+++
title = "Databases"
weight = 2
date = "2026-04-29"
+++

Choosing and designing database systems is one of the most consequential decisions in system design.

## Relational vs Non-Relational

Relational databases (Postgres, MySQL) give you ACID guarantees, joins, and a mature query language. Use them unless you have a specific reason not to. Non-relational databases (MongoDB, DynamoDB, Cassandra) trade consistency or query flexibility for scale, flexibility of schema, or specific access patterns.

| Property | Relational | Non-relational |
|---|---|---|
| Schema | Fixed, enforced | Flexible |
| Consistency | Strong (ACID) | Often eventual |
| Query flexibility | High (SQL joins) | Limited to access patterns |
| Scale model | Vertical + read replicas | Horizontal sharding |
| Best for | Complex queries, transactions | High write throughput, known access patterns |

> Default to Postgres. It handles relational workloads, has JSON support for flexible schemas, and scales to hundreds of millions of rows without sharding.

## Replication

Read replicas offload read traffic from the primary. Most applications are read-heavy, so a single primary with 2–3 read replicas handles a large multiple of the load a single node could manage.

Replication types:

- **Synchronous** — write confirmed only after replica acknowledges. Strong consistency; higher write latency.
- **Asynchronous** — write confirmed at primary; replica catches up in background. Lower write latency; slight risk of replica lag.

### Replication lag

Async replicas may be seconds behind the primary. This matters when a user writes data and immediately reads it back — they may read stale data from a replica. The solution: route post-write reads to the primary for a short window, or use synchronous replication for critical writes.

## Indexing

An index makes reads fast and writes slightly slower. Add an index on any column you filter or sort by frequently. Over-indexing slows writes and bloats storage; under-indexing causes table scans.

Common index types:

- **B-tree** — default in most databases. Good for equality and range queries.
- **Hash** — equality lookups only. Faster than B-tree for pure equality, can't do ranges.
- **GIN/GiST** — full-text search, JSONB queries, array containment in Postgres.

```sql
-- Slow without index (table scan)
SELECT * FROM users WHERE email = 'user@example.com';

-- Add index once, fast forever
CREATE INDEX idx_users_email ON users(email);
```

### Composite indexes

A composite index on `(user_id, created_at)` satisfies queries filtering on `user_id` alone, or `user_id AND created_at` — but not `created_at` alone. Column order matters: put the highest-selectivity column first.

## Sharding

Sharding splits data across multiple database nodes by a partition key. Used when a single node can no longer hold all the data or handle write throughput.

Complexity introduced by sharding:

- Cross-shard queries require scatter-gather
- Transactions spanning shards lose single-node ACID guarantees
- Re-sharding is painful and operationally risky

Defer sharding as long as possible. Postgres on modern hardware handles tens of millions of rows per table without issue. Premature sharding is one of the most expensive architectural mistakes in systems design.
