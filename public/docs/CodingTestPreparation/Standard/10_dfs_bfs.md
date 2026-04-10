# DFS and BFS

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

Depth-First Search (DFS) and Breadth-First Search (BFS) are the two fundamental graph and tree traversal strategies, and they appear in an enormous number of interview problems. Understanding them deeply — not just their implementation, but when to choose one over the other — is essential for handling any graph or tree question confidently.

**DFS** explores as deep as possible along each branch before backtracking. It uses a stack (either the call stack via recursion or an explicit stack) and is naturally suited for problems that require exploring all paths, detecting cycles, or computing properties that depend on subtree results (like tree height or connected components). **BFS** explores all neighbors at the current depth level before moving to the next level. It uses a queue and is the go-to algorithm for finding shortest paths in unweighted graphs and for level-order traversal of trees.

Both algorithms run in O(V + E) time for graphs and O(n) for trees. The choice between them depends on the problem: if you need shortest distance, use BFS; if you need to explore all reachable nodes, detect cycles, or compute recursive properties, DFS is typically more natural. Many problems can technically be solved with either, but one is usually cleaner and more efficient for the specific task.

## Key Concepts

### DFS — Recursive Implementation

The simplest DFS uses recursion, leveraging the call stack as an implicit stack:

```cpp
#include <vector>

void dfs(int node, std::vector<std::vector<int>>& adj, std::vector<bool>& visited) {
    visited[node] = true;
    for (int neighbor : adj[node]) {
        if (!visited[neighbor]) {
            dfs(neighbor, adj, visited);
        }
    }
}
```

**Execution order:** DFS visits a node, then immediately recurses into the first unvisited neighbor, going as deep as possible before backtracking.

### DFS — Iterative Implementation

When recursion depth might cause a stack overflow (e.g., a graph with 10⁶ nodes in a linear chain), use an explicit stack:

```cpp
#include <vector>
#include <stack>

void dfsIterative(int start, std::vector<std::vector<int>>& adj, std::vector<bool>& visited) {
    std::stack<int> stk;
    stk.push(start);
    while (!stk.empty()) {
        int node = stk.top();
        stk.pop();
        if (visited[node]) continue;
        visited[node] = true;
        for (int neighbor : adj[node]) {
            if (!visited[neighbor]) {
                stk.push(neighbor);
            }
        }
    }
}
```

Note: The iterative version may visit nodes in a different order than recursive DFS (it processes the last-pushed neighbor first), but both visit all reachable nodes.

### BFS Implementation

BFS uses a queue to process nodes level by level:

```cpp
#include <vector>
#include <queue>

void bfs(int start, std::vector<std::vector<int>>& adj, std::vector<bool>& visited) {
    std::queue<int> q;
    q.push(start);
    visited[start] = true;
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        for (int neighbor : adj[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
}
```

**Critical detail:** Mark nodes as visited when they are **enqueued**, not when they are dequeued. This prevents the same node from being added to the queue multiple times.

### BFS for Shortest Path (Unweighted Graph)

BFS naturally finds the shortest path in unweighted graphs because it explores all nodes at distance `d` before any node at distance `d+1`:

```cpp
std::vector<int> shortestPath(int start, std::vector<std::vector<int>>& adj, int n) {
    std::vector<int> dist(n, -1);
    std::queue<int> q;
    dist[start] = 0;
    q.push(start);
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        for (int neighbor : adj[node]) {
            if (dist[neighbor] == -1) {
                dist[neighbor] = dist[node] + 1;
                q.push(neighbor);
            }
        }
    }
    return dist;
}
```

### DFS on Grids

Many interview problems use 2D grids as implicit graphs. Each cell is a node, and edges connect to its 4 (or 8) neighbors:

```cpp
int dx[] = {0, 0, 1, -1};
int dy[] = {1, -1, 0, 0};

void dfsGrid(int r, int c, std::vector<std::vector<char>>& grid,
             std::vector<std::vector<bool>>& visited) {
    int rows = grid.size(), cols = grid[0].size();
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    if (visited[r][c] || grid[r][c] == '0') return;

    visited[r][c] = true;
    for (int d = 0; d < 4; d++) {
        dfsGrid(r + dx[d], c + dy[d], grid, visited);
    }
}
```

### Applications Overview

| Application | Preferred Algorithm | Why |
|-------------|-------------------|-----|
| Connected components | DFS or BFS | Both work equally well |
| Shortest path (unweighted) | BFS | BFS explores level by level |
| Cycle detection (directed) | DFS | Track "in current path" state |
| Cycle detection (undirected) | DFS or BFS | DFS is simpler with parent tracking |
| Topological sort | DFS | Post-order gives reverse topo order |
| Level-order traversal | BFS | Naturally processes level by level |
| Path existence | DFS or BFS | Both work |
| Flood fill | DFS or BFS | Both work; DFS is simpler recursively |

