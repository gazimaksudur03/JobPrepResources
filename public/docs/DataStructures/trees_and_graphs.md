# Trees and Graphs

Trees and graphs are non-linear data structures essential for representing hierarchical and network relationships.

## **Binary Trees**

A binary tree is a tree where each node has at most two children (left and right).

| Type | Description |
|------|-------------|
| Full Binary Tree | Every node has 0 or 2 children |
| Complete Binary Tree | All levels filled except possibly the last |
| Perfect Binary Tree | All internal nodes have 2 children, all leaves at same level |
| Balanced Binary Tree | Height difference between subtrees is at most 1 |

### Tree Traversals

| Traversal | Order | Use Case |
|-----------|-------|----------|
| In-order | Left → Root → Right | Get sorted order in BST |
| Pre-order | Root → Left → Right | Copy/serialize a tree |
| Post-order | Left → Right → Root | Delete a tree, evaluate expressions |
| Level-order (BFS) | Level by level | Find shortest path, level averages |

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# In-order traversal
def inorder(root):
    if not root:
        return []
    return inorder(root.left) + [root.val] + inorder(root.right)

# Level-order traversal (BFS)
from collections import deque

def level_order(root):
    if not root:
        return []
    result, queue = [], deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)
    return result
```

## **Binary Search Trees (BST)**

A BST is a binary tree where for every node, all left descendants are smaller and all right descendants are larger.

| Operation | Average | Worst (unbalanced) |
|-----------|---------|---------------------|
| Search | O(log n) | O(n) |
| Insert | O(log n) | O(n) |
| Delete | O(log n) | O(n) |
| Min/Max | O(log n) | O(n) |

```python
def search_bst(root, target):
    if not root:
        return None
    if target == root.val:
        return root
    elif target < root.val:
        return search_bst(root.left, target)
    else:
        return search_bst(root.right, target)
```

## **Heaps**

A heap is a complete binary tree that satisfies the heap property.

| Type | Property | Use Case |
|------|----------|----------|
| Min Heap | Parent ≤ children | Priority queues (smallest first) |
| Max Heap | Parent ≥ children | Priority queues (largest first) |

| Operation | Time Complexity |
|-----------|----------------|
| Insert | O(log n) |
| Extract min/max | O(log n) |
| Peek min/max | O(1) |
| Build heap | O(n) |

## **Graphs**

A graph consists of vertices (nodes) connected by edges.

| Type | Description |
|------|-------------|
| Directed | Edges have direction |
| Undirected | Edges are bidirectional |
| Weighted | Edges have associated costs |
| Unweighted | All edges have equal cost |
| Cyclic | Contains at least one cycle |
| Acyclic | No cycles (DAG if directed) |

### Graph Representations

| Representation | Space | Edge Check | Iterate Neighbors |
|----------------|-------|------------|-------------------|
| Adjacency Matrix | O(V²) | O(1) | O(V) |
| Adjacency List | O(V + E) | O(degree) | O(degree) |

### Graph Traversals

```python
from collections import deque

# BFS
def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    while queue:
        node = queue.popleft()
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return visited

# DFS
def dfs(graph, node, visited=None):
    if visited is None:
        visited = set()
    visited.add(node)
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
    return visited
```

## **Key Interview Problems**

| Problem | Approach | Complexity |
|---------|----------|------------|
| Maximum Depth of Binary Tree | DFS recursion | O(n) |
| Validate BST | In-order with range check | O(n) |
| Level Order Traversal | BFS with queue | O(n) |
| Lowest Common Ancestor | Recursive comparison | O(n) |
| Number of Islands | BFS/DFS on grid | O(m × n) |
| Course Schedule | Topological sort | O(V + E) |
| Shortest Path (unweighted) | BFS | O(V + E) |
| Shortest Path (weighted) | Dijkstra's algorithm | O((V + E) log V) |
