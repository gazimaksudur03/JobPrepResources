# Dynamic Programming Basics

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

Dynamic Programming (DP) is arguably the most important algorithmic paradigm for coding interviews. It transforms exponential brute-force solutions into polynomial-time solutions by recognizing that many problems contain **overlapping subproblems** — the same smaller problems are solved repeatedly — and **optimal substructure** — the optimal solution to the whole problem can be built from optimal solutions to its parts.

The two implementation strategies are **memoization (top-down)** and **tabulation (bottom-up)**. Top-down starts from the original problem, recursively breaks it into subproblems, and caches results to avoid recomputation. Bottom-up fills a table iteratively, starting from the smallest subproblems and building up to the answer. Both yield the same time and space complexity, but bottom-up avoids recursion overhead and is often preferred in performance-critical code, while top-down is more intuitive and only computes subproblems that are actually needed.

The hardest part of DP is not the coding — it's the **problem formulation**: defining the state (what does `dp[i]` or `dp[i][j]` represent?), writing the transition (how does the current state relate to smaller states?), and identifying the base cases. Once you have these three components, the implementation is mechanical. This section teaches you to think in terms of states and transitions, starting with 1D problems and introducing 2D DP.

## Key Concepts

### Overlapping Subproblems

A problem has overlapping subproblems when solving it involves solving the same subproblems multiple times. The classic example is Fibonacci:

```
fib(5) = fib(4) + fib(3)
fib(4) = fib(3) + fib(2)
fib(3) = fib(2) + fib(1)
```

Without caching, `fib(3)` is computed twice, `fib(2)` three times, etc. Naive recursion has O(2ⁿ) time. With memoization, each subproblem is solved once: O(n) time.

### Optimal Substructure

A problem has optimal substructure if the optimal solution can be constructed from optimal solutions of its subproblems. For example, the shortest path from A to C through B is the shortest path from A to B plus the shortest path from B to C. Not all problems have this: longest simple path in a general graph does not.

### Memoization (Top-Down)

Start with the recursive solution, add a cache:

```cpp
#include <vector>

std::vector<int> memo;

int fib(int n) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    memo[n] = fib(n - 1) + fib(n - 2);
    return memo[n];
}

// Usage: memo.assign(n + 1, -1); fib(n);
```

**Pros:** Intuitive — write the recursion first, then add caching. Only computes subproblems that are needed.
**Cons:** Recursion stack overhead; may hit stack limits for deep recursion.

### Tabulation (Bottom-Up)

Build the solution iteratively from base cases:

```cpp
int fib(int n) {
    if (n <= 1) return n;
    std::vector<int> dp(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}
```

**Pros:** No recursion overhead. Often allows space optimization (rolling array).
**Cons:** May compute unnecessary subproblems. Iteration order must be carefully determined.

### The DP Recipe

For any DP problem, answer these questions:

1. **State:** What does `dp[i]` (or `dp[i][j]`) represent? (e.g., "the minimum cost to reach step i")
2. **Transition:** How does the current state relate to previous states? (e.g., `dp[i] = min(dp[i-1], dp[i-2]) + cost[i]`)
3. **Base case:** What are the initial values? (e.g., `dp[0] = 0`, `dp[1] = cost[1]`)
4. **Answer:** Which cell(s) of the table contain the final answer? (e.g., `dp[n]` or `max(dp[...])`)
5. **Iteration order:** In bottom-up, ensure all dependencies are computed before the current state.

### 1D DP

The state depends on a single index. The DP table is a 1D array.

Examples: Climbing Stairs, House Robber, Coin Change, Longest Increasing Subsequence.

### 2D DP

The state depends on two indices. The DP table is a 2D array.

Examples: 0/1 Knapsack, Longest Common Subsequence, Edit Distance, Grid Path Counting.

