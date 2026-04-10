# Coding Test Preparation

A three-stage roadmap to get interview-ready for coding rounds. Each stage lists core topics plus a quick problem with pseudocode and code. The focus here is on the basic stage so you can defend almost any entry-to-mid coding screen.

## Stage Overview
- **Basic (now):** Big-O intuition, arrays/strings, hash maps/sets, stacks/queues, recursion basics, binary search, sorting fundamentals, two-pointers, sliding window.
- **Standard (next):** Linked lists, trees, graphs with BFS/DFS, heaps/priority queues, interval problems, prefix sums, greedy vs. DP, bit tricks, math/combinatorics.
- **Advanced (later):** Optimized DP (knapsack/paths), advanced graphs (Dijkstra, union-find, topological ordering), segment/fenwick trees, suffix structures, flow problems, concurrency-ready thinking.

## Problem-Solving Playbook
1) Clarify inputs/outputs, constraints, edge cases, and whether order matters.  
2) Pick a data structure/pattern that reduces time/space (hash map vs scan, window vs brute force).  
3) Write a tiny example, dry-run your approach, then outline pseudocode.  
4) Code with helpers, keep invariants clear, and check off edge cases.  
5) Analyze Big-O and add a quick test (empty, single, repeated, large).  

## Stage 1 — Basic Foundations (focus)

### Topic map
- **Big-O basics:** Know O(1), O(log n), O(n), O(n log n), O(n^2) and what drives them.
- **Arrays & strings:** Indexing, slicing, building frequencies, scanning once.
- **Hash maps/sets:** Counting, membership in O(1), detecting complements.
- **Two pointers & sliding window:** Constrain a subrange instead of nested loops.
- **Stacks/queues:** Matching pairs, monotonic passes, BFS-like processes.
- **Recursion fundamentals:** Base case, recursive step, call stack depth.
- **Sorting & binary search:** When order unlocks O(log n) queries.

### Example 1: Two-Sum (hash map lookup)
Find indices of two numbers that add to target.

Pseudo:
```
map = {}
for i, num in nums:
    complement = target - num
    if complement in map: return [map[complement], i]
    map[num] = i
return [-1, -1]
```

JavaScript:
```javascript
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) return [seen.get(complement), i];
    seen.set(nums[i], i);
  }
  return [-1, -1];
}
```

### Example 2: Sliding Window (longest substring without repeat)
Maintain a window with unique characters; shrink when a duplicate appears.

Pseudo:
```
left = 0; best = 0; last = map of char -> index
for right, ch in enumerate(s):
    if ch in last and last[ch] >= left:
        left = last[ch] + 1
    last[ch] = right
    best = max(best, right - left + 1)
return best
```

JavaScript:
```javascript
function lengthOfLongestSubstring(s) {
  let left = 0;
  let best = 0;
  const last = new Map();
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (last.has(ch) && last.get(ch) >= left) {
      left = last.get(ch) + 1;
    }
    last.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}
```

### Example 3: Binary Search (sorted array)
Cut search space in half by comparing the mid element to the target.

Pseudo:
```
lo = 0; hi = n - 1
while lo <= hi:
    mid = (lo + hi) // 2
    if nums[mid] == target: return mid
    if nums[mid] < target: lo = mid + 1
    else: hi = mid - 1
return -1
```

JavaScript:
```javascript
function binarySearch(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
```

### Example 4: Stack for Valid Parentheses
Push opening brackets; pop and match on closing.

Pseudo:
```
stack = []
pairs = {')':'(', ']':'[', '}':'{'}
for ch in s:
    if ch in pairs values: push
    else if stack empty or top != pairs[ch]: return false
    else pop
return stack empty
```

JavaScript:
```javascript
function isValidParens(s) {
  const stack = [];
  const pairs = new Map([
    [")", "("],
    ["]", "["],
    ["}", "{"],
  ]);
  for (const ch of s) {
    if (pairs.has(ch)) {
      if (stack.length === 0 || stack[stack.length - 1] !== pairs.get(ch)) {
        return false;
      }
      stack.pop();
    } else {
      stack.push(ch);
    }
  }
  return stack.length === 0;
}
```

### Example 5: Recursion (max depth of binary tree)
Depth is 1 plus the max of left/right depths; base is 0 for null.

Pseudo:
```
def maxDepth(node):
    if node is null: return 0
    return 1 + max(maxDepth(node.left), maxDepth(node.right))
```

JavaScript:
```javascript
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

## Stage 2 — Standard (preview)
- Topics: linked lists (fast/slow pointers), trees/graphs with BFS/DFS, heaps for top-K, interval merge/meeting rooms, prefix/suffix sums, greedy vs. 1D DP, simple bit tricks (set/test/clear).
- Example: Merge Intervals (sort + sweep)

Pseudo:
```
sort intervals by start
init merged = [first]
for each [s, e] after first:
    if s <= merged[-1].end: merged[-1].end = max(end, merged[-1].end)
    else append [s, e]
return merged
```

JavaScript:
```javascript
function mergeIntervals(intervals) {
  if (intervals.length === 0) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const [s, e] = intervals[i];
    const last = merged[merged.length - 1];
    if (s <= last[1]) last[1] = Math.max(last[1], e);
    else merged.push([s, e]);
  }
  return merged;
}
```

## Stage 3 — Advanced (preview)
- Topics: optimized DP (knapsack, LIS, edit distance), topological ordering, union-find for connectivity, Dijkstra for weighted shortest paths, segment/fenwick trees for range queries, BFS variants for grids, probabilistic or streaming tricks.
- Example: Dijkstra (adjacency list with min-heap)

Pseudo:
```
dist = [inf]*n; dist[src]=0
heap = [(0, src)]
while heap not empty:
    d, node = pop min
    if d > dist[node]: continue
    for neighbor, w in graph[node]:
        if d + w < dist[neighbor]:
            dist[neighbor] = d + w
            push (dist[neighbor], neighbor)
return dist
```

JavaScript:
```javascript
// graph: adjacency list like [[ [1, 4], [2, 1] ], ...]
function dijkstra(graph, src) {
  const n = graph.length;
  const dist = Array(n).fill(Infinity);
  dist[src] = 0;
  const pq = [[0, src]]; // [distance, node]

  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, node] = pq.shift();
    if (d > dist[node]) continue;
    for (const [nbr, w] of graph[node]) {
      const nd = d + w;
      if (nd < dist[nbr]) {
        dist[nbr] = nd;
        pq.push([nd, nbr]);
      }
    }
  }
  return dist;
}
```

## Quick Daily Drill Ideas
- Pick one pattern per day (hash map lookup, window, binary search, stack) and solve 2–3 problems around it.
- After solving, restate the invariant you maintained; that cements the pattern.
- Re-implement a solved problem from memory 24 hours later to keep it fresh.