### Cycle Detection in Directed Graphs

Use three states: unvisited (white), in-progress (gray), and completed (black). A back edge to a gray node indicates a cycle:

```cpp
enum State { WHITE, GRAY, BLACK };

bool hasCycleDFS(int node, std::vector<std::vector<int>>& adj, std::vector<State>& state) {
    state[node] = GRAY;
    for (int neighbor : adj[node]) {
        if (state[neighbor] == GRAY) return true;    // back edge = cycle
        if (state[neighbor] == WHITE && hasCycleDFS(neighbor, adj, state))
            return true;
    }
    state[node] = BLACK;
    return false;
}
```

## Common Patterns

1. **Grid DFS/BFS for Connected Regions:** Treat each cell as a graph node. Use DFS/BFS to flood-fill connected regions (islands, rooms, enclosed areas).

2. **BFS Level Tracking:** Process BFS level by level by draining the queue in batches of `queue.size()` per level. Essential for tree level-order traversal and minimum-steps problems.

3. **Multi-source BFS:** Start BFS from multiple sources simultaneously (push all sources into the queue initially). Used for "distance from nearest X" problems.

4. **DFS with State:** Augment DFS with a state array (white/gray/black) for cycle detection in directed graphs, or a parent tracker for undirected graphs.

5. **Topological Sort via DFS:** Run DFS on all unvisited nodes, push each node to a result stack after all its descendants are processed (post-order). The stack order is a valid topological sort.

6. **BFS on Implicit Graphs:** The graph isn't given explicitly — states are nodes, and transitions are edges. Examples: word ladder, sliding puzzle, minimum operations to reach a target.

---

## Practice Problems

### Problem 1: Number of Islands

**Problem Statement**

Given an `m × n` 2D grid of `'1'`s (land) and `'0'`s (water), count the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.

```
Input:  grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
Output: 3

Input:  grid = [
  ["1","1","1"],
  ["0","1","0"],
  ["1","1","1"]
]
Output: 1
```

**Approach**

Iterate through every cell. When we find an unvisited `'1'`, we've discovered a new island — increment the count and use DFS (or BFS) to mark all connected `'1'` cells as visited. This flood-fill ensures we don't count the same island twice. Each cell is visited at most once, so the total work is O(m × n).

**Pseudo-code**

```
function numIslands(grid):
    count = 0
    for r = 0 to rows-1:
        for c = 0 to cols-1:
            if grid[r][c] == '1':
                count += 1
                dfs(r, c, grid)    // mark entire island as visited
    return count

function dfs(r, c, grid):
    if r or c out of bounds or grid[r][c] != '1': return
    grid[r][c] = '0'              // mark visited by sinking the land
    dfs(r-1, c, grid)
    dfs(r+1, c, grid)
    dfs(r, c-1, grid)
    dfs(r, c+1, grid)
```

**C++ Solution**

```cpp
#include <vector>

class Solution {
public:
    int numIslands(std::vector<std::vector<char>>& grid) {
        int rows = grid.size();
        if (rows == 0) return 0;
        int cols = grid[0].size();
        int count = 0;

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == '1') {
                    count++;
                    dfs(r, c, grid, rows, cols);
                }
            }
        }
        return count;
    }

private:
    void dfs(int r, int c, std::vector<std::vector<char>>& grid, int rows, int cols) {
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != '1') return;
        grid[r][c] = '0';
        dfs(r + 1, c, grid, rows, cols);
        dfs(r - 1, c, grid, rows, cols);
        dfs(r, c + 1, grid, rows, cols);
        dfs(r, c - 1, grid, rows, cols);
    }
};
```

**Complexity Analysis**

- **Time:** O(m × n) — every cell is visited at most once.
- **Space:** O(m × n) in the worst case for the recursion stack (a grid entirely of `'1'`s forms one giant island with depth m×n). Iterative BFS would use O(min(m, n)) queue space for a rectangular grid.

---

### Problem 2: Binary Tree Level Order Traversal

**Problem Statement**

Given the root of a binary tree, return the level-order traversal of its nodes' values (i.e., from left to right, level by level).

```
Input:  root = [3, 9, 20, null, null, 15, 7]
          3
         / \
        9  20
           / \
          15   7
Output: [[3], [9, 20], [15, 7]]

Input:  root = [1]
Output: [[1]]
```

**Approach**

BFS is the natural fit because it processes nodes level by level. Use a queue. At each level, record the current queue size (this is the number of nodes at this level), process exactly that many nodes, and for each node add its children to the queue. This cleanly separates nodes into levels.