```cpp
// Grid path counting: dp[i][j] = number of ways to reach cell (i,j) from (0,0)
std::vector<std::vector<int>> dp(m, std::vector<int>(n, 0));
dp[0][0] = 1;
for (int i = 0; i < m; i++) {
    for (int j = 0; j < n; j++) {
        if (i > 0) dp[i][j] += dp[i-1][j];
        if (j > 0) dp[i][j] += dp[i][j-1];
    }
}
// Answer: dp[m-1][n-1]
```

### Space Optimization

Many DP problems only look at the previous row or the previous two values. You can reduce space:

- **1D rolling:** If `dp[i]` only depends on `dp[i-1]` and `dp[i-2]`, use two variables instead of an array.
- **2D → 1D:** If `dp[i][j]` only depends on row `i-1`, maintain a single row and update in-place (be careful about update direction).

```cpp
// Fibonacci with O(1) space
int fib(int n) {
    if (n <= 1) return n;
    int prev2 = 0, prev1 = 1;
    for (int i = 2; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
```

## Common Patterns

1. **"How many ways?" → Counting DP:** Sum up the number of ways to reach the current state from all valid previous states. (Climbing Stairs, Unique Paths)

2. **"Minimum/Maximum cost?" → Optimization DP:** Take the min or max over all valid transitions. (Coin Change, House Robber, Knapsack)

3. **"Longest/Shortest subsequence?" → Sequence DP:** Define state around indices into one or two sequences. (LCS, LIS, Edit Distance)

4. **Include/Exclude Decisions:** At each step, decide whether to include the current element or skip it. Each choice leads to a different subproblem. (Knapsack, House Robber)

5. **String/Sequence Alignment:** Two indices `i`, `j` track positions in two strings. Transitions involve match/mismatch, insert, delete. (LCS, Edit Distance)

6. **Prefix/Suffix DP:** `dp[i]` represents the answer for the first `i` elements or the last `i` elements.

---

## Practice Problems

### Problem 1: Climbing Stairs

**Problem Statement**

You are climbing a staircase with `n` steps. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?

```
Input:  n = 2
Output: 2
Explanation: (1+1) or (2)

Input:  n = 3
Output: 3
Explanation: (1+1+1), (1+2), (2+1)

Input:  n = 5
Output: 8
```

**Approach**

To reach step `i`, you either came from step `i-1` (took 1 step) or step `i-2` (took 2 steps). So `dp[i] = dp[i-1] + dp[i-2]`. This is exactly the Fibonacci recurrence. Base cases: `dp[0] = 1` (one way to be at ground), `dp[1] = 1` (one way to reach step 1). Since we only need the previous two values, we can optimize to O(1) space.

**Pseudo-code**

```
function climbStairs(n):
    if n <= 1: return 1
    prev2 = 1  // dp[0]
    prev1 = 1  // dp[1]
    for i = 2 to n:
        curr = prev1 + prev2
        prev2 = prev1
        prev1 = curr
    return prev1
```

**C++ Solution**

```cpp
int climbStairs(int n) {
    if (n <= 1) return 1;
    int prev2 = 1, prev1 = 1;
    for (int i = 2; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
```

**Complexity Analysis**

- **Time:** O(n) — single loop from 2 to n.
- **Space:** O(1) — only two variables maintained.

---

### Problem 2: 0/1 Knapsack

**Problem Statement**

Given `n` items, each with a weight and a value, and a knapsack with capacity `W`, find the maximum total value you can carry. Each item can be used at most once (0/1 = take it or leave it).

```
Input:  values = [60, 100, 120], weights = [10, 20, 30], W = 50
Output: 220
Explanation: Take items with values 100 (weight 20) and 120 (weight 30). Total weight = 50.

Input:  values = [10, 40, 30, 50], weights = [5, 4, 6, 3], W = 10
Output: 90
Explanation: Take items with values 40 (weight 4) and 50 (weight 3). Total weight = 7.
```

**Approach**

Define `dp[i][w]` = maximum value achievable using items `0..i-1` with knapsack capacity `w`. For each item `i`, we either skip it (`dp[i][w] = dp[i-1][w]`) or take it if it fits (`dp[i][w] = dp[i-1][w - weights[i-1]] + values[i-1]`). We take the maximum of both options.

