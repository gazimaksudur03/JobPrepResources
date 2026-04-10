# Segment Tree, Fenwick Tree, Sparse Table

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

When problems demand repeated queries over ranges of an array — sums, minimums, maximums, GCDs — brute-force O(N) per query becomes unacceptable for large inputs. Three data structures dominate this space: the **Segment Tree**, the **Fenwick Tree (Binary Indexed Tree)**, and the **Sparse Table**. Each occupies a different niche in the trade-off between update capability, query speed, and implementation complexity.

The **Segment Tree** is the most versatile: it supports both point and range updates (with lazy propagation) and arbitrary associative queries in O(log N). The **Fenwick Tree** is simpler and has a smaller constant factor, perfect for prefix-sum queries with point updates. The **Sparse Table** pre-processes a static array in O(N log N) and answers range minimum (or maximum, GCD) queries in O(1) — but it cannot handle updates at all.

Mastering these three structures covers virtually every range-query scenario you will encounter in coding interviews and competitive programming. This guide covers the build, query, and update operations for each, discusses when to choose one over another, and provides three canonical practice problems.

## Key Concepts

### Segment Tree

A segment tree is a full binary tree where each node stores aggregate information (sum, min, max, etc.) for a contiguous subarray. For an array of size N, the tree has at most 4N nodes.

#### Build — O(N)

```cpp
const int MAXN = 200005;
int a[MAXN], tree[4 * MAXN];

void build(int node, int start, int end) {
    if (start == end) {
        tree[node] = a[start];
        return;
    }
    int mid = (start + end) / 2;
    build(2 * node, start, mid);
    build(2 * node + 1, mid + 1, end);
    tree[node] = tree[2 * node] + tree[2 * node + 1]; // sum
}
```

#### Point Update — O(log N)

```cpp
void update(int node, int start, int end, int idx, int val) {
    if (start == end) {
        a[idx] = val;
        tree[node] = val;
        return;
    }
    int mid = (start + end) / 2;
    if (idx <= mid)
        update(2 * node, start, mid, idx, val);
    else
        update(2 * node + 1, mid + 1, end, idx, val);
    tree[node] = tree[2 * node] + tree[2 * node + 1];
}
```

#### Range Query — O(log N)

```cpp
int query(int node, int start, int end, int l, int r) {
    if (r < start || end < l) return 0; // out of range
    if (l <= start && end <= r) return tree[node]; // fully inside
    int mid = (start + end) / 2;
    return query(2 * node, start, mid, l, r)
         + query(2 * node + 1, mid + 1, end, l, r);
}
```

#### Lazy Propagation — Range Update in O(log N)

When you need to update an entire range (e.g., "add 5 to all elements from index l to r"), lazy propagation defers updates to children until they are needed.

```cpp
int lazy[4 * MAXN];

void pushDown(int node, int start, int end) {
    if (lazy[node] != 0) {
        int mid = (start + end) / 2;
        tree[2 * node] += lazy[node] * (mid - start + 1);
        tree[2 * node + 1] += lazy[node] * (end - mid);
        lazy[2 * node] += lazy[node];
        lazy[2 * node + 1] += lazy[node];
        lazy[node] = 0;
    }
}

void rangeUpdate(int node, int start, int end, int l, int r, int val) {
    if (r < start || end < l) return;
    if (l <= start && end <= r) {
        tree[node] += val * (end - start + 1);
        lazy[node] += val;
        return;
    }
    pushDown(node, start, end);
    int mid = (start + end) / 2;
    rangeUpdate(2 * node, start, mid, l, r, val);
    rangeUpdate(2 * node + 1, mid + 1, end, l, r, val);
    tree[node] = tree[2 * node] + tree[2 * node + 1];
}

int lazyQuery(int node, int start, int end, int l, int r) {
    if (r < start || end < l) return 0;
    if (l <= start && end <= r) return tree[node];
    pushDown(node, start, end);
    int mid = (start + end) / 2;
    return lazyQuery(2 * node, start, mid, l, r)
         + lazyQuery(2 * node + 1, mid + 1, end, l, r);
}
```

### Fenwick Tree (Binary Indexed Tree)

