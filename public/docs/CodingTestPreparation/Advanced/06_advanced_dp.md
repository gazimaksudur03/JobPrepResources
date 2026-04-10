# Advanced Dynamic Programming

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

Dynamic programming at the advanced level goes far beyond the classic knapsack and LIS problems. It involves compressing state spaces with **bitmasks**, encoding digit-by-digit constraints with **digit DP**, computing optimal values on tree structures with **tree DP**, and applying mathematical optimisations like the **convex hull trick** or **Knuth's optimisation** to reduce polynomial factors. These techniques are the bread and butter of competitive programming and appear in senior-level coding interviews at top companies.

The key insight in all advanced DP is **state design**: choosing the minimal representation that captures everything the recurrence needs. Bitmask DP uses a bitmask to track which elements have been "used" — essential for permutation and subset problems. Digit DP processes a number digit by digit, tracking whether we are still bounded by the original number (the "tight" constraint). Tree DP roots the tree and computes subtree answers bottom-up. Range/interval DP fills a 2D table over all contiguous subarrays. Each technique has a recognisable pattern once you know what to look for.

This section covers the theory, implementation patterns, and three hard-level problems: the Travelling Salesman Problem (bitmask DP), counting numbers without repeated digits (digit DP), and maximum path sum in a binary tree (tree DP).

## Key Concepts

### Bitmask DP

When the problem involves choosing subsets of up to ~20 elements with dependencies, represent the "used" set as a bitmask.

**State:** `dp[mask]` or `dp[mask][i]` where `mask` is a bitmask of visited elements and `i` is the current position.

**Transitions:** Iterate over unvisited elements (bits not set in mask) and set them.

```cpp
// Example: minimum cost to visit all cities (TSP variant)
// dp[mask][i] = min cost to have visited cities in 'mask' and be at city i
dp[(1 << 0)][0] = 0; // start at city 0
for (int mask = 1; mask < (1 << n); ++mask) {
    for (int u = 0; u < n; ++u) {
        if (!(mask & (1 << u))) continue;
        if (dp[mask][u] == INF) continue;
        for (int v = 0; v < n; ++v) {
            if (mask & (1 << v)) continue;
            int newMask = mask | (1 << v);
            dp[newMask][v] = min(dp[newMask][v], dp[mask][u] + cost[u][v]);
        }
    }
}
```

**Complexity:** O(2^N × N²). Feasible for N ≤ 20.

### Digit DP

Digit DP counts numbers in a range [0, N] satisfying some digit-level property (e.g., no repeated digits, digit sum divisible by K). Process digits from most significant to least, tracking:
- **pos:** current digit position
- **tight:** whether we are still bounded by N's digits (if true, current digit ≤ N's digit at this position)
- **state:** problem-specific (e.g., mask of used digits, running sum mod K)

```cpp
// Template structure
int dp[MAX_DIGITS][STATES][2]; // [position][state][tight]

int solve(int pos, int state, bool tight, const vector<int>& digits) {
    if (pos == digits.size()) return /* base case */;
    if (dp[pos][state][tight] != -1) return dp[pos][state][tight];

    int limit = tight ? digits[pos] : 9;
    int result = 0;
    for (int d = 0; d <= limit; ++d) {
        bool newTight = tight && (d == limit);
        int newState = /* transition based on d and state */;
        result += solve(pos + 1, newState, newTight, digits);
    }
    return dp[pos][state][tight] = result;
}
```

### DP on Trees

Root the tree at any vertex. Compute answers bottom-up: for each vertex, combine answers from all its children.

**Common patterns:**
- `dp[v][0/1]` — vertex v is included (1) or excluded (0) in the solution
- Process children iteratively, updating the parent's DP state
- Maximum independent set, tree matching, tree path problems

```cpp
// Maximum independent set on a tree
int dp[MAXN][2]; // dp[v][0] = max if v not taken, dp[v][1] = max if v taken

void dfs(int u, int parent, const vector<vector<int>>& adj, const vector<int>& val) {
    dp[u][0] = 0;
    dp[u][1] = val[u];
    for (int v : adj[u]) {
        if (v == parent) continue;
        dfs(v, u, adj, val);
        dp[u][0] += max(dp[v][0], dp[v][1]);
        dp[u][1] += dp[v][0];
    }
}
```

### DP with Interval / Range

**State:** `dp[i][j]` = optimal answer for the subarray/interval `[i, j]`.

**Transition:** Try every split point `k` in `[i, j-1]`: `dp[i][j] = min/max over k of (dp[i][k] + dp[k+1][j] + cost(i, j))`.

