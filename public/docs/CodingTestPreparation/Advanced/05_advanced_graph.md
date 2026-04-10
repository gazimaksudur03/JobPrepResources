# Advanced Graph Algorithms

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

Graphs are the most versatile data structure in computer science. While basic BFS and DFS handle many scenarios, advanced graph problems demand specialised algorithms that exploit structure — edge weights, directed acyclicity, strong connectivity, or spanning properties. This section covers the core advanced algorithms that appear repeatedly in coding interviews and competitive programming: shortest-path algorithms (Dijkstra, Bellman-Ford, Floyd-Warshall), topological sorting, strongly connected components (Tarjan's and Kosaraju's), minimum spanning trees (Kruskal's and Prim's), and Eulerian paths/circuits.

Each algorithm targets a specific class of problems. **Dijkstra's algorithm** finds shortest paths from a single source in non-negative-weight graphs using a priority queue. **Bellman-Ford** handles negative edge weights and can detect negative cycles. **Floyd-Warshall** computes all-pairs shortest paths in O(V³). **Topological sort** linearises a DAG — essential for dependency resolution. **Strongly connected components** decompose a directed graph into maximal subgraphs where every vertex is reachable from every other. **Minimum spanning trees** find the cheapest subset of edges connecting all vertices.

Mastering these algorithms requires understanding not just the code but the invariants they maintain, their proof of correctness, and the precise conditions under which they apply. This guide provides detailed implementations, complexity analysis, and three classic interview problems.

## Key Concepts

### Dijkstra's Algorithm — Single-Source Shortest Path (Non-Negative Weights)

Dijkstra's algorithm maintains a priority queue of `(distance, vertex)` pairs. It repeatedly extracts the vertex with the smallest tentative distance and relaxes its neighbours. The key invariant: once a vertex is popped from the priority queue, its shortest distance is finalised.

```cpp
#include <vector>
#include <queue>
#include <climits>
using namespace std;

typedef pair<int,int> pii; // {weight, vertex}

vector<int> dijkstra(int src, const vector<vector<pii>>& adj) {
    int n = adj.size();
    vector<int> dist(n, INT_MAX);
    priority_queue<pii, vector<pii>, greater<pii>> pq;

    dist[src] = 0;
    pq.push({0, src});

    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue; // stale entry
        for (auto [w, v] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}
```

**Complexity:** O((V + E) log V) with a binary heap. With a Fibonacci heap, O(V log V + E), but this is rarely used in practice.

**Caveat:** Does not work with negative edge weights — use Bellman-Ford instead.

### Bellman-Ford — Handles Negative Edges

Bellman-Ford relaxes all edges V-1 times. If any distance improves on the V-th iteration, a negative-weight cycle exists.

```cpp
struct Edge { int u, v, w; };

vector<int> bellmanFord(int src, int n, const vector<Edge>& edges) {
    vector<int> dist(n, INT_MAX);
    dist[src] = 0;

    for (int i = 0; i < n - 1; ++i)
        for (const auto& [u, v, w] : edges)
            if (dist[u] != INT_MAX && dist[u] + w < dist[v])
                dist[v] = dist[u] + w;

    // Negative cycle detection
    for (const auto& [u, v, w] : edges)
        if (dist[u] != INT_MAX && dist[u] + w < dist[v])
            throw runtime_error("Negative cycle detected");

    return dist;
}
```

**Complexity:** O(V × E).

### Floyd-Warshall — All-Pairs Shortest Path

Uses DP: `dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])` for all intermediate vertices k.

```cpp
void floydWarshall(vector<vector<int>>& dist, int n) {
    // dist[i][j] initialised to edge weight or INF
    for (int k = 0; k < n; ++k)
        for (int i = 0; i < n; ++i)
            for (int j = 0; j < n; ++j)
                if (dist[i][k] != INT_MAX && dist[k][j] != INT_MAX)
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
}
```