A Fenwick tree stores prefix sums in a 1-indexed array using the lowest set bit trick. It supports point updates and prefix queries in O(log N) with very small constant factors.

```cpp
int bit[MAXN]; // 1-indexed
int n;

void bitUpdate(int i, int delta) {
    for (; i <= n; i += i & (-i))
        bit[i] += delta;
}

int bitQuery(int i) {
    int sum = 0;
    for (; i > 0; i -= i & (-i))
        sum += bit[i];
    return sum;
}

int rangeQuery(int l, int r) {
    return bitQuery(r) - bitQuery(l - 1);
}
```

**How it works:** `i & (-i)` extracts the lowest set bit of `i`. Update adds `delta` to index `i` and propagates to ancestors. Query accumulates contributions from index `i` down to zero.

### Sparse Table — Static RMQ in O(1)

For **static** arrays (no updates), a sparse table pre-computes answers for every power-of-two-length subarray, enabling O(1) range minimum/maximum queries.

#### Build — O(N log N)

```cpp
int sp[MAXN][20]; // sp[i][j] = min of a[i..i+2^j-1]
int logTable[MAXN];

void buildSparse(int n) {
    logTable[1] = 0;
    for (int i = 2; i <= n; ++i)
        logTable[i] = logTable[i / 2] + 1;

    for (int i = 0; i < n; ++i)
        sp[i][0] = a[i];

    for (int j = 1; (1 << j) <= n; ++j)
        for (int i = 0; i + (1 << j) - 1 < n; ++i)
            sp[i][j] = std::min(sp[i][j - 1], sp[i + (1 << (j - 1))][j - 1]);
}
```

#### Query — O(1)

```cpp
int sparseQuery(int l, int r) {
    int k = logTable[r - l + 1];
    return std::min(sp[l][k], sp[r - (1 << k) + 1][k]);
}
```