```cpp
// Matrix Chain Multiplication pattern
for (int len = 2; len <= n; ++len) {
    for (int i = 0; i + len - 1 < n; ++i) {
        int j = i + len - 1;
        dp[i][j] = INF;
        for (int k = i; k < j; ++k)
            dp[i][j] = min(dp[i][j], dp[i][k] + dp[k+1][j] + dims[i]*dims[k+1]*dims[j+1]);
    }
}
```

**Complexity:** O(N³) naively, reducible to O(N²) with Knuth's optimisation when the cost function satisfies the quadrangle inequality.

### Knuth's Optimisation

For interval DP where the cost function satisfies `opt[i][j-1] ≤ opt[i][j] ≤ opt[i+1][j]` (monotonicity of the optimal split point), the search space for `k` is reduced:

```cpp
for (int len = 2; len <= n; ++len) {
    for (int i = 0; i + len - 1 < n; ++i) {
        int j = i + len - 1;
        dp[i][j] = INF;
        for (int k = opt[i][j-1]; k <= opt[i+1][j]; ++k) {
            int val = dp[i][k] + dp[k+1][j] + cost(i, j);
            if (val < dp[i][j]) {
                dp[i][j] = val;
                opt[i][j] = k;
            }
        }
    }
}
```

This reduces the total time from O(N³) to O(N²).

### Convex Hull Trick (Introduction)

When a DP transition has the form `dp[i] = min/max over j < i of (dp[j] + b[j] * a[i])` where `a[i]` is monotonic, the convex hull trick maintains a set of linear functions and queries the minimum/maximum in amortised O(1) or O(log N).

This is an advanced optimisation typically seen in competitive programming. The core idea: each DP state `j` defines a line `y = b[j] * x + dp[j]`, and we query the minimum `y` at `x = a[i]`. Maintaining these lines as a convex hull allows fast queries.

### DP State Optimisation — Rolling Array

When `dp[i]` depends only on `dp[i-1]` (or a constant number of previous rows), reduce space from O(N × M) to O(M) by alternating between two rows:

```cpp
// 0/1 Knapsack with rolling array
vector<int> dp(W + 1, 0);
for (int i = 0; i < n; ++i)
    for (int w = W; w >= weight[i]; --w) // reverse order!
        dp[w] = max(dp[w], dp[w - weight[i]] + value[i]);
```

### Profile DP (Broken Profile)

Used for grid-filling problems (e.g., domino tiling). The state encodes the "profile" of the boundary between filled and unfilled cells as a bitmask. Transition fills cells column by column (or row by row), updating the profile.

## Common Patterns

### Pattern 1: "Subset DP" — Iterating Over Submasks

```cpp
for (int mask = 0; mask < (1 << n); ++mask)
    for (int sub = mask; sub > 0; sub = (sub - 1) & mask)
        // sub iterates over all non-empty submasks of mask
```

Total iterations: O(3^N) by the binomial theorem.

### Pattern 2: Digit DP with Leading Zeros

Handle leading zeros by adding a `started` flag. If `started` is false, the digit 0 doesn't count as "used":

```cpp
int solve(int pos, int mask, bool tight, bool started, ...) {
    for (int d = 0; d <= limit; ++d) {
        if (!started && d == 0)
            result += solve(pos+1, mask, newTight, false, ...);
        else
            result += solve(pos+1, mask | (1<<d), newTight, true, ...);
    }
}
```

### Pattern 3: Re-rooting Technique for Tree DP

Compute DP rooted at vertex 0, then re-root to every other vertex in O(N) total using a second pass that propagates parent information downward.

### Pattern 4: Bitmask DP with Meet-in-the-Middle

For N up to ~40, split elements into two halves of ~20. Enumerate subsets of each half independently (2^20 each), then combine using sorting + two pointers or hashing.

---

## Practice Problems

### Problem 1: Travelling Salesman Problem (Bitmask DP)

**Problem Statement**

Given N cities (N ≤ 20) and a distance matrix `cost[i][j]`, find the minimum cost to start at city 0, visit every city exactly once, and return to city 0.

*Input:*
```
N=4
cost = [[0,10,15,20],
        [10,0,35,25],
        [15,35,0,30],
        [20,25,30,0]]
```
*Output:* `80` (path: 0 → 1 → 3 → 2 → 0, cost: 10+25+30+15)

**Approach**

Define `dp[mask][i]` = minimum cost to have visited the set of cities encoded by `mask`, currently at city `i`. Base case: `dp[1][0] = 0` (only city 0 visited, at city 0). Transition: from state `(mask, u)`, try visiting an unvisited city `v`. Answer: `min over all i of (dp[(1<<N)-1][i] + cost[i][0])`.

