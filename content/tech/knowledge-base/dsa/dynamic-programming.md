+++
title = "Dynamic Programming"
weight = 3
date = "2026-04-29"
+++

Dynamic programming solves problems by breaking them into overlapping subproblems and storing solutions to avoid recomputation. It applies when a problem has **optimal substructure** and **overlapping subproblems**.

## Recognising DP problems

A problem is likely DP if:

- It asks for a count, maximum, minimum, or boolean feasibility
- It involves making choices at each step (include/exclude, left/right)
- A recursive brute-force solution has exponential time due to repeated subproblems

> If you can write a brute-force recursion, you're 80% of the way to a DP solution. Add memoization and you have top-down DP. Flip the recursion to iteration and you have bottom-up DP.

## Top-Down (Memoization)

Write the recursion naturally. Cache results in a dictionary.

```python
# Fibonacci — O(n) with memoization vs O(2^n) without
from functools import cache

@cache
def fib(n: int) -> int:
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)
```

## Bottom-Up (Tabulation)

Build up the solution iteratively from base cases.

```python
def fib(n: int) -> int:
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]

# Space-optimised: O(1) space
def fib_opt(n: int) -> int:
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
```

## Classic patterns

### 0/1 Knapsack

Choose items to maximise value without exceeding weight capacity. Each item can be taken at most once.

```python
def knapsack(weights: list[int], values: list[int], capacity: int) -> int:
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            dp[i][w] = dp[i-1][w]
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i][w], dp[i-1][w - weights[i-1]] + values[i-1])
    return dp[n][capacity]
```

### Longest Common Subsequence (LCS)

A string DP template used in diff tools, plagiarism detection, and DNA alignment.

```python
def lcs(s1: str, s2: str) -> int:
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]
```

## Complexity

| Problem | Time | Space |
|---|---|---|
| Fibonacci | O(n) | O(n) → O(1) optimised |
| Knapsack | O(n × W) | O(n × W) → O(W) optimised |
| LCS | O(m × n) | O(m × n) → O(n) optimised |
| Coin change | O(amount × coins) | O(amount) |
| Edit distance | O(m × n) | O(m × n) |

Space optimisation in 2D DP: if each row depends only on the previous row, you can reduce from O(m × n) to O(n) by keeping two rows (or one, with careful ordering).
