# Greedy Basics

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

A greedy algorithm builds a solution incrementally, making the locally optimal choice at each step with the hope that these local optima lead to a global optimum. Unlike dynamic programming, which exhaustively considers all sub-problem combinations, a greedy algorithm commits to each decision without backtracking. This makes greedy algorithms simple to implement and often very efficient — but they only work when the problem has the right structural properties.

The two properties that make a greedy approach valid are the **greedy choice property** (a locally optimal choice is part of some globally optimal solution) and **optimal substructure** (an optimal solution to the problem contains optimal solutions to its subproblems). When both properties hold, a greedy algorithm produces the correct answer. When they don't, greedy may give a plausible-looking but incorrect answer — and this is one of the trickiest aspects of greedy problems in interviews: knowing when greedy works and when it doesn't.

In interviews, greedy problems typically involve scheduling, intervals, or optimization over a sorted sequence. The key skill is recognizing the greedy pattern, articulating why it works (often through an **exchange argument**), and implementing it cleanly. This section covers the foundational theory and three classic greedy problems that form the basis for more advanced greedy applications.

## Key Concepts

### When Does Greedy Work?

Greedy works when making the locally best decision at each step does not prevent you from reaching the globally best solution. Classic examples where greedy succeeds:

- **Activity selection** — always pick the activity that finishes earliest
- **Huffman coding** — always merge the two least-frequent nodes
- **Fractional knapsack** — always take the item with the highest value-to-weight ratio
- **Minimum coins** (with standard denominations like US currency) — always take the largest coin that fits

Classic examples where greedy **fails**:

- **0/1 Knapsack** — taking the highest value-per-weight item may leave no room for a better combination
- **Minimum coins** (arbitrary denominations) — e.g., coins {1, 3, 4}, target 6: greedy gives 4+1+1 = 3 coins, but 3+3 = 2 coins is optimal
- **Longest path in a graph** — local choices can lead to dead ends

### Proving Greedy Correctness: The Exchange Argument

The exchange argument is the standard technique for proving a greedy algorithm is correct:

1. **Assume** there exists an optimal solution OPT that differs from the greedy solution G.
2. **Identify** the first point where OPT and G diverge.
3. **Show** that you can "exchange" the choice OPT made at that point with the greedy choice, without making the solution worse.
4. **Repeat** until OPT is transformed into G, proving G is also optimal.

This proof structure is useful to sketch in interviews when the interviewer asks "why does greedy work here?"

### Greedy Choice Property

At each decision point, the greedy choice is safe — there exists at least one optimal solution that includes it. You don't need to consider all possibilities because you can prove the greedy choice is never wrong.

### Optimal Substructure

After making the greedy choice, the remaining problem is a smaller instance of the same type. The optimal solution to the original problem contains the optimal solution to this subproblem. This is shared with dynamic programming, but greedy avoids the overhead of computing all subproblems.

### Common Greedy Strategies

| Strategy | Example Problems |
|----------|-----------------|
| Sort by end time / deadline | Activity selection, meeting rooms |
| Sort by ratio (value/cost) | Fractional knapsack |
| Sort by start time, merge | Interval merging, minimum platforms |
| Process in order, track state | Jump game, gas station |
| Always pick min/max available | Huffman coding, task scheduler |

### Greedy vs. Dynamic Programming

| Aspect | Greedy | DP |
|--------|--------|----|
| Approach | Choose the best now, never reconsider | Consider all options, pick the best |
| Subproblems | Makes one choice per step | Solves overlapping subproblems |
| Proof burden | Must prove greedy choice property | Optimal substructure + overlapping subproblems |
| Performance | Usually O(n log n) or O(n) | Often O(n²) or O(n × W) |
| When to use | Problem has greedy choice property | Greedy doesn't work; need exhaustive optimization |

## Common Patterns

1. **Sort-then-Scan:** Sort by a key criterion (end time, deadline, ratio), then iterate making greedy decisions. This covers 80% of interview greedy problems.

