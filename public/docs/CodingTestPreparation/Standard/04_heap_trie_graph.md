# Heap, Trie, and Graph Basics

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

Heaps, tries, and graphs are three data structures that unlock entirely new categories of problems. A heap (priority queue) efficiently tracks the minimum or maximum element in a dynamic collection, making it indispensable for "top K", scheduling, and shortest-path problems. Unlike sorted arrays, heaps support both insertion and extraction of the extreme element in O(log n).

A trie (prefix tree) is a tree structure optimized for string operations. While a hash map can check if a word exists in O(L) time (where L is the word length), a trie can also answer prefix queries — "are there any words starting with 'pre'?" — which hash maps cannot do efficiently. Tries appear in autocomplete systems, spell checkers, and IP routing.

Graphs are the most general data structure, capable of modeling relationships between any set of entities. Social networks, road maps, dependency systems, and the internet itself are all graphs. Understanding how to represent graphs and traverse them (BFS and DFS) is prerequisite knowledge for dozens of interview problems including shortest paths, connected components, topological sort, and cycle detection.

## Key Concepts

### Min-Heap and Max-Heap

A heap is a complete binary tree stored as an array where each parent has a specific ordering relationship with its children:

- **Min-heap:** parent ≤ children (root is the minimum)
- **Max-heap:** parent ≥ children (root is the maximum)

For an element at index `i`:
- Parent: `(i - 1) / 2`
- Left child: `2 * i + 1`
- Right child: `2 * i + 2`

### Heapify

The process of maintaining the heap property after insertion or removal:

```cpp
// Heapify down (for extraction): O(log n)
void heapifyDown(std::vector<int>& heap, int i, int n) {
    int smallest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && heap[left] < heap[smallest]) smallest = left;
    if (right < n && heap[right] < heap[smallest]) smallest = right;

    if (smallest != i) {
        std::swap(heap[i], heap[smallest]);
        heapifyDown(heap, smallest, n);
    }
}

// Build heap from array: O(n) — NOT O(n log n)!
void buildHeap(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = n / 2 - 1; i >= 0; --i)
        heapifyDown(arr, i, n);
}
```

Building a heap is O(n), not O(n log n), because most nodes are near the bottom and require very little work.

### priority_queue in C++

C++ provides a ready-to-use heap as `std::priority_queue`:

```cpp
#include <queue>

// Max-heap (default)
std::priority_queue<int> maxHeap;
maxHeap.push(10);
maxHeap.push(5);
maxHeap.push(20);
// maxHeap.top() == 20

// Min-heap
std::priority_queue<int, std::vector<int>, std::greater<int>> minHeap;
minHeap.push(10);
minHeap.push(5);
minHeap.push(20);
// minHeap.top() == 5
```

### Trie (Prefix Tree)

A trie stores strings character-by-character in a tree. Each edge represents a character, and each node represents a prefix. Nodes can be marked as "end of word."

```cpp
struct TrieNode {
    TrieNode* children[26];
    bool isEndOfWord;

    TrieNode() : isEndOfWord(false) {
        for (int i = 0; i < 26; ++i)
            children[i] = nullptr;
    }
};

class Trie {
    TrieNode* root;
public:
    Trie() : root(new TrieNode()) {}

    void insert(const std::string& word) {
        TrieNode* curr = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!curr->children[idx])
                curr->children[idx] = new TrieNode();
            curr = curr->children[idx];
        }
        curr->isEndOfWord = true;
    }

    bool search(const std::string& word) {
        TrieNode* curr = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!curr->children[idx]) return false;
            curr = curr->children[idx];
        }
        return curr->isEndOfWord;
    }

    bool startsWith(const std::string& prefix) {
        TrieNode* curr = root;
        for (char c : prefix) {
            int idx = c - 'a';
            if (!curr->children[idx]) return false;
            curr = curr->children[idx];
        }
        return true;
    }
};
```

### Graph Representations

**Adjacency List** — most common, efficient for sparse graphs:

```cpp
#include <vector>

int n = 5; // number of vertices
std::vector<std::vector<int>> adj(n);

// Add undirected edge between u and v
adj[0].push_back(1);
adj[1].push_back(0);
```

**Adjacency Matrix** — good for dense graphs or when you need O(1) edge lookup:

```cpp
std::vector<std::vector<int>> matrix(n, std::vector<int>(n, 0));
matrix[0][1] = 1; // edge from 0 to 1
matrix[1][0] = 1; // undirected
```

**Edge List** — simple list of edges, useful for Kruskal's algorithm:

```cpp
struct Edge {
    int u, v, weight;
};
std::vector<Edge> edges;
edges.push_back({0, 1, 5});
```

**Comparison:**

| Representation | Space | Check Edge | Iterate Neighbors |
|---------------|-------|------------|-------------------|
| Adjacency List | O(V + E) | O(degree) | O(degree) |
| Adjacency Matrix | O(V²) | O(1) | O(V) |
| Edge List | O(E) | O(E) | O(E) |

