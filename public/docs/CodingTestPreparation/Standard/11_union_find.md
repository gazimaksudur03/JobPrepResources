# Union-Find (Disjoint Set Union)

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

Union-Find, also known as Disjoint Set Union (DSU), is a data structure that maintains a collection of disjoint (non-overlapping) sets and supports two primary operations: **find** (determine which set an element belongs to) and **union** (merge two sets into one). It is deceptively simple to implement yet remarkably powerful, solving connectivity and grouping problems that would otherwise require more complex graph algorithms.

The naive implementation is straightforward but slow. The real elegance of Union-Find comes from two optimizations — **path compression** and **union by rank (or size)** — which together bring the amortized cost per operation down to nearly O(1), specifically O(α(n)) where α is the inverse Ackermann function, a function that grows so slowly it is effectively constant for any practical input size (α(n) ≤ 4 for n up to 10⁸⁰).

Union-Find is the go-to data structure when you need to dynamically track connected components, detect cycles in undirected graphs, or implement Kruskal's minimum spanning tree algorithm. In interviews, it frequently appears in problems about connectivity, equivalence classes, and incremental graph construction. Compared to DFS/BFS for connected components, Union-Find excels when edges are processed one at a time (online) rather than all at once.

## Key Concepts

### Basic Operations

**Find(x):** Returns the representative (root) of the set containing element `x`. Two elements are in the same set if and only if they have the same representative.

**Union(x, y):** Merges the set containing `x` with the set containing `y`. After this operation, `Find(x) == Find(y)`.

### Naive Implementation

Each element has a parent pointer. Initially, each element is its own parent (self-loop). Find follows parent pointers until it reaches the root. Union connects one root to another.

```cpp
class NaiveUF {
    std::vector<int> parent;
public:
    NaiveUF(int n) : parent(n) {
        std::iota(parent.begin(), parent.end(), 0);  // parent[i] = i
    }

    int find(int x) {
        while (parent[x] != x)
            x = parent[x];
        return x;
    }

    void unite(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        if (rootX != rootY)
            parent[rootX] = rootY;
    }
};
```

**Problem:** Without optimizations, the tree can become a long chain (like a linked list), making Find O(n) in the worst case.

### Path Compression

During `Find`, make every node on the path point directly to the root. This flattens the tree, so future queries are faster:

```cpp
int find(int x) {
    if (parent[x] != x)
        parent[x] = find(parent[x]);  // path compression
    return parent[x];
}
```

After one traversal, the entire path collapses to a single level. This alone reduces amortized cost to O(log n) per operation.

### Union by Rank / Union by Size

Attach the smaller (or shorter) tree under the root of the larger (or taller) tree, preventing the tree from becoming unbalanced:

**Union by Rank** (tracks tree height):

```cpp
class UnionFind {
    std::vector<int> parent, rank_;
public:
    UnionFind(int n) : parent(n), rank_(n, 0) {
        std::iota(parent.begin(), parent.end(), 0);
    }

    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]);
        return parent[x];
    }

    bool unite(int x, int y) {
        int rx = find(x), ry = find(y);
        if (rx == ry) return false;
        if (rank_[rx] < rank_[ry]) std::swap(rx, ry);
        parent[ry] = rx;
        if (rank_[rx] == rank_[ry]) rank_[rx]++;
        return true;
    }
};
```

**Union by Size** (tracks subtree count) — often more useful because it lets you query component sizes:

```cpp
class UnionFindSize {
    std::vector<int> parent, size_;
public:
    UnionFindSize(int n) : parent(n), size_(n, 1) {
        std::iota(parent.begin(), parent.end(), 0);
    }

    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]);
        return parent[x];
    }

    bool unite(int x, int y) {
        int rx = find(x), ry = find(y);
        if (rx == ry) return false;
        if (size_[rx] < size_[ry]) std::swap(rx, ry);
        parent[ry] = rx;
        size_[rx] += size_[ry];
        return true;
    }

    int getSize(int x) { return size_[find(x)]; }
};
```

### Time Complexity: Inverse Ackermann

With both path compression and union by rank/size, the amortized time per operation is O(α(n)), where α is the inverse Ackermann function. For all practical purposes, this is O(1) per operation. The total time for `m` operations on `n` elements is O(m · α(n)).

### Applications

| Application | How Union-Find Helps |
|-------------|---------------------|
| Connected components | Union edges, count distinct roots |
| Cycle detection (undirected) | If `find(u) == find(v)` before union, edge (u,v) creates a cycle |
| Kruskal's MST | Sort edges by weight, union vertices; skip edges that create cycles |
| Accounts merge | Group accounts by shared emails |
| Dynamic connectivity | Track connectivity as edges are added |
| Equivalence classes | Group elements with a transitive relationship |