**Pseudo-code**

```
function levelOrder(root):
    if root is null: return []
    result = []
    queue = [root]
    while queue is not empty:
        levelSize = queue.size()
        level = []
        for i = 0 to levelSize - 1:
            node = queue.dequeue()
            level.append(node.val)
            if node.left: queue.enqueue(node.left)
            if node.right: queue.enqueue(node.right)
        result.append(level)
    return result
```

**C++ Solution**

```cpp
#include <vector>
#include <queue>

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

std::vector<std::vector<int>> levelOrder(TreeNode* root) {
    std::vector<std::vector<int>> result;
    if (!root) return result;

    std::queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int levelSize = q.size();
        std::vector<int> level;
        level.reserve(levelSize);
        for (int i = 0; i < levelSize; i++) {
            TreeNode* node = q.front();
            q.pop();
            level.push_back(node->val);
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        result.push_back(std::move(level));
    }
    return result;
}
```

**Complexity Analysis**

- **Time:** O(n) — every node is enqueued and dequeued exactly once.
- **Space:** O(n) — the queue holds at most one level of nodes at a time. The widest level of a binary tree can have up to n/2 nodes (the leaf level of a perfect tree).

---

### Problem 3: Course Schedule (Cycle Detection)

**Problem Statement**

There are `numCourses` courses labeled `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [a, b]` means you must take course `b` before course `a`. Return `true` if you can finish all courses (i.e., the prerequisite graph has no cycle).

```
Input:  numCourses = 2, prerequisites = [[1,0]]
Output: true
Explanation: Take course 0, then course 1.

Input:  numCourses = 2, prerequisites = [[1,0],[0,1]]
Output: false
Explanation: Courses 0 and 1 are prerequisites of each other — circular dependency.
```

**Approach**

Model courses as nodes and prerequisites as directed edges. The question reduces to: does the directed graph contain a cycle? Use DFS with three states (WHITE = unvisited, GRAY = in current DFS path, BLACK = fully processed). If DFS encounters a GRAY node, there is a cycle (a back edge). If all nodes can be processed without encountering a GRAY node, the graph is acyclic and all courses can be completed.

An alternative approach uses BFS-based topological sort (Kahn's algorithm): repeatedly remove nodes with in-degree 0. If all nodes are removed, no cycle exists.

**Pseudo-code**

```
function canFinish(numCourses, prerequisites):
    build adjacency list from prerequisites
    state = array of WHITE for each course
    for each course:
        if state[course] == WHITE:
            if dfsCycle(course, adj, state):
                return false
    return true

function dfsCycle(node, adj, state):
    state[node] = GRAY
    for neighbor in adj[node]:
        if state[neighbor] == GRAY: return true      // cycle found
        if state[neighbor] == WHITE:
            if dfsCycle(neighbor, adj, state): return true
    state[node] = BLACK
    return false
```

**C++ Solution**

```cpp
#include <vector>

class Solution {
    enum State { WHITE, GRAY, BLACK };

    bool hasCycle(int node, std::vector<std::vector<int>>& adj, std::vector<State>& state) {
        state[node] = GRAY;
        for (int next : adj[node]) {
            if (state[next] == GRAY) return true;
            if (state[next] == WHITE && hasCycle(next, adj, state))
                return true;
        }
        state[node] = BLACK;
        return false;
    }

public:
    bool canFinish(int numCourses, std::vector<std::vector<int>>& prerequisites) {
        std::vector<std::vector<int>> adj(numCourses);
        for (auto& p : prerequisites) {
            adj[p[1]].push_back(p[0]);
        }

        std::vector<State> state(numCourses, WHITE);
        for (int i = 0; i < numCourses; i++) {
            if (state[i] == WHITE && hasCycle(i, adj, state))
                return false;
        }
        return true;
    }
};
```

**Complexity Analysis**

- **Time:** O(V + E) where V = `numCourses` and E = number of prerequisites. Each node and edge is visited at most once.
- **Space:** O(V + E) — adjacency list takes O(V + E), the state array and recursion stack each take O(V).

---

## Practice Resources

- [LeetCode 200 — Number of Islands](https://leetcode.com/problems/number-of-islands/) — Classic grid DFS/BFS
- [LeetCode 102 — Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/) — BFS on trees
- [LeetCode 207 — Course Schedule](https://leetcode.com/problems/course-schedule/) — Cycle detection in directed graph
- [LeetCode 133 — Clone Graph](https://leetcode.com/problems/clone-graph/) — DFS/BFS graph traversal
- [GeeksforGeeks — BFS and DFS on Graphs](https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/) — Theory and implementation

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: Union-Find →](/docs/CodingTestPreparation/Standard/11_union_find)
