+++
title = "Trees and Graphs"
weight = 2
date = "2026-04-29"
tags = ["dsa", "trees", "graphs"]
+++

Trees and graphs are the most common interview topics after arrays. Most tree problems reduce to DFS or BFS.

## Binary Tree Traversal

- **Inorder** (left, root, right): gives sorted output for BSTs
- **Preorder** (root, left, right): useful for serialisation
- **Postorder** (left, right, root): useful for deletion, computing subtree properties

```python
from dataclasses import dataclass
from typing import Optional

@dataclass
class Node:
    val: int
    left: Optional["Node"] = None
    right: Optional["Node"] = None

def inorder(root: Optional[Node]) -> list[int]:
    if root is None:
        return []
    return inorder(root.left) + [root.val] + inorder(root.right)

def dfs_preorder(root: Optional[Node]) -> list[int]:
    result: list[int] = []
    stack = [root] if root else []
    while stack:
        node = stack.pop()
        result.append(node.val)
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)
    return result
```

## DFS vs BFS

| | DFS | BFS |
|---|---|---|
| Data structure | Stack (or recursion) | Queue |
| Order | Deep before wide | Level by level |
| Space | O(h) — tree height | O(w) — max width |
| Use cases | Path finding, cycle detection, topological sort | Shortest path (unweighted), level-order traversal |

> DFS naturally recurses — the call stack is your explicit stack. For BFS, always use an explicit queue (`collections.deque`).

```python
from collections import deque

def bfs(root: Optional[Node]) -> list[list[int]]:
    if not root:
        return []
    result, queue = [], deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left:  queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
    return result
```

## Binary Search Tree Properties

A BST's inorder traversal is sorted. Lookup, insert, and delete are O(log n) average, O(n) worst-case (degenerate tree). Balanced BSTs (AVL, Red-Black) guarantee O(log n) worst-case.

### Validating a BST

A common mistake is checking only the immediate parent. The correct approach passes valid ranges down:

```python
def is_valid_bst(
    node: Optional[Node],
    lo: float = float("-inf"),
    hi: float = float("inf")
) -> bool:
    if node is None:
        return True
    if not (lo < node.val < hi):
        return False
    return (is_valid_bst(node.left, lo, node.val) and
            is_valid_bst(node.right, node.val, hi))
```

## Graph patterns

| Pattern | Algorithm | Complexity |
|---|---|---|
| Shortest path (unweighted) | BFS | O(V + E) |
| Shortest path (weighted) | Dijkstra | O((V + E) log V) |
| Cycle detection (directed) | DFS with colour marking | O(V + E) |
| Topological sort | DFS postorder / Kahn's | O(V + E) |
| Connected components | Union-Find or BFS/DFS | O(V + E) |

For most graph interview problems, the pattern is: build an adjacency list, mark visited nodes, then DFS or BFS.