2. **Interval Scheduling:** When dealing with intervals, sorting by end time and greedily selecting non-overlapping intervals is a fundamental template.

3. **Two-Array Coordination:** Given starts and ends as separate arrays, sort both and use two pointers to track active elements (e.g., minimum platforms).

4. **Exchange Argument Intuition:** If you can argue "swapping any non-greedy choice with the greedy choice doesn't worsen the answer," the greedy approach is valid.

5. **Feasibility Check Greedy:** Sometimes greedy is used not to optimize but to check feasibility — e.g., "can we finish all tasks by their deadlines?" Sort by deadline, process greedily.

---

## Practice Problems

### Problem 1: Activity Selection Problem

**Problem Statement**

Given `n` activities with start times and finish times, select the maximum number of activities that don't overlap (a single person can only do one activity at a time).

```
Input:  start  = [1, 3, 0, 5, 8, 5]
        finish = [2, 4, 6, 7, 9, 9]
Output: 4
Explanation: Activities (1,2), (3,4), (5,7), (8,9) — maximum non-overlapping set.

Input:  start  = [10, 12, 20]
        finish = [20, 25, 30]
Output: 1
```

**Approach**

Sort activities by their finish time. Select the first activity (it finishes earliest, leaving maximum room for future activities). Then, for each subsequent activity, if its start time is greater than or equal to the finish time of the last selected activity, select it. The greedy choice — "always pick the activity that finishes first among compatible activities" — works because finishing earlier can never be worse than finishing later; it only opens up more possibilities.

**Pseudo-code**

```
function activitySelection(start, finish):
    activities = zip(start, finish), sorted by finish time
    count = 1
    lastFinish = activities[0].finish
    for i = 1 to n-1:
        if activities[i].start >= lastFinish:
            count += 1
            lastFinish = activities[i].finish
    return count
```

**C++ Solution**

```cpp
#include <vector>
#include <algorithm>

int activitySelection(std::vector<int>& start, std::vector<int>& finish) {
    int n = start.size();
    std::vector<int> idx(n);
    std::iota(idx.begin(), idx.end(), 0);
    std::sort(idx.begin(), idx.end(), [&](int a, int b) {
        return finish[a] < finish[b];
    });

    int count = 1;
    int lastFinish = finish[idx[0]];
    for (int i = 1; i < n; i++) {
        if (start[idx[i]] >= lastFinish) {
            count++;
            lastFinish = finish[idx[i]];
        }
    }
    return count;
}
```

**Complexity Analysis**

- **Time:** O(n log n) — dominated by sorting. The scanning step is O(n).
- **Space:** O(n) — for the index array. Can be reduced to O(1) extra space if activities are stored as pairs and sorted in-place.

---

### Problem 2: Fractional Knapsack

**Problem Statement**

Given `n` items, each with a weight and a value, and a knapsack with capacity `W`, fill the knapsack to maximize total value. You may take fractions of items (unlike 0/1 knapsack).

```
Input:  values  = [60, 100, 120]
        weights = [10, 20, 30]
        W = 50
Output: 240.0
Explanation: Take item 1 fully (value 60, weight 10), item 2 fully (value 100, weight 20),
             and 2/3 of item 3 (value 80, weight 20). Total = 60 + 100 + 80 = 240.

Input:  values  = [500]
        weights = [30]
        W = 10
Output: 166.67
```

**Approach**

Since we can take fractions, the greedy strategy is to compute the value-per-unit-weight ratio for each item, sort items by this ratio in decreasing order, and greedily take as much of each item as possible. This works because taking from the highest-ratio item first maximizes value per unit of capacity used. For the 0/1 version, this greedy approach fails because you can't split items.

**Pseudo-code**

```
function fractionalKnapsack(values, weights, W):
    items = [(values[i] / weights[i], values[i], weights[i]) for i in 0..n-1]
    sort items by ratio in decreasing order
    totalValue = 0
    remaining = W
    for each item in items:
        if remaining == 0: break
        take = min(item.weight, remaining)
        totalValue += take * item.ratio
        remaining -= take
    return totalValue
```

