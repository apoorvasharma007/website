+++
title = "Python Dataclasses for Domain Models"
date = 2025-12-02T10:00:00Z
tags = ["tech", "python", "architecture"]
summary = "Why I use dataclasses over dicts for domain objects, and the patterns that make them maintainable."
+++

Early in a project it is tempting to pass dicts around. They are flexible, fast to write, and require no upfront design. Then the project grows and you spend your time debugging `KeyError` and wondering what shape a particular dict is supposed to have.

Dataclasses fix this. They give you typed fields, default values, and `__repr__` for free, without the overhead of a full ORM or schema library.

## The basic pattern

```python
from dataclasses import dataclass, field
from typing import Optional

@dataclass
class WorkingSet:
    set_number: int
    weight_kg: float
    reps: int
    rpe: Optional[float] = None
```

Now every working set in your system has a known shape. The type checker can help you. Your editor can autocomplete fields. Errors appear at construction time, not deep in a call stack.

## Validation in `__post_init__`

Dataclasses have a `__post_init__` hook that runs after `__init__`. Use it for validation:

```python
def __post_init__(self):
    if self.rpe is not None and not (1 <= self.rpe <= 10):
        raise ValueError(f"RPE must be 1-10, got {self.rpe}")
    if self.weight_kg <= 0:
        raise ValueError("weight_kg must be positive")
```

Now invalid objects cannot be constructed. You catch mistakes at the boundary, not in the middle of your business logic.

## Serialisation

The standard `asdict()` from `dataclasses` gives you a dict recursively. For custom serialisation (e.g. camelCase JSON keys), a `to_dict()` method is worth writing explicitly:

```python
def to_dict(self) -> dict:
    d = {
        "set": self.set_number,
        "weightKg": self.weight_kg,
        "repCount": self.reps,
    }
    if self.rpe is not None:
        d["rpe"] = self.rpe
    return d
```

Explicit is better than automatic here because your serialisation contract is part of your public API. You want it to be intentional.

## When to use something else

Dataclasses are not always the answer. If you need runtime schema validation from untrusted input (APIs, user uploads), reach for Pydantic instead. If you need SQL persistence, an ORM model makes more sense. Dataclasses sit in the middle: structured, lightweight, no external dependencies.