The base case is `dp[0][w] = 0` for all `w` (no items, no value). The answer is `dp[n][W]`.

Space optimization: since row `i` only depends on row `i-1`, we can use a single 1D array and iterate `w` from right to left to avoid overwriting values we still need.

**Pseudo-code**

```
function knapsack(values, weights, W):
    n = values.length
    dp = 2D array of size (n+1) x (W+1), initialized to 0
    for i = 1 to n:
        for w = 0 to W:
            dp[i][w] = dp[i-1][w]           // skip item i
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i][w], dp[i-1][w - weights[i-1]] + values[i-1])
    return dp[n][W]
```

**C++ Solution**

```cpp
#include <vector>
#include <algorithm>

int knapsack(std::vector<int>& values, std::vector<int>& weights, int W) {
    int n = values.size();
    // Space-optimized 1D DP
    std::vector<int> dp(W + 1, 0);

    for (int i = 0; i < n; i++) {
        for (int w = W; w >= weights[i]; w--) {
            dp[w] = std::max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }
    return dp[W];
}
```

**Complexity Analysis**

- **Time:** O(n × W) — two nested loops. This is **pseudo-polynomial** because it depends on the value of W, not just the input size.
- **Space:** O(W) with the 1D optimization (or O(n × W) for the full 2D table).

---

### Problem 3: Longest Common Subsequence

**Problem Statement**

Given two strings `text1` and `text2`, return the length of their longest common subsequence. A subsequence is a sequence derived from another by deleting some or no elements without changing the order of the remaining elements.

```
Input:  text1 = "abcde", text2 = "ace"
Output: 3
Explanation: LCS is "ace".

Input:  text1 = "abc", text2 = "abc"
Output: 3

Input:  text1 = "abc", text2 = "def"
Output: 0
```

**Approach**

Define `dp[i][j]` = length of the LCS of `text1[0..i-1]` and `text2[0..j-1]`. If the current characters match (`text1[i-1] == text2[j-1]`), they extend the LCS: `dp[i][j] = dp[i-1][j-1] + 1`. If they don't match, the LCS is the better of skipping one character from either string: `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`.

Base case: `dp[0][j] = dp[i][0] = 0` (empty string has LCS length 0 with anything).

**Pseudo-code**

```
function longestCommonSubsequence(text1, text2):
    m = text1.length, n = text2.length
    dp = 2D array (m+1) x (n+1), initialized to 0
    for i = 1 to m:
        for j = 1 to n:
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]
```

**C++ Solution**

```cpp
#include <string>
#include <vector>
#include <algorithm>

int longestCommonSubsequence(const std::string& text1, const std::string& text2) {
    int m = text1.size(), n = text2.size();
    // Space-optimized: two rows
    std::vector<int> prev(n + 1, 0), curr(n + 1, 0);

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1[i - 1] == text2[j - 1]) {
                curr[j] = prev[j - 1] + 1;
            } else {
                curr[j] = std::max(prev[j], curr[j - 1]);
            }
        }
        std::swap(prev, curr);
    }
    return prev[n];
}
```

**Complexity Analysis**

- **Time:** O(m × n) — two nested loops over the lengths of the strings.
- **Space:** O(min(m, n)) with the two-row optimization (or O(m × n) for the full table).

---

## Practice Resources

- [LeetCode 70 — Climbing Stairs](https://leetcode.com/problems/climbing-stairs/) — The simplest DP warm-up
- [LeetCode 1143 — Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/) — Classic 2D DP
- [LeetCode 322 — Coin Change](https://leetcode.com/problems/coin-change/) — Optimization DP with unlimited items
- [LeetCode 198 — House Robber](https://leetcode.com/problems/house-robber/) — Include/exclude decision DP
- [GeeksforGeeks — 0/1 Knapsack Problem](https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/) — Detailed knapsack walkthrough

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: Medium Interview Patterns →](/docs/CodingTestPreparation/Standard/13_medium_interview_patterns)