**Complexity:** O(V³). Use when V is small (≤ 400–500) and you need all-pairs shortest paths.

### Topological Sort

A linear ordering of vertices in a DAG such that for every directed edge u → v, u appears before v. Two approaches:

#### Kahn's Algorithm (BFS)

```cpp
vector<int> topoSortBFS(int n, const vector<vector<int>>& adj) {
    vector<int> inDeg(n, 0);
    for (int u = 0; u < n; ++u)
        for (int v : adj[u]) inDeg[v]++;

    queue<int> q;
    for (int i = 0; i < n; ++i)
        if (inDeg[i] == 0) q.push(i);

    vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : adj[u])
            if (--inDeg[v] == 0) q.push(v);
    }

    if ((int)order.size() != n)
        throw runtime_error("Cycle detected — not a DAG");
    return order;
}
```

#### DFS-Based

```cpp
vector<int> order;
vector<bool> visited;

void dfsTopo(int u, const vector<vector<int>>& adj) {
    visited[u] = true;
    for (int v : adj[u])
        if (!visited[v]) dfsTopo(v, adj);
    order.push_back(u);
}

vector<int> topoSortDFS(int n, const vector<vector<int>>& adj) {
    visited.assign(n, false);
    order.clear();
    for (int i = 0; i < n; ++i)
        if (!visited[i]) dfsTopo(i, adj);
    reverse(order.begin(), order.end());
    return order;
}
```

### Strongly Connected Components

An SCC is a maximal set of vertices where every vertex is reachable from every other.

#### Kosaraju's Algorithm — Two-Pass DFS

1. DFS on the original graph, recording finish order.
2. Transpose the graph (reverse all edges).
3. DFS on the transposed graph in reverse finish order — each DFS tree is an SCC.

```cpp
class Kosaraju {
    int n;
    vector<vector<int>> adj, radj;
    vector<bool> visited;
    vector<int> order;
    vector<int> comp;

    void dfs1(int u) {
        visited[u] = true;
        for (int v : adj[u])
            if (!visited[v]) dfs1(v);
        order.push_back(u);
    }

    void dfs2(int u, int label) {
        comp[u] = label;
        for (int v : radj[u])
            if (comp[v] == -1) dfs2(v, label);
    }

public:
    Kosaraju(int n) : n(n), adj(n), radj(n), visited(n, false), comp(n, -1) {}

    void addEdge(int u, int v) {
        adj[u].push_back(v);
        radj[v].push_back(u);
    }

    int findSCCs() {
        for (int i = 0; i < n; ++i)
            if (!visited[i]) dfs1(i);
        int numSCC = 0;
        for (int i = n - 1; i >= 0; --i)
            if (comp[order[i]] == -1)
                dfs2(order[i], numSCC++);
        return numSCC;
    }

    vector<int> getComponents() const { return comp; }
};
```

**Complexity:** O(V + E).

#### Tarjan's Algorithm

Uses a single DFS with a stack and low-link values. When `low[u] == disc[u]`, pop the stack to form an SCC. Slightly more complex to implement but avoids building the reverse graph.

### Minimum Spanning Tree

#### Kruskal's Algorithm — Edge-Based, O(E log E)

Sort edges by weight. Greedily add edges that connect different components (using Union-Find).

```cpp
class DSU {
    vector<int> parent, rank_;
public:
    DSU(int n) : parent(n), rank_(n, 0) {
        iota(parent.begin(), parent.end(), 0);
    }
    int find(int x) {
        return parent[x] == x ? x : parent[x] = find(parent[x]);
    }
    bool unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;
        if (rank_[a] < rank_[b]) swap(a, b);
        parent[b] = a;
        if (rank_[a] == rank_[b]) rank_[a]++;
        return true;
    }
};

long long kruskal(int n, vector<tuple<int,int,int>>& edges) {
    sort(edges.begin(), edges.end());
    DSU dsu(n);
    long long mstWeight = 0;
    int edgeCount = 0;
    for (auto& [w, u, v] : edges) {
        if (dsu.unite(u, v)) {
            mstWeight += w;
            if (++edgeCount == n - 1) break;
        }
    }
    return mstWeight;
}
```

