# Coding Test Preparation

A staged roadmap for coding interview rounds. Topics are split into three levels so you can ramp efficiently; this document focuses on the **Basic** stage first.

## Stage Map

| Stage | Focus | Typical Problems |
|-------|-------|------------------|
| Basic | Syntax, complexity, arrays/strings, hashing, two pointers, sliding window, stacks/queues, recursion basics, binary search, simple math/bit tricks | Two Sum, Valid Parentheses, Binary Search, Max Sum Subarray, Single Number |
| Standard | Trees/graphs fundamentals, traversal patterns (BFS/DFS), recursion/backtracking patterns, greedy checks, sorting/partitioning, set/map utilities | Level Order Traversal, Top-K Elements, Merge Intervals, Subsets/Permutations |
| Advanced | Dynamic programming on sequences/grids, advanced graph algorithms (Dijkstra/Union-Find), segment/fenwick trees, string algorithms (KMP/trie), optimization trade-offs | Longest Increasing Subsequence, Shortest Path, Kruskal/Prim, Suffix Array/Trie tasks |

## Basic Stage Deep Dive

### 1) Complexity, Inputs, and Guardrails
- Confirm constraints (size, value ranges, time limit) before choosing an approach.
- Prefer `O(n)` scans; use `O(log n)` only when data is already sorted/searchable.
- Handle empty/single-element inputs and invalid parameters early.

### 2) Arrays, Hash Maps, and Two-Sum Pattern
Use a hash map to track what you have seen while scanning once.

**Pseudo**
```pseudo
seen = empty map
for i, num in enumerate(nums):
  complement = target - num
  if complement in seen:
    return [seen[complement], i]
  seen[num] = i
return [-1, -1]  # not found
```

**Python**
```python
from typing import List

def two_sum(nums: List[int], target: int) -> List[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return [-1, -1]
```

### 3) Binary Search (Sorted Data)
Binary search is the backbone for any ordered data lookup.

**Pseudo**
```pseudo
lo, hi = 0, len(arr) - 1
while lo <= hi:
  mid = (lo + hi) // 2
  if arr[mid] == target: return mid
  if arr[mid] < target: lo = mid + 1
  else: hi = mid - 1
return -1
```

**Python**
```python
from typing import List

def binary_search(arr: List[int], target: int) -> int:
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        if arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
```

### 4) Sliding Window (Fixed Size)
Efficiently aggregate contiguous ranges without rescanning everything.

**Pseudo**
```pseudo
window_sum = sum(first k elements)
best = window_sum
for i from k to n-1:
  window_sum += arr[i] - arr[i - k]
  best = max(best, window_sum)
return best
```

**Python**
```python
from typing import List

def max_sum_subarray(arr: List[int], k: int) -> int:
    if k <= 0 or k > len(arr):
        return 0
    window_sum = sum(arr[:k])
    best = window_sum
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        best = max(best, window_sum)
    return best
```

### 5) Stacks for Balanced Symbols
Stacks catch order-sensitive validations such as parentheses.

**Pseudo**
```pseudo
pairs = {')':'(', ']':'[', '}':'{'}
stack = []
for ch in s:
  if ch in pairs.values(): push ch
  else if ch in pairs.keys():
    if stack empty or stack.pop() != pairs[ch]: return False
return stack is empty
```

**Python**
```python
def is_valid_parentheses(s: str) -> bool:
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in pairs.values():
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack
```

### 6) Frequency Counting (Anagrams/Duplicates)
Counting occurrences is a reliable first move for string/array equality checks.

**Pseudo**
```pseudo
if len(a) != len(b): return False
count = empty map
for ch in a: count[ch] = count.get(ch, 0) + 1
for ch in b:
  if ch not in count: return False
  count[ch] -= 1
  if count[ch] < 0: return False
return True
```

**Python**
```python
from collections import Counter

def is_anagram(a: str, b: str) -> bool:
    return Counter(a) == Counter(b)
```

### 7) Intro Recursion
Think in terms of base case + smaller subproblem; keep call depth small.

**Pseudo (factorial)**
```pseudo
factorial(n):
  if n <= 1: return 1
  return n * factorial(n - 1)
```

**Python**
```python
def factorial(n: int) -> int:
    if n <= 1:
        return 1
    return n * factorial(n - 1)
```

### 8) Bit Trick: Single Number (XOR)
XOR cancels duplicates; handy for parity and uniqueness checks.

**Pseudo**
```pseudo
result = 0
for num in nums:
  result ^= num
return result
```

**Python**
```python
from typing import List

def single_number(nums: List[int]) -> int:
    result = 0
    for num in nums:
        result ^= num
    return result
```

## Coding Test Preparation Checklist
- Warm up with 5-10 mins of I/O, loops, and indexing exercises.
- Trace examples by hand (two-pointer moves, window shifts, stack pushes/pops).
- Re-derive pseudo steps before coding; then implement from the pseudo directly.
- Validate against edge cases: empty input, single element, already-sorted, all-equal values.
- Practice pacing: solve 2 easy + 1 medium from these patterns daily before moving to Standard/Advanced lists.