**Pseudo-code**

```
dp[1<<N][N] = INF
dp[1][0] = 0

for mask = 1 to (1<<N)-1:
    for u = 0 to N-1:
        if not (mask & (1<<u)): continue
        if dp[mask][u] == INF: continue
        for v = 0 to N-1:
            if mask & (1<<v): continue
            newMask = mask | (1<<v)
            dp[newMask][v] = min(dp[newMask][v], dp[mask][u] + cost[u][v])

answer = min over u of dp[(1<<N)-1][u] + cost[u][0]
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;
    vector<vector<int>> cost(n, vector<int>(n));
    for (int i = 0; i < n; ++i)
        for (int j = 0; j < n; ++j)
            cin >> cost[i][j];

    int full = (1 << n) - 1;
    vector<vector<int>> dp(1 << n, vector<int>(n, INT_MAX));
    dp[1][0] = 0;

    for (int mask = 1; mask <= full; ++mask) {
        for (int u = 0; u < n; ++u) {
            if (!(mask & (1 << u))) continue;
            if (dp[mask][u] == INT_MAX) continue;

            for (int v = 0; v < n; ++v) {
                if (mask & (1 << v)) continue;
                int newMask = mask | (1 << v);
                dp[newMask][v] = min(dp[newMask][v], dp[mask][u] + cost[u][v]);
            }
        }
    }

    int ans = INT_MAX;
    for (int u = 0; u < n; ++u)
        if (dp[full][u] != INT_MAX)
            ans = min(ans, dp[full][u] + cost[u][0]);

    cout << ans << '\n';
    return 0;
}
```

**Complexity Analysis**

- **Time:** O(2^N × N²) — for each of 2^N masks, for each of N cities, we try N transitions.
- **Space:** O(2^N × N) for the DP table. For N=20, this is ~20 million entries.

---

### Problem 2: Count Numbers with No Repeated Digits in [1, N] (Digit DP)

**Problem Statement**

Given a positive integer N, count how many integers in the range [1, N] have all distinct digits (no digit appears more than once).

*Input:* `N = 20`
*Output:* `19` (1 through 20 — only 11 has a repeat, but 11 > 10 digits... actually 1-9 all unique (9 numbers), 10,12-19,20 are unique (10 numbers), 11 is not → 19)

*Input:* `N = 100`
*Output:* `90`

**Approach**

Use digit DP. Convert N to its digit representation. Process digits from most significant to least, tracking:
- `pos` — current digit index
- `mask` — bitmask of digits used so far
- `tight` — whether we are still bounded by N
- `started` — whether we have placed a non-zero digit yet (to handle leading zeros)

A digit can be placed if it is not in the mask. Leading zeros don't "use" the digit 0 in the mask.

**Pseudo-code**

```
digits = digits of N
memo[pos][mask][tight][started]

function count(pos, mask, tight, started):
    if pos == len(digits): return started ? 1 : 0
    if memo exists: return memo

    limit = tight ? digits[pos] : 9
    result = 0
    for d = 0 to limit:
        if started and (mask & (1<<d)): continue  // digit already used
        newMask = started || d > 0 ? mask | (1<<d) : mask
        newStarted = started || d > 0
        newTight = tight && (d == limit)
        result += count(pos+1, newMask, newTight, newStarted)

    return memo = result
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
#include <cstring>
using namespace std;

int digits[12];
int numDigits;
int memo[12][1024][2][2]; // [pos][mask][tight][started]

int solve(int pos, int mask, bool tight, bool started) {
    if (pos == numDigits)
        return started ? 1 : 0;

    int& res = memo[pos][mask][tight][started];
    if (res != -1) return res;

    int limit = tight ? digits[pos] : 9;
    res = 0;

    for (int d = 0; d <= limit; ++d) {
        if (started && (mask & (1 << d))) continue;

        bool newStarted = started || (d > 0);
        int newMask = newStarted ? (mask | (1 << d)) : 0;
        bool newTight = tight && (d == limit);

        res += solve(pos + 1, newMask, newTight, newStarted);
    }
    return res;
}

int countUnique(int n) {
    if (n <= 0) return 0;

    numDigits = 0;
    int tmp = n;
    while (tmp > 0) {
        digits[numDigits++] = tmp % 10;
        tmp /= 10;
    }
    // Reverse to get most significant first
    for (int i = 0; i < numDigits / 2; ++i)
        swap(digits[i], digits[numDigits - 1 - i]);

    memset(memo, -1, sizeof(memo));
    return solve(0, 0, true, false);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;
    cout << countUnique(n) << '\n';

    // Verification for small cases
    // N=20: 19, N=100: 90, N=1000: 738
    return 0;
}
```