#### Prim's Algorithm — Vertex-Based, O((V + E) log V)

Start from any vertex, greedily add the cheapest edge crossing the cut (using a priority queue).

```cpp
long long prim(int n, const vector<vector<pii>>& adj) {
    vector<bool> inMST(n, false);
    priority_queue<pii, vector<pii>, greater<pii>> pq;
    pq.push({0, 0});
    long long total = 0;
    int count = 0;

    while (count < n && !pq.empty()) {
        auto [w, u] = pq.top(); pq.pop();
        if (inMST[u]) continue;
        inMST[u] = true;
        total += w;
        count++;
        for (auto [wt, v] : adj[u])
            if (!inMST[v]) pq.push({wt, v});
    }
    return total;
}
```

### Euler Path / Circuit

An **Euler circuit** visits every edge exactly once and returns to the start. An **Euler path** visits every edge exactly once but may end at a different vertex.

**Existence conditions:**
- Euler circuit (undirected): all vertices have even degree.
- Euler path (undirected): exactly 0 or 2 vertices have odd degree.
- Euler circuit (directed): in-degree = out-degree for all vertices.
- Euler path (directed): at most one vertex with out - in = 1, at most one with in - out = 1.

**Hierholzer's algorithm** finds the circuit/path in O(V + E) by following edges and splicing cycles.

## Common Patterns

### Pattern 1: Modified Dijkstra — State Space Expansion

When the problem involves additional state (e.g., "at most K stops"), expand the node to `(cost, vertex, remaining_stops)` and run Dijkstra on this augmented graph.

### Pattern 2: 0-1 BFS

When edge weights are only 0 or 1, use a deque instead of a priority queue: push weight-0 edges to the front, weight-1 edges to the back. O(V + E).

### Pattern 3: Topological Sort + DP

Many DAG problems (longest path, counting paths, scheduling) combine topological sort with dynamic programming.

### Pattern 4: SCC Condensation

After finding SCCs, contract each SCC into a single super-node. The resulting DAG enables topological-sort-based DP for problems on directed graphs with cycles.

---

## Practice Problems

### Problem 1: Shortest Path in a Weighted Graph (Dijkstra)

**Problem Statement**

Given a directed graph with N vertices and M edges (each with a non-negative weight), find the shortest path distance from vertex 0 to vertex N-1. If no path exists, output -1.

*Input:*
```
N=5, M=6
Edges: (0,1,4), (0,2,1), (2,1,2), (1,3,1), (2,3,5), (3,4,3)
```
*Output:* `7` (path: 0 → 2 → 1 → 3 → 4, cost: 1+2+1+3)

**Approach**

Run Dijkstra from vertex 0 using a min-heap of `(distance, vertex)`. After the algorithm terminates, `dist[N-1]` is the answer. Skip stale entries where the popped distance exceeds the known best.

**Pseudo-code**

```
dist[0..N-1] = INF
dist[0] = 0
pq = min-heap with (0, 0)
while pq not empty:
    (d, u) = pq.extract_min()
    if d > dist[u]: continue
    for each (v, w) in adj[u]:
        if dist[u] + w < dist[v]:
            dist[v] = dist[u] + w
            pq.insert(dist[v], v)
return dist[N-1]
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    cin >> n >> m;

    vector<vector<pair<int,int>>> adj(n); // {vertex, weight}
    for (int i = 0; i < m; ++i) {
        int u, v, w;
        cin >> u >> v >> w;
        adj[u].push_back({v, w});
    }

    vector<long long> dist(n, LLONG_MAX);
    priority_queue<pair<long long,int>, vector<pair<long long,int>>,
                   greater<pair<long long,int>>> pq;

    dist[0] = 0;
    pq.push({0, 0});

    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;
        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }

    if (dist[n - 1] == LLONG_MAX)
        cout << -1 << '\n';
    else
        cout << dist[n - 1] << '\n';

    return 0;
}
```

