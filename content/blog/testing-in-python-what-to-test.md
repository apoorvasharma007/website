+++
title = "Testing in Python: What to Test and What to Skip"
date = 2026-03-15T10:00:00Z
tags = ["tech", "python", "testing"]
summary = "Not everything needs a test. Understanding the difference is what makes a test suite useful rather than expensive."
+++

The worst test suites I have seen share a characteristic: they test everything, and as a result nobody trusts them. Hundreds of tests that mock every dependency, make no assertions about real behaviour, and break every time an internal implementation detail changes.

Good testing is about what to test, not how much to test.

## Test the boundaries, not the internals

Unit tests should test the public interface of a module, not its implementation. If you refactor a function and your tests break even though the outputs are identical, your tests are testing the wrong thing.

```python
# Bad: tests internals
def test_helper_splits_correctly():
    result = _split_log_line("2026-01-01 Squat 100kg")
    assert result == ["2026-01-01", "Squat", "100kg"]

# Good: tests the public contract
def test_parse_log_entry_returns_correct_exercise():
    entry = parse_log_entry("2026-01-01 Squat 100kg x 5")
    assert entry.exercise_name == "Squat"
    assert entry.weight_kg == 100
    assert entry.reps == 5
```

## Test validation thoroughly

Validation code — the code that rejects bad inputs — is worth testing exhaustively. Every validation rule should have at least one passing test and one failing test.

```python
def test_weight_must_be_positive():
    with pytest.raises(ValidationError):
        WorkingSet(set_number=1, weight_kg=-5, reps=5)
```

## Integration tests over mocks where possible

Mocks test that you called something, not that it worked. Where you can run a real integration — against a real database, a real file system, a real subprocess — prefer it. The cost is slower tests. The benefit is confidence that the system actually works.

For things that are genuinely expensive or external (payment APIs, email), mock. For everything else, consider running real.

## What to skip

- Tests for getters and setters with no logic
- Tests that are longer and more complex than the code they test
- Tests for code that will be deleted in a week

The question for every test: if this breaks, do I want to know? If the answer is no, skip it.