**Complexity Analysis**

- **Time:** O(D × 2^10 × 2 × 2 × 10) where D is the number of digits (≤ 11 for 32-bit int). The mask has at most 10 bits (digits 0-9). Total states: ~44,000 × 10 transitions ≈ 440,000 operations. Essentially O(1) for any input up to 10^10.
- **Space:** O(D × 1024 × 4) ≈ 45 KB for the memoisation table.

---

### Problem 3: Maximum Path Sum in a Binary Tree (Tree DP)

**Problem Statement**

Given a binary tree where each node has an integer value (possibly negative), find the maximum path sum. A **path** is any sequence of connected nodes where each node appears at most once. The path does not need to pass through the root.

*Input:*
```
       -10
       /  \
      9    20
          /  \
         15   7
```
*Output:* `42` (path: 15 → 20 → 7)

**Approach**

For each node, compute two values:
1. **maxDown[v]** — the maximum sum of a path starting at v and going downward (to a single child). This is what we return to the parent.
2. **maxThrough** — the maximum sum of a path that passes through v, potentially using both children. This is a candidate for the global answer.

`maxDown[v] = v.val + max(0, max(maxDown[left], maxDown[right]))`
`maxThrough = v.val + max(0, maxDown[left]) + max(0, maxDown[right])`

Update the global maximum with `maxThrough` at every node.

**Pseudo-code**

```
global_max = -INF

function maxPathDown(node):
    if node is null: return 0
    left = max(0, maxPathDown(node.left))
    right = max(0, maxPathDown(node.right))
    global_max = max(global_max, node.val + left + right)
    return node.val + max(left, right)
```

**C++ Solution**

```cpp
#include <iostream>
#include <algorithm>
#include <climits>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int v, TreeNode* l = nullptr, TreeNode* r = nullptr)
        : val(v), left(l), right(r) {}
};

class Solution {
    int globalMax;

    int maxPathDown(TreeNode* node) {
        if (!node) return 0;

        int left  = max(0, maxPathDown(node->left));
        int right = max(0, maxPathDown(node->right));

        // Path through this node using both children
        globalMax = max(globalMax, node->val + left + right);

        // Return best single-direction path starting at this node
        return node->val + max(left, right);
    }

public:
    int maxPathSum(TreeNode* root) {
        globalMax = INT_MIN;
        maxPathDown(root);
        return globalMax;
    }
};

int main() {
    //        -10
    //        /  \
    //       9    20
    //           /  \
    //          15    7
    TreeNode* root = new TreeNode(-10,
        new TreeNode(9),
        new TreeNode(20,
            new TreeNode(15),
            new TreeNode(7)
        )
    );

    Solution sol;
    cout << sol.maxPathSum(root) << '\n'; // 42

    // Single node tree
    TreeNode* single = new TreeNode(-3);
    cout << sol.maxPathSum(single) << '\n'; // -3

    // All negative
    TreeNode* neg = new TreeNode(-1,
        new TreeNode(-2),
        new TreeNode(-3)
    );
    cout << sol.maxPathSum(neg) << '\n'; // -1

    // Linear tree: 1 -> 2 -> 3
    TreeNode* linear = new TreeNode(1,
        nullptr,
        new TreeNode(2,
            nullptr,
            new TreeNode(3)
        )
    );
    cout << sol.maxPathSum(linear) << '\n'; // 6

    // Cleanup omitted for brevity (use smart pointers in production)
    return 0;
}
```

**Complexity Analysis**

- **Time:** O(N) — each node is visited exactly once in the post-order traversal.
- **Space:** O(H) where H is the height of the tree — for the recursion stack. O(N) in the worst case (skewed tree), O(log N) for a balanced tree.

---

## Practice Resources

- [LeetCode 943 — Find the Shortest Superstring](https://leetcode.com/problems/find-the-shortest-superstring/) — bitmask DP on permutations
- [LeetCode 1012 — Numbers with Repeated Digits](https://leetcode.com/problems/numbers-with-repeated-digits/) — digit DP (complement of our Problem 2)
- [LeetCode 124 — Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum/) — tree DP classic
- [cp-algorithms — DP on Bitmasks (TSP)](https://cp-algorithms.com/graph/hamiltonian_path.html) — Hamiltonian path with bitmask DP
- [cp-algorithms — Digit DP](https://cp-algorithms.com/dynamic_programming/digit_dp.html) — comprehensive digit DP tutorial

---

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: String Algorithms →](/docs/CodingTestPreparation/Advanced/07_string_algorithms)