**Complexity Analysis**

- **Time:** O((V + E) log V) — each vertex is extracted at most once (with the stale-entry optimisation), and each edge causes at most one push.
- **Space:** O(V + E) for adjacency list and priority queue.

---

### Problem 2: Detect Negative Cycle (Bellman-Ford)

**Problem Statement**

Given a directed graph with N vertices and M weighted edges (weights can be negative), determine whether the graph contains a negative-weight cycle. If yes, output "YES" and print one such cycle. If no, output "NO".

*Input:*
```
N=4, M=4
Edges: (0,1,1), (1,2,-1), (2,3,-1), (3,1,-1)
```
*Output:*
```
YES
Cycle: 1 → 2 → 3 → 1
```

**Approach**

Run Bellman-Ford for V-1 iterations. On the V-th iteration, if any edge `(u, v, w)` can still be relaxed (`dist[u] + w < dist[v]`), a negative cycle exists. To reconstruct the cycle: record the predecessor array, take any vertex `v` that was relaxed on the V-th iteration, trace back V times to guarantee you are inside the cycle, then follow predecessors until you return to the same vertex.

**Pseudo-code**

```
dist[0..N-1] = INF, dist[0] = 0
prev[0..N-1] = -1

for i = 1 to N-1:
    for each edge (u, v, w):
        if dist[u] + w < dist[v]:
            dist[v] = dist[u] + w
            prev[v] = u

// N-th iteration — detect
x = -1
for each edge (u, v, w):
    if dist[u] + w < dist[v]:
        x = v
        prev[v] = u
        break

if x == -1: print "NO"
else:
    // Trace back N times to reach cycle
    y = x
    for i = 0 to N-1: y = prev[y]
    // Follow from y until y repeats
    cycle = [y]
    cur = prev[y]
    while cur != y:
        cycle.prepend(cur)
        cur = prev[cur]
    cycle.prepend(y)
    print "YES", cycle
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
#include <climits>
#include <algorithm>
using namespace std;

struct Edge { int u, v, w; };

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    cin >> n >> m;

    vector<Edge> edges(m);
    for (auto& [u, v, w] : edges) cin >> u >> v >> w;

    vector<long long> dist(n, 0); // initialise to 0 to detect cycles from any component
    vector<int> prev(n, -1);
    int x = -1;

    for (int i = 0; i < n; ++i) {
        x = -1;
        for (const auto& [u, v, w] : edges) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                prev[v] = u;
                x = v;
            }
        }
    }

    if (x == -1) {
        cout << "NO\n";
    } else {
        cout << "YES\n";

        // Walk back n times to ensure we are in the cycle
        int y = x;
        for (int i = 0; i < n; ++i) y = prev[y];

        // Trace the cycle
        vector<int> cycle;
        int cur = y;
        do {
            cycle.push_back(cur);
            cur = prev[cur];
        } while (cur != y);
        cycle.push_back(y);

        reverse(cycle.begin(), cycle.end());
        cout << "Cycle: ";
        for (int i = 0; i < (int)cycle.size(); ++i) {
            cout << cycle[i];
            if (i + 1 < (int)cycle.size()) cout << " -> ";
        }
        cout << '\n';
    }

    return 0;
}
```

**Complexity Analysis**

- **Time:** O(V × E) — V iterations, each relaxing all E edges.
- **Space:** O(V + E) for distance, predecessor arrays, and edge list.

---

### Problem 3: Find All Strongly Connected Components (Kosaraju's Algorithm)

**Problem Statement**

Given a directed graph with N vertices and M edges, find all strongly connected components and output them.

*Input:*
```
N=8, M=9
Edges: (0,1), (1,2), (2,0), (2,3), (3,4), (4,5), (5,3), (6,5), (6,7)
```
*Output:*
```
SCC 0: {0, 1, 2}
SCC 1: {3, 4, 5}
SCC 2: {6}
SCC 3: {7}
```