The O(1) query works because two overlapping power-of-two intervals cover the entire range, and `min` is **idempotent** (overlapping doesn't affect correctness). This trick does **not** work for sum queries (use a segment tree or Fenwick tree instead).

### When to Use Each

| Scenario | Best Choice |
|---|---|
| Range queries + point updates | Fenwick tree (simpler) or Segment tree |
| Range queries + range updates | Segment tree with lazy propagation |
| Static array, RMQ/GCD in O(1) | Sparse table |
| Complex merge operations (e.g., max subarray sum) | Segment tree |
| 2D range queries | 2D Fenwick or 2D Segment tree |

## Common Patterns

### Pattern 1: Coordinate Compression + BIT

When values are large but count is small, compress coordinates to [1, N] then use a BIT for counting/sum queries.

### Pattern 2: Offline Query Processing

Sort queries by right endpoint, sweep left to right, and answer queries using a BIT/segment tree.

### Pattern 3: Merge Sort Tree (Persistent Segment Tree Alternative)

Build a segment tree where each node stores the sorted subarray. Answers "count of elements in range [l, r] that are ≤ k" in O(log² N) with binary search at each level.

### Pattern 4: Lazy Propagation for Range Set/Add

Extend the segment tree with a lazy tag for "set all" or "add to all" operations on ranges — common in interval scheduling and simulation problems.

---

## Practice Problems

### Problem 1: Range Sum Query with Updates (Segment Tree)

**Problem Statement**

Given an array of N integers, handle Q queries:
- `1 i val` — set `a[i] = val`
- `2 l r` — compute `a[l] + a[l+1] + ... + a[r]`

*Input:*
```
N=5, a = [1, 3, 5, 7, 9]
Queries:
  2 1 3 → 9  (1+3+5)
  1 2 10 → set a[2]=10
  2 1 3 → 16 (1+10+5)
```

**Approach**

Build a sum segment tree in O(N). For update, walk to the leaf and propagate changes up. For query, combine results of overlapping segments recursively.

**Pseudo-code**

```
build(node, start, end):
    if start == end: tree[node] = a[start]; return
    mid = (start+end)/2
    build left and right children
    tree[node] = tree[left] + tree[right]

update(node, start, end, idx, val):
    if start == end: tree[node] = val; return
    recurse into correct child
    tree[node] = tree[left] + tree[right]

query(node, start, end, l, r):
    if no overlap: return 0
    if full overlap: return tree[node]
    return query(left) + query(right)
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
using namespace std;

class SegTree {
    int n;
    vector<long long> tree;
    vector<int> arr;

    void build(int node, int start, int end) {
        if (start == end) {
            tree[node] = arr[start];
            return;
        }
        int mid = (start + end) / 2;
        build(2*node, start, mid);
        build(2*node+1, mid+1, end);
        tree[node] = tree[2*node] + tree[2*node+1];
    }

    void update(int node, int start, int end, int idx, int val) {
        if (start == end) {
            arr[idx] = val;
            tree[node] = val;
            return;
        }
        int mid = (start + end) / 2;
        if (idx <= mid)
            update(2*node, start, mid, idx, val);
        else
            update(2*node+1, mid+1, end, idx, val);
        tree[node] = tree[2*node] + tree[2*node+1];
    }

    long long query(int node, int start, int end, int l, int r) {
        if (r < start || end < l) return 0;
        if (l <= start && end <= r) return tree[node];
        int mid = (start + end) / 2;
        return query(2*node, start, mid, l, r)
             + query(2*node+1, mid+1, end, l, r);
    }

public:
    SegTree(const vector<int>& a) : n(a.size()), tree(4*a.size()), arr(a) {
        build(1, 0, n-1);
    }

    void update(int idx, int val) { update(1, 0, n-1, idx, val); }
    long long query(int l, int r) { return query(1, 0, n-1, l, r); }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    cin >> n;
    vector<int> a(n);
    for (int& x : a) cin >> x;

    SegTree seg(a);

    cin >> q;
    while (q--) {
        int type;
        cin >> type;
        if (type == 1) {
            int i, val;
            cin >> i >> val;
            seg.update(i, val);
        } else {
            int l, r;
            cin >> l >> r;
            cout << seg.query(l, r) << '\n';
        }
    }
    return 0;
}
```

**Complexity Analysis**

- **Time:** Build O(N), each update O(log N), each query O(log N). Total: O(N + Q log N).
- **Space:** O(N) for the segment tree array (4N nodes).

---

### Problem 2: Count of Smaller Numbers After Self (Fenwick Tree)

**Problem Statement**

Given an integer array `nums`, return an array `counts` where `counts[i]` is the number of elements to the right of `nums[i]` that are strictly smaller than `nums[i]`.

*Input:* `nums = [5, 2, 6, 1]`
*Output:* `[2, 1, 1, 0]`

Explanation: For 5 → {2, 1} are smaller; for 2 → {1}; for 6 → {1}; for 1 → none.

**Approach**

Traverse from right to left. For each element, query the Fenwick tree for the count of elements smaller than the current value (prefix sum up to `val - 1`). Then insert the current value into the BIT. Use coordinate compression to map values to [1, N].

**Pseudo-code**

```
compress values to ranks in [1, N]
BIT[1..N] = 0
result = []
for i from n-1 downto 0:
    result[i] = BIT.query(rank[i] - 1)
    BIT.update(rank[i], +1)
return result
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class BIT {
    vector<int> tree;
    int n;
public:
    BIT(int n) : n(n), tree(n + 1, 0) {}

    void update(int i, int delta) {
        for (; i <= n; i += i & (-i))
            tree[i] += delta;
    }

    int query(int i) {
        int sum = 0;
        for (; i > 0; i -= i & (-i))
            sum += tree[i];
        return sum;
    }
};

vector<int> countSmaller(vector<int>& nums) {
    int n = nums.size();
    // Coordinate compression
    vector<int> sorted_nums = nums;
    sort(sorted_nums.begin(), sorted_nums.end());
    sorted_nums.erase(unique(sorted_nums.begin(), sorted_nums.end()), sorted_nums.end());

    auto getRank = [&](int val) {
        return (int)(lower_bound(sorted_nums.begin(), sorted_nums.end(), val)
                     - sorted_nums.begin()) + 1;
    };

    int m = sorted_nums.size();
    BIT bit(m);
    vector<int> result(n);

    for (int i = n - 1; i >= 0; --i) {
        int rank = getRank(nums[i]);
        result[i] = bit.query(rank - 1);
        bit.update(rank, 1);
    }
    return result;
}

int main() {
    vector<int> nums = {5, 2, 6, 1};
    auto res = countSmaller(nums);
    for (int x : res)
        cout << x << ' '; // 2 1 1 0
    cout << '\n';
    return 0;
}
```

**Complexity Analysis**

- **Time:** O(N log N) — sorting for compression O(N log N), each of N elements does O(log N) BIT operations.
- **Space:** O(N) for the BIT and compressed rank array.

---

### Problem 3: Static Range Minimum Query (Sparse Table)

**Problem Statement**

Given a static array of N integers and Q queries, each asking for the minimum element in a subarray `[l, r]`, answer each query in O(1) after O(N log N) preprocessing.

*Input:*
```
N=7, a = [2, 4, 1, 5, 3, 7, 2]
Queries:
  0 2 → min(2, 4, 1) = 1
  3 6 → min(5, 3, 7, 2) = 2
  1 4 → min(4, 1, 5, 3) = 1
```

**Approach**

Build a sparse table where `sp[i][j]` stores the minimum of the subarray starting at `i` with length `2^j`. For a query `[l, r]`, compute `k = floor(log2(r - l + 1))` and take `min(sp[l][k], sp[r - 2^k + 1][k])`. The two intervals overlap but `min` is idempotent so this is correct.

**Pseudo-code**

```
build:
    sp[i][0] = a[i] for all i
    for j = 1 to LOG:
        for i = 0 to n - 2^j:
            sp[i][j] = min(sp[i][j-1], sp[i + 2^(j-1)][j-1])

query(l, r):
    k = floor(log2(r - l + 1))
    return min(sp[l][k], sp[r - 2^k + 1][k])
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
#include <cmath>
#include <algorithm>
using namespace std;

class SparseTable {
    vector<vector<int>> sp;
    vector<int> logTable;
    int n;

public:
    SparseTable(const vector<int>& a) : n(a.size()), logTable(a.size() + 1) {
        logTable[1] = 0;
        for (int i = 2; i <= n; ++i)
            logTable[i] = logTable[i / 2] + 1;

        int LOG = logTable[n] + 1;
        sp.assign(n, vector<int>(LOG));

        for (int i = 0; i < n; ++i)
            sp[i][0] = a[i];

        for (int j = 1; j < LOG; ++j)
            for (int i = 0; i + (1 << j) - 1 < n; ++i)
                sp[i][j] = min(sp[i][j-1], sp[i + (1 << (j-1))][j-1]);
    }

    int query(int l, int r) {
        int k = logTable[r - l + 1];
        return min(sp[l][k], sp[r - (1 << k) + 1][k]);
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    vector<int> a = {2, 4, 1, 5, 3, 7, 2};
    SparseTable st(a);

    cout << st.query(0, 2) << '\n'; // 1
    cout << st.query(3, 6) << '\n'; // 2
    cout << st.query(1, 4) << '\n'; // 1

    // Stress test with input
    int n, q;
    if (cin >> n >> q) {
        vector<int> arr(n);
        for (int& x : arr) cin >> x;
        SparseTable table(arr);
        while (q--) {
            int l, r;
            cin >> l >> r;
            cout << table.query(l, r) << '\n';
        }
    }

    return 0;
}
```

**Complexity Analysis**

- **Time:** Build O(N log N), each query O(1). Total for Q queries: O(N log N + Q).
- **Space:** O(N log N) for the sparse table.

---

## Practice Resources

- [LeetCode 307 — Range Sum Query - Mutable](https://leetcode.com/problems/range-sum-query-mutable/) — classic segment tree / BIT problem
- [LeetCode 315 — Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/) — BIT with coordinate compression
- [cp-algorithms — Segment Tree](https://cp-algorithms.com/data_structures/segment_tree.html) — comprehensive guide with lazy propagation
- [cp-algorithms — Fenwick Tree](https://cp-algorithms.com/data_structures/fenwick.html) — BIT tutorial with 2D extension
- [cp-algorithms — Sparse Table](https://cp-algorithms.com/data_structures/sparse-table.html) — static RMQ in O(1)

---

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: Advanced Graph Algorithms →](/docs/CodingTestPreparation/Advanced/05_advanced_graph)