### Directed vs Undirected, Weighted vs Unweighted

- **Undirected:** edge (u, v) implies edge (v, u). Add both directions in adjacency list.
- **Directed:** edge (u, v) does NOT imply (v, u). Add only one direction.
- **Weighted:** store weight alongside the neighbor: `vector<vector<pair<int,int>>> adj;`
- **Unweighted:** treat all edges as weight 1. BFS gives shortest paths.

## Common Patterns

### Heap for Top-K Problems
Maintain a min-heap of size K for "K largest" or max-heap of size K for "K smallest". This avoids sorting the entire array.

### Trie for Prefix Matching
Whenever a problem involves checking prefixes, autocomplete, or word dictionaries, consider a trie. It's also used in the word search II problem (backtracking + trie).

### BFS for Shortest Path in Unweighted Graphs
BFS explores nodes level by level, so the first time it reaches a node is via the shortest path. Use a queue.

### DFS for Connected Components
Run DFS from each unvisited node. Each DFS call explores one connected component.

### Graph as Implicit Structure
Many problems have hidden graph structures: word ladder (words are nodes, single-character changes are edges), matrix traversal (cells are nodes, adjacent cells are edges).

---

## Practice Problems

### Problem 1: Kth Largest Element Using Min-Heap

**Problem Statement**

Given an integer array `nums` and an integer `k`, return the kth largest element in the array. Note that it is the kth largest element in sorted order, not the kth distinct element.

Input: `nums = [3,2,1,5,6,4]`, `k = 2`
Output: `5`

Input: `nums = [3,2,3,1,2,4,5,5,6]`, `k = 4`
Output: `4`

**Approach**

Maintain a min-heap of size `k`. Process each element: push it onto the heap, and if the heap size exceeds `k`, pop the top (smallest). After processing all elements, the heap top is the kth largest element.

Why this works: the min-heap of size k always holds the k largest elements seen so far. The smallest of those k elements (the heap top) is by definition the kth largest overall.

**Pseudo-code**

```
function findKthLargest(nums, k):
    minHeap = empty min-heap

    for each num in nums:
        push num to minHeap
        if minHeap.size > k:
            pop from minHeap

    return minHeap.top()
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
#include <queue>

int findKthLargest(std::vector<int>& nums, int k) {
    std::priority_queue<int, std::vector<int>, std::greater<int>> minHeap;

    for (int num : nums) {
        minHeap.push(num);
        if ((int)minHeap.size() > k)
            minHeap.pop();
    }

    return minHeap.top();
}

int main() {
    std::vector<int> nums = {3, 2, 1, 5, 6, 4};
    std::cout << findKthLargest(nums, 2) << std::endl;  // 5

    std::vector<int> nums2 = {3, 2, 3, 1, 2, 4, 5, 5, 6};
    std::cout << findKthLargest(nums2, 4) << std::endl;  // 4
    return 0;
}
```

**Complexity Analysis**

- **Time:** O(n log k) — each of the n elements involves at most one push and one pop, each O(log k)
- **Space:** O(k) for the heap

---

### Problem 2: Implement a Trie with Insert and Search

**Problem Statement**

Implement a trie with the following operations:
- `insert(word)` — inserts a word into the trie
- `search(word)` — returns `true` if the word is in the trie, `false` otherwise
- `startsWith(prefix)` — returns `true` if any previously inserted word has the given prefix

Input:
```
insert("apple")
search("apple")    → true
search("app")      → false
startsWith("app")  → true
insert("app")
search("app")      → true
```

**Approach**

Build a tree where each node has up to 26 children (one per lowercase letter). To insert, walk through the word character by character, creating nodes as needed, and mark the final node as "end of word." To search, walk the same way — if you can't proceed, the word doesn't exist. For `startsWith`, it's the same as search but you don't need to check `isEndOfWord` at the end.

**Pseudo-code**

```
class TrieNode:
    children[26] = null
    isEndOfWord = false

class Trie:
    root = new TrieNode

    insert(word):
        curr = root
        for each char c in word:
            idx = c - 'a'
            if curr.children[idx] is null:
                curr.children[idx] = new TrieNode
            curr = curr.children[idx]
        curr.isEndOfWord = true

    search(word):
        node = traverse(word)
        return node != null and node.isEndOfWord

    startsWith(prefix):
        return traverse(prefix) != null

    traverse(str):
        curr = root
        for each char c in str:
            idx = c - 'a'
            if curr.children[idx] is null: return null
            curr = curr.children[idx]
        return curr
```

**C++ Solution**