**Approach**

Kosaraju's algorithm:
1. Run DFS on the original graph and record vertices by finish time.
2. Build the transposed graph (reverse all edges).
3. Process vertices in reverse finish order; each DFS on the transposed graph discovers one SCC.

The correctness relies on the property that SCCs in the reverse graph are the same as in the original graph, and processing in reverse finish order ensures we don't "escape" from one SCC into another.

**Pseudo-code**

```
Phase 1: DFS on original graph
    for each unvisited vertex u:
        dfs1(u): visit neighbours, then push u onto stack

Phase 2: Build transpose graph

Phase 3: Process in stack order on transpose
    while stack not empty:
        u = stack.pop()
        if unvisited in transpose:
            dfs2(u) on transpose — all reached vertices form one SCC
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class KosarajuSCC {
    int n;
    vector<vector<int>> adj, radj;
    vector<bool> visited;
    vector<int> order;
    vector<int> compId;
    vector<vector<int>> components;

    void dfs1(int u) {
        visited[u] = true;
        for (int v : adj[u])
            if (!visited[v]) dfs1(v);
        order.push_back(u);
    }

    void dfs2(int u, int label) {
        compId[u] = label;
        components[label].push_back(u);
        for (int v : radj[u])
            if (compId[v] == -1) dfs2(v, label);
    }

public:
    KosarajuSCC(int n) : n(n), adj(n), radj(n), visited(n, false), compId(n, -1) {}

    void addEdge(int u, int v) {
        adj[u].push_back(v);
        radj[v].push_back(u);
    }

    int solve() {
        // Phase 1: finish order
        for (int i = 0; i < n; ++i)
            if (!visited[i]) dfs1(i);

        // Phase 2: reverse finish order on transposed graph
        int numSCC = 0;
        for (int i = n - 1; i >= 0; --i) {
            int u = order[i];
            if (compId[u] == -1) {
                components.emplace_back();
                dfs2(u, numSCC++);
            }
        }
        return numSCC;
    }

    const vector<vector<int>>& getComponents() const { return components; }
    const vector<int>& getCompId() const { return compId; }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    cin >> n >> m;

    KosarajuSCC scc(n);
    for (int i = 0; i < m; ++i) {
        int u, v;
        cin >> u >> v;
        scc.addEdge(u, v);
    }

    int numSCC = scc.solve();
    cout << "Number of SCCs: " << numSCC << '\n';

    const auto& comps = scc.getComponents();
    for (int i = 0; i < numSCC; ++i) {
        cout << "SCC " << i << ": {";
        for (int j = 0; j < (int)comps[i].size(); ++j) {
            cout << comps[i][j];
            if (j + 1 < (int)comps[i].size()) cout << ", ";
        }
        cout << "}\n";
    }

    return 0;
}
```

**Complexity Analysis**

- **Time:** O(V + E) — two DFS traversals, each visiting every vertex and edge once.
- **Space:** O(V + E) for both adjacency lists (original and transposed), visited array, order stack, and component labels.

---

## Practice Resources

- [LeetCode 743 — Network Delay Time](https://leetcode.com/problems/network-delay-time/) — Dijkstra's algorithm
- [LeetCode 787 — Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/) — modified Bellman-Ford / Dijkstra
- [LeetCode 207 — Course Schedule](https://leetcode.com/problems/course-schedule/) — topological sort / cycle detection
- [cp-algorithms — Strongly Connected Components](https://cp-algorithms.com/graph/strongly-connected-components.html) — Kosaraju's and Tarjan's
- [cp-algorithms — Minimum Spanning Tree](https://cp-algorithms.com/graph/mst_kruskal.html) — Kruskal's with DSU

---

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: Advanced DP →](/docs/CodingTestPreparation/Advanced/06_advanced_dp)