**C++ Solution**

```cpp
#include <vector>
#include <algorithm>

double fractionalKnapsack(std::vector<int>& values, std::vector<int>& weights, int W) {
    int n = values.size();
    std::vector<int> idx(n);
    std::iota(idx.begin(), idx.end(), 0);
    std::sort(idx.begin(), idx.end(), [&](int a, int b) {
        return (double)values[a] / weights[a] > (double)values[b] / weights[b];
    });

    double totalValue = 0.0;
    int remaining = W;
    for (int i = 0; i < n && remaining > 0; i++) {
        int j = idx[i];
        int take = std::min(weights[j], remaining);
        totalValue += (double)take * values[j] / weights[j];
        remaining -= take;
    }
    return totalValue;
}
```

**Complexity Analysis**

- **Time:** O(n log n) — sorting dominates. The greedy scan is O(n).
- **Space:** O(n) — for the index array.

---

### Problem 3: Minimum Number of Platforms

**Problem Statement**

Given arrival and departure times of all trains at a station, find the minimum number of platforms required so that no train has to wait.

```
Input:  arrivals   = [900, 940, 950, 1100, 1500, 1800]
        departures = [910, 1200, 1120, 1130, 1900, 2000]
Output: 3
Explanation: At time 1100, trains arriving at 940, 950, and 1100 are all at the station
             (the 900 train departed at 910). Three platforms are needed simultaneously.

Input:  arrivals   = [200, 210]
        departures = [230, 240]
Output: 2
```

**Approach**

This is an interval overlap problem. Sort both arrays independently. Use two pointers — one for arrivals, one for departures. Scan through time: if the next event is an arrival, increment the platform count; if it's a departure, decrement. Track the maximum count. Sorting both arrays independently works because we only care about the total number of trains present at any moment, not which specific train is on which platform.

**Pseudo-code**

```
function minPlatforms(arrivals, departures):
    sort arrivals
    sort departures
    i = 0, j = 0
    platforms = 0, maxPlatforms = 0
    while i < n:
        if arrivals[i] <= departures[j]:
            platforms += 1
            maxPlatforms = max(maxPlatforms, platforms)
            i += 1
        else:
            platforms -= 1
            j += 1
    return maxPlatforms
```

**C++ Solution**

```cpp
#include <vector>
#include <algorithm>

int minPlatforms(std::vector<int>& arrivals, std::vector<int>& departures) {
    std::sort(arrivals.begin(), arrivals.end());
    std::sort(departures.begin(), departures.end());

    int n = arrivals.size();
    int i = 0, j = 0;
    int platforms = 0, maxPlatforms = 0;

    while (i < n) {
        if (arrivals[i] <= departures[j]) {
            platforms++;
            maxPlatforms = std::max(maxPlatforms, platforms);
            i++;
        } else {
            platforms--;
            j++;
        }
    }
    return maxPlatforms;
}
```

**Complexity Analysis**

- **Time:** O(n log n) — two sorts dominate. The two-pointer scan is O(n).
- **Space:** O(1) extra space (sorting is in-place, assuming we can modify the input arrays).

---

## Practice Resources

- [LeetCode 435 — Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/) — Classic interval greedy
- [LeetCode 452 — Minimum Number of Arrows to Burst Balloons](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/) — Interval greedy variant
- [GeeksforGeeks — Activity Selection Problem](https://www.geeksforgeeks.org/activity-selection-problem-greedy-algo-1/) — Detailed walkthrough
- [GeeksforGeeks — Fractional Knapsack](https://www.geeksforgeeks.org/fractional-knapsack-problem/) — Greedy vs DP comparison
- [LeetCode 55 — Jump Game](https://leetcode.com/problems/jump-game/) — Greedy feasibility check

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: DFS and BFS →](/docs/CodingTestPreparation/Standard/10_dfs_bfs)