```cpp
#include <iostream>
#include <string>

struct TrieNode {
    TrieNode* children[26];
    bool isEndOfWord;

    TrieNode() : isEndOfWord(false) {
        for (int i = 0; i < 26; ++i)
            children[i] = nullptr;
    }
};

class Trie {
    TrieNode* root;

    TrieNode* traverse(const std::string& s) {
        TrieNode* curr = root;
        for (char c : s) {
            int idx = c - 'a';
            if (!curr->children[idx]) return nullptr;
            curr = curr->children[idx];
        }
        return curr;
    }

public:
    Trie() : root(new TrieNode()) {}

    void insert(const std::string& word) {
        TrieNode* curr = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!curr->children[idx])
                curr->children[idx] = new TrieNode();
            curr = curr->children[idx];
        }
        curr->isEndOfWord = true;
    }

    bool search(const std::string& word) {
        TrieNode* node = traverse(word);
        return node && node->isEndOfWord;
    }

    bool startsWith(const std::string& prefix) {
        return traverse(prefix) != nullptr;
    }

    ~Trie() {
        destroy(root);
    }

private:
    void destroy(TrieNode* node) {
        if (!node) return;
        for (int i = 0; i < 26; ++i)
            destroy(node->children[i]);
        delete node;
    }
};

int main() {
    Trie trie;
    trie.insert("apple");

    std::cout << std::boolalpha;
    std::cout << trie.search("apple") << std::endl;      // true
    std::cout << trie.search("app") << std::endl;         // false
    std::cout << trie.startsWith("app") << std::endl;     // true

    trie.insert("app");
    std::cout << trie.search("app") << std::endl;         // true
    return 0;
}
```

**Complexity Analysis**

- **Time:** O(L) for insert, search, and startsWith, where L is the length of the word/prefix
- **Space:** O(N × 26) in the worst case, where N is the total number of characters across all inserted words

---

### Problem 3: Count Connected Components in an Undirected Graph

**Problem Statement**

Given `n` nodes labeled from `0` to `n-1` and a list of undirected edges, count the number of connected components in the graph.

Input: `n = 5`, `edges = [[0,1],[1,2],[3,4]]`
Output: `2` (components: {0,1,2} and {3,4})

Input: `n = 5`, `edges = [[0,1],[1,2],[2,3],[3,4]]`
Output: `1` (all nodes are connected)

**Approach**

Build an adjacency list from the edges. Then run DFS (or BFS) from each unvisited node. Each time you start a new DFS, that's a new connected component. Mark all nodes reachable from that starting node as visited. The total number of DFS calls from `main` is the component count.

Alternatively, use Union-Find (Disjoint Set Union), which can also count components by tracking the number of distinct roots.

**Pseudo-code**

```
function countComponents(n, edges):
    build adjacency list
    visited = array of false, size n
    count = 0

    for i from 0 to n-1:
        if not visited[i]:
            count++
            dfs(i, adj, visited)

    return count

function dfs(node, adj, visited):
    visited[node] = true
    for each neighbor in adj[node]:
        if not visited[neighbor]:
            dfs(neighbor, adj, visited)
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>

void dfs(int node, const std::vector<std::vector<int>>& adj,
         std::vector<bool>& visited) {
    visited[node] = true;
    for (int neighbor : adj[node]) {
        if (!visited[neighbor])
            dfs(neighbor, adj, visited);
    }
}

int countComponents(int n, std::vector<std::vector<int>>& edges) {
    std::vector<std::vector<int>> adj(n);
    for (auto& e : edges) {
        adj[e[0]].push_back(e[1]);
        adj[e[1]].push_back(e[0]);
    }

    std::vector<bool> visited(n, false);
    int count = 0;

    for (int i = 0; i < n; ++i) {
        if (!visited[i]) {
            ++count;
            dfs(i, adj, visited);
        }
    }

    return count;
}

int main() {
    int n = 5;
    std::vector<std::vector<int>> edges1 = {{0,1},{1,2},{3,4}};
    std::cout << countComponents(n, edges1) << std::endl;  // 2

    std::vector<std::vector<int>> edges2 = {{0,1},{1,2},{2,3},{3,4}};
    std::cout << countComponents(n, edges2) << std::endl;  // 1

    return 0;
}
```

**Complexity Analysis**

- **Time:** O(V + E) — each vertex and edge is visited once during DFS
- **Space:** O(V + E) for the adjacency list and visited array

---

## Practice Resources

- [Kth Largest Element in an Array — LeetCode #215](https://leetcode.com/problems/kth-largest-element-in-an-array/)
- [Implement Trie (Prefix Tree) — LeetCode #208](https://leetcode.com/problems/implement-trie-prefix-tree/)
- [Number of Connected Components — LeetCode #323](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/)
- [Heap Data Structure — GeeksforGeeks](https://www.geeksforgeeks.org/heap-data-structure/)
- [Trie Data Structure — GeeksforGeeks](https://www.geeksforgeeks.org/trie-insert-and-search/)

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: Binary Search Patterns →](/docs/CodingTestPreparation/Standard/05_binary_search_patterns)
