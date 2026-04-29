+++
title = "Arrays and Hashing"
weight = 1
date = "2026-04-29"
tags = ["dsa", "arrays"]
+++

Arrays are contiguous memory blocks with O(1) random access. Hash maps provide O(1) average-case lookups by key.

## Complexity reference

| Operation | Array | Hash map |
|---|---|---|
| Access by index | O(1) | — |
| Search (unsorted) | O(n) | — |
| Search (sorted) | O(log n) | — |
| Lookup by key | — | O(1) avg |
| Insert | O(n) (shift) | O(1) avg |
| Delete | O(n) (shift) | O(1) avg |

## When to Use a Hash Map

Whenever a problem asks you to count, group, or look up elements in O(1). Two-sum, group anagrams, and frequency counts are classic examples.

```python
# Two Sum — O(n) with hash map, O(n²) with nested loops
def two_sum(nums: list[int], target: int) -> list[int]:
    seen: dict[int, int] = {}
    for i, n in enumerate(nums):
        complement = target - n
        if complement in seen:
            return [seen[complement], i]
        seen[n] = i
    return []
```

> If the brute force is O(n²) with nested loops, ask yourself: "Can a hash map give me O(1) lookup and turn this into O(n)?" It often can.

## Two-Pointer Technique

Two pointers moving toward each other or in the same direction can reduce O(n²) brute force to O(n). Useful for sorted arrays: pair sum, container with most water, trapping rain water.

```python
# Pair sum in sorted array
def pair_sum(nums: list[int], target: int) -> tuple[int, int] | None:
    left, right = 0, len(nums) - 1
    while left < right:
        s = nums[left] + nums[right]
        if s == target:
            return (left, right)
        elif s < target:
            left += 1
        else:
            right -= 1
    return None
```

Two-pointer works on sorted arrays. If the array isn't sorted, either sort first (O(n log n)) or use a hash map.

## Sliding Window

Maintain a window of elements and slide it across the array. Avoids recomputing the window from scratch each step — useful for maximum subarray sum, longest substring problems.

```python
# Maximum sum of k consecutive elements — O(n)
def max_subarray_sum(nums: list[int], k: int) -> int:
    window_sum = sum(nums[:k])
    best = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        best = max(best, window_sum)
    return best
```

### Variable-size sliding window

When the window size isn't fixed (e.g., longest substring without repeating characters), expand the right pointer and shrink the left pointer when a constraint is violated.

## Prefix sums

Precompute cumulative sums to answer range sum queries in O(1) after O(n) preprocessing:

```python
def build_prefix(nums: list[int]) -> list[int]:
    prefix = [0] * (len(nums) + 1)
    for i, n in enumerate(nums):
        prefix[i + 1] = prefix[i] + n
    return prefix

# Range sum [l, r] inclusive
def range_sum(prefix: list[int], l: int, r: int) -> int:
    return prefix[r + 1] - prefix[l]
```

Prefix sums are worth recognising as a pattern: any time you need repeated range queries over a static array.