## Common Patterns

1. **Component Counting:** Initialize a counter at `n` (number of nodes). Each successful union decrements the counter. The final count is the number of connected components.

2. **Cycle Detection in Undirected Graph:** For each edge (u, v), if `find(u) == find(v)`, adding this edge creates a cycle. This is the core of "redundant connection" problems.

3. **Edge Processing Order:** When combined with sorted edges (Kruskal's), Union-Find enables MST construction in O(E log E) time.

4. **Index Mapping for Non-Integer Keys:** When nodes are strings or pairs, use a hash map to assign integer IDs, then use standard Union-Find on those IDs.

5. **Weighted Union-Find:** Extend the structure with edge weights or offsets to track relationships between elements (e.g., "A is 3 units more than B"). Used in problems like "evaluate division."

---

## Practice Problems

### Problem 1: Number of Connected Components

**Problem Statement**

Given `n` nodes labeled `0` to `n-1` and a list of undirected edges, find the number of connected components in the graph.

```
Input:  n = 5, edges = [[0,1],[1,2],[3,4]]
Output: 2
Explanation: Components are {0,1,2} and {3,4}.

Input:  n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]
Output: 1
Explanation: All nodes are connected in a single component.
```

**Approach**

Initialize Union-Find with `n` nodes and a component counter set to `n`. For each edge, union the two endpoints. If they were in different components (union returns true), decrement the counter. The final counter value is the number of connected components. This approach is cleaner than running DFS/BFS from every unvisited node when you're already given an edge list.

**Pseudo-code**

```
function countComponents(n, edges):
    uf = UnionFind(n)
    components = n
    for each edge (u, v):
        if uf.unite(u, v):
            components -= 1
    return components
```

**C++ Solution**

```cpp
#include <vector>
#include <numeric>

class UnionFind {
    std::vector<int> parent, rank_;
public:
    UnionFind(int n) : parent(n), rank_(n, 0) {
        std::iota(parent.begin(), parent.end(), 0);
    }
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    bool unite(int x, int y) {
        int rx = find(x), ry = find(y);
        if (rx == ry) return false;
        if (rank_[rx] < rank_[ry]) std::swap(rx, ry);
        parent[ry] = rx;
        if (rank_[rx] == rank_[ry]) rank_[rx]++;
        return true;
    }
};

int countComponents(int n, std::vector<std::vector<int>>& edges) {
    UnionFind uf(n);
    int components = n;
    for (auto& e : edges) {
        if (uf.unite(e[0], e[1]))
            components--;
    }
    return components;
}
```

**Complexity Analysis**

- **Time:** O(n + E · α(n)) ≈ O(n + E) — initialization is O(n), each union/find is O(α(n)) amortized.
- **Space:** O(n) — for the parent and rank arrays.

---

### Problem 2: Redundant Connection

**Problem Statement**

A tree is a connected graph with no cycles. Given a graph that started as a tree with `n` nodes (labeled 1 to n) and had one additional edge added, find and return that extra edge. If there are multiple answers, return the edge that occurs last in the input.

```
Input:  edges = [[1,2],[1,3],[2,3]]
Output: [2,3]
Explanation: The tree is 1-2 and 1-3. Edge [2,3] creates a cycle.

Input:  edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]
Output: [1,4]
```

**Approach**

Process edges one by one using Union-Find. For each edge (u, v), check if `u` and `v` are already in the same component. If they are, this edge is redundant — it creates a cycle. Return it. Since we process edges in order and the problem guarantees exactly one extra edge, the last edge that connects two already-connected nodes is the answer.

**Pseudo-code**

```
function findRedundantConnection(edges):
    uf = UnionFind(n + 1)  // 1-indexed
    for each edge (u, v) in edges:
        if not uf.unite(u, v):
            return [u, v]
    return []
```

**C++ Solution**

```cpp
#include <vector>
#include <numeric>

class UnionFind {
    std::vector<int> parent, rank_;
public:
    UnionFind(int n) : parent(n), rank_(n, 0) {
        std::iota(parent.begin(), parent.end(), 0);
    }
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    bool unite(int x, int y) {
        int rx = find(x), ry = find(y);
        if (rx == ry) return false;
        if (rank_[rx] < rank_[ry]) std::swap(rx, ry);
        parent[ry] = rx;
        if (rank_[rx] == rank_[ry]) rank_[rx]++;
        return true;
    }
};

std::vector<int> findRedundantConnection(std::vector<std::vector<int>>& edges) {
    int n = edges.size();
    UnionFind uf(n + 1);
    for (auto& e : edges) {
        if (!uf.unite(e[0], e[1]))
            return e;
    }
    return {};
}
```

**Complexity Analysis**

- **Time:** O(n · α(n)) ≈ O(n) — process n edges, each with near-constant union/find.
- **Space:** O(n) — for the Union-Find arrays.

---

### Problem 3: Accounts Merge

**Problem Statement**

Given a list of accounts where `accounts[i] = [name, email1, email2, ...]`, merge accounts that share at least one common email. Two accounts belong to the same person if they share any email. Return the merged accounts, with each account's emails sorted.

```
Input: accounts = [
  ["John", "john@mail.com", "john_work@mail.com"],
  ["John", "john@mail.com", "john00@mail.com"],
  ["Mary", "mary@mail.com"],
  ["John", "johnny@mail.com"]
]
Output: [
  ["John", "john00@mail.com", "john@mail.com", "john_work@mail.com"],
  ["Mary", "mary@mail.com"],
  ["John", "johnny@mail.com"]
]
```

**Approach**

Map each email to an integer ID. For each account, union all emails in that account together (they belong to the same person). After processing all accounts, group emails by their root representative, sort each group, and prepend the account name. The key insight is that Union-Find naturally handles the transitive merging: if account A shares an email with account B, and account B shares an email with account C, all three merge into one.

**Pseudo-code**

```
function accountsMerge(accounts):
    emailToId = {}
    emailToName = {}
    id = 0
    uf = UnionFind(total_emails)

    for each account [name, e1, e2, ...]:
        for each email in account:
            if email not in emailToId:
                emailToId[email] = id++
            emailToName[email] = name
            union(emailToId[first_email], emailToId[email])

    groups = group emails by find(emailToId[email])
    result = []
    for each group:
        sort emails
        prepend name
        add to result
    return result
```

**C++ Solution**

```cpp
#include <vector>
#include <string>
#include <unordered_map>
#include <map>
#include <algorithm>
#include <numeric>

class UnionFind {
    std::vector<int> parent, rank_;
public:
    UnionFind(int n) : parent(n), rank_(n, 0) {
        std::iota(parent.begin(), parent.end(), 0);
    }
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    void unite(int x, int y) {
        int rx = find(x), ry = find(y);
        if (rx == ry) return;
        if (rank_[rx] < rank_[ry]) std::swap(rx, ry);
        parent[ry] = rx;
        if (rank_[rx] == rank_[ry]) rank_[rx]++;
    }
};

std::vector<std::vector<std::string>> accountsMerge(
        std::vector<std::vector<std::string>>& accounts) {
    std::unordered_map<std::string, int> emailToId;
    std::unordered_map<std::string, std::string> emailToName;
    int id = 0;

    for (auto& acc : accounts) {
        for (int i = 1; i < (int)acc.size(); i++) {
            if (!emailToId.count(acc[i]))
                emailToId[acc[i]] = id++;
            emailToName[acc[i]] = acc[0];
        }
    }

    UnionFind uf(id);
    for (auto& acc : accounts) {
        int firstId = emailToId[acc[1]];
        for (int i = 2; i < (int)acc.size(); i++) {
            uf.unite(firstId, emailToId[acc[i]]);
        }
    }

    std::unordered_map<int, std::vector<std::string>> groups;
    for (auto& [email, eid] : emailToId) {
        groups[uf.find(eid)].push_back(email);
    }

    std::vector<std::vector<std::string>> result;
    for (auto& [root, emails] : groups) {
        std::sort(emails.begin(), emails.end());
        std::string name = emailToName[emails[0]];
        emails.insert(emails.begin(), name);
        result.push_back(std::move(emails));
    }
    return result;
}
```

**Complexity Analysis**

- **Time:** O(n · k · α(n · k) + n · k · log(n · k)) where n is the number of accounts and k is the max emails per account. The union/find operations are near-constant, but sorting emails in each group adds the log factor.
- **Space:** O(n · k) — for the hash maps and Union-Find structure.

---

## Practice Resources

- [LeetCode 323 — Number of Connected Components in an Undirected Graph](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/) — Direct Union-Find application
- [LeetCode 684 — Redundant Connection](https://leetcode.com/problems/redundant-connection/) — Cycle detection with Union-Find
- [LeetCode 721 — Accounts Merge](https://leetcode.com/problems/accounts-merge/) — Union-Find with string mapping
- [LeetCode 547 — Number of Provinces](https://leetcode.com/problems/number-of-provinces/) — Connected components variant
- [GeeksforGeeks — Disjoint Set Union](https://www.geeksforgeeks.org/introduction-to-disjoint-set-data-structure-or-union-find-algorithm/) — Comprehensive DSU tutorial

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: DP Basics →](/docs/CodingTestPreparation/Standard/12_dp_basics)
