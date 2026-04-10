# Linked Lists, Trees, and BST

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

Linked lists and trees are the foundational pointer-based data structures in computer science. Unlike arrays, they don't store elements in contiguous memory — instead, each node holds data and a pointer (or pointers) to other nodes. This gives them fundamentally different performance characteristics: linked lists offer O(1) insertion/deletion at known positions but O(n) access, while arrays offer O(1) access but O(n) insertion/deletion.

Trees extend the linked list concept into a hierarchical structure. A binary tree has at most two children per node, and a Binary Search Tree (BST) imposes an ordering invariant: every node's left subtree contains only smaller values, and its right subtree contains only larger values. This invariant enables O(log n) search, insert, and delete on balanced trees — making BSTs the foundation for `std::set`, `std::map`, and database indexes.

In coding interviews, linked list and tree problems are among the most common. They test your ability to reason about pointers, handle edge cases (null nodes, single-element lists), think recursively, and understand when recursion vs. iteration is appropriate. The fast-slow pointer technique for linked lists and the various tree traversal strategies are patterns you will see repeatedly.

## Key Concepts

### Singly Linked List

Each node stores a value and a pointer to the next node. The last node points to `nullptr`.

```cpp
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

// Insert at head — O(1)
ListNode* insertAtHead(ListNode* head, int val) {
    ListNode* newNode = new ListNode(val);
    newNode->next = head;
    return newNode;
}

// Insert at tail — O(n)
void insertAtTail(ListNode* head, int val) {
    ListNode* curr = head;
    while (curr->next) curr = curr->next;
    curr->next = new ListNode(val);
}

// Delete a node with given value — O(n)
ListNode* deleteNode(ListNode* head, int val) {
    if (!head) return nullptr;
    if (head->val == val) {
        ListNode* temp = head->next;
        delete head;
        return temp;
    }
    ListNode* curr = head;
    while (curr->next && curr->next->val != val)
        curr = curr->next;
    if (curr->next) {
        ListNode* temp = curr->next;
        curr->next = temp->next;
        delete temp;
    }
    return head;
}
```

### Doubly Linked List

Each node has pointers to both the next and previous nodes, enabling O(1) deletion when you have a reference to the node.

```cpp
struct DListNode {
    int val;
    DListNode* prev;
    DListNode* next;
    DListNode(int x) : val(x), prev(nullptr), next(nullptr) {}
};
```

Doubly linked lists are the backbone of LRU cache implementations (combined with a hash map).

### Fast-Slow Pointer Technique

Two pointers move at different speeds through the list. This technique solves several classic problems:

- **Cycle detection:** Slow moves 1 step, fast moves 2 steps. If they meet, there's a cycle.
- **Find middle:** When fast reaches the end, slow is at the middle.
- **Find cycle start:** After detecting cycle, reset one pointer to head and move both at speed 1.
- **Kth from end:** Start fast pointer k steps ahead, then move both at speed 1.

### Binary Tree Concepts

```cpp
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};
```

**Key definitions:**
- **Depth** of a node: number of edges from root to that node (root depth = 0)
- **Height** of a tree: number of edges on the longest root-to-leaf path
- **Balanced tree:** for every node, the heights of left and right subtrees differ by at most 1

### Tree Traversals

The four standard traversals visit nodes in different orders:

```cpp
#include <queue>
#include <vector>

// Inorder (Left → Root → Right) — gives sorted order for BST
void inorder(TreeNode* root, std::vector<int>& result) {
    if (!root) return;
    inorder(root->left, result);
    result.push_back(root->val);
    inorder(root->right, result);
}

// Preorder (Root → Left → Right) — used for tree serialization
void preorder(TreeNode* root, std::vector<int>& result) {
    if (!root) return;
    result.push_back(root->val);
    preorder(root->left, result);
    preorder(root->right, result);
}

// Postorder (Left → Right → Root) — used for deletion, expression evaluation
void postorder(TreeNode* root, std::vector<int>& result) {
    if (!root) return;
    postorder(root->left, result);
    postorder(root->right, result);
    result.push_back(root->val);
}

// Level-order (BFS) — level by level
std::vector<std::vector<int>> levelOrder(TreeNode* root) {
    std::vector<std::vector<int>> result;
    if (!root) return result;
    std::queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int sz = q.size();
        std::vector<int> level;
        for (int i = 0; i < sz; ++i) {
            TreeNode* node = q.front(); q.pop();
            level.push_back(node->val);
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        result.push_back(level);
    }
    return result;
}
```

### BST Properties

The BST invariant states: for every node `n`, all values in `n->left` are less than `n->val`, and all values in `n->right` are greater. This enables efficient operations:

```cpp
// Search — O(h) where h is tree height
TreeNode* search(TreeNode* root, int target) {
    if (!root || root->val == target) return root;
    if (target < root->val) return search(root->left, target);
    return search(root->right, target);
}

// Insert — O(h)
TreeNode* insert(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    if (val < root->val) root->left = insert(root->left, val);
    else if (val > root->val) root->right = insert(root->right, val);
    return root;
}

// Delete — O(h), three cases: leaf, one child, two children
TreeNode* findMin(TreeNode* root) {
    while (root->left) root = root->left;
    return root;
}

TreeNode* deleteNode(TreeNode* root, int key) {
    if (!root) return nullptr;
    if (key < root->val) root->left = deleteNode(root->left, key);
    else if (key > root->val) root->right = deleteNode(root->right, key);
    else {
        if (!root->left) {
            TreeNode* temp = root->right;
            delete root;
            return temp;
        }
        if (!root->right) {
            TreeNode* temp = root->left;
            delete root;
            return temp;
        }
        TreeNode* successor = findMin(root->right);
        root->val = successor->val;
        root->right = deleteNode(root->right, successor->val);
    }
    return root;
}
```

## Common Patterns

### Dummy Head Node for Linked Lists
Use a dummy/sentinel node before the real head to avoid special-casing head deletion and simplify edge cases.

### Recursive vs Iterative Tree Traversal
Recursive is simpler and cleaner, but iterative (using an explicit stack) avoids stack overflow on deep trees and is sometimes required in interviews.

### BST Inorder = Sorted
Inorder traversal of a BST always produces values in sorted order. This is the key insight behind many BST validation and search problems.

### Parent Pointer or Stack for Tree Ancestor Problems
Problems involving finding ancestors, LCA, or paths between nodes often require tracking the path from root using a stack or parent map.

---

## Practice Problems

### Problem 1: Detect Cycle in a Linked List (Floyd's Algorithm)

**Problem Statement**

Given the head of a linked list, determine if the linked list has a cycle. A cycle exists if some node in the list can be reached again by following the `next` pointers. Return `true` if there is a cycle, `false` otherwise.

Input: `head = [3, 2, 0, -4]` with a cycle back to node at index 1
Output: `true`

Input: `head = [1, 2]` with no cycle
Output: `false`

**Approach**

Floyd's Cycle Detection uses two pointers: slow (moves 1 step) and fast (moves 2 steps). If there's no cycle, fast will reach the end. If there's a cycle, fast will eventually "lap" slow, and they'll meet inside the cycle.

Why does this work? In the cycle, the gap between fast and slow decreases by 1 each step. Since fast gains one position per iteration, they must eventually meet. The time to meet is at most the cycle length.

**Pseudo-code**

```
function hasCycle(head):
    slow = head
    fast = head

    while fast != null and fast.next != null:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return true

    return false
```

**C++ Solution**

```cpp
#include <iostream>

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

bool hasCycle(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;

    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast)
            return true;
    }
    return false;
}

int main() {
    ListNode* n1 = new ListNode(3);
    ListNode* n2 = new ListNode(2);
    ListNode* n3 = new ListNode(0);
    ListNode* n4 = new ListNode(-4);
    n1->next = n2; n2->next = n3; n3->next = n4;
    n4->next = n2; // cycle back to n2

    std::cout << std::boolalpha << hasCycle(n1) << std::endl;  // true

    // Clean up would require breaking cycle first
    n4->next = nullptr;
    delete n4; delete n3; delete n2; delete n1;
    return 0;
}
```

**Complexity Analysis**

- **Time:** O(n) — slow pointer traverses at most n nodes; once inside the cycle, they meet within one full cycle length
- **Space:** O(1) — only two pointers used

---

### Problem 2: Inorder Traversal of a Binary Tree (Iterative)

**Problem Statement**

Given the root of a binary tree, return the inorder traversal (Left → Root → Right) of its nodes' values using an iterative approach (no recursion).

Input: `root = [1, null, 2, 3]` (tree: 1 → right: 2 → left: 3)
Output: `[1, 3, 2]`

Input: `root = []`
Output: `[]`

**Approach**

Use an explicit stack to simulate the call stack of recursive inorder. Push all left children onto the stack until you reach `nullptr`. Then pop a node (this is the "visit" step), record its value, and move to its right child. Repeat until the stack is empty and the current pointer is null.

This approach mirrors exactly what the recursive version does — it's just that you manage the stack manually. The left-pushing phase corresponds to the recursive `inorder(root->left)` call.

**Pseudo-code**

```
function inorderIterative(root):
    result = []
    stack = empty stack
    curr = root

    while curr != null or stack is not empty:
        while curr != null:
            stack.push(curr)
            curr = curr.left

        curr = stack.pop()
        result.append(curr.val)
        curr = curr.right

    return result
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
#include <stack>

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

std::vector<int> inorderTraversal(TreeNode* root) {
    std::vector<int> result;
    std::stack<TreeNode*> stk;
    TreeNode* curr = root;

    while (curr || !stk.empty()) {
        while (curr) {
            stk.push(curr);
            curr = curr->left;
        }
        curr = stk.top();
        stk.pop();
        result.push_back(curr->val);
        curr = curr->right;
    }

    return result;
}

int main() {
    TreeNode* root = new TreeNode(1);
    root->right = new TreeNode(2);
    root->right->left = new TreeNode(3);

    auto result = inorderTraversal(root);
    for (int v : result) std::cout << v << " ";  // 1 3 2
    std::cout << std::endl;

    delete root->right->left;
    delete root->right;
    delete root;
    return 0;
}
```

**Complexity Analysis**

- **Time:** O(n) — every node is pushed and popped exactly once
- **Space:** O(h) where h is the tree height — in the worst case (skewed tree) this is O(n)

---

### Problem 3: Validate a Binary Search Tree

**Problem Statement**

Given the root of a binary tree, determine if it is a valid Binary Search Tree. A valid BST is defined as:

- The left subtree of a node contains only nodes with keys **strictly less than** the node's key.
- The right subtree of a node contains only nodes with keys **strictly greater than** the node's key.
- Both the left and right subtrees must also be BSTs.

Input: `root = [2, 1, 3]`
Output: `true`

Input: `root = [5, 1, 4, null, null, 3, 6]`
Output: `false` (4 is in the right subtree of 5 but 4 < 5... wait, 3 is in the right subtree of 5 but 3 < 5)

**Approach**

A common mistake is to only check that each node is greater than its left child and less than its right child. This doesn't catch cases where a deeper node violates the BST property relative to an ancestor. The correct approach is to track the valid range (min, max) for each node as you recurse.

Alternatively, perform an inorder traversal and verify that the output is strictly increasing — since inorder on a valid BST always produces sorted output.

**Pseudo-code**

```
function isValidBST(node, minVal, maxVal):
    if node is null: return true
    if node.val <= minVal or node.val >= maxVal: return false
    return isValidBST(node.left, minVal, node.val) and
           isValidBST(node.right, node.val, maxVal)

// Call: isValidBST(root, -infinity, +infinity)
```

**C++ Solution**

```cpp
#include <iostream>
#include <climits>

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

bool validate(TreeNode* node, long long minVal, long long maxVal) {
    if (!node) return true;
    if (node->val <= minVal || node->val >= maxVal)
        return false;
    return validate(node->left, minVal, node->val) &&
           validate(node->right, node->val, maxVal);
}

bool isValidBST(TreeNode* root) {
    return validate(root, LLONG_MIN, LLONG_MAX);
}

int main() {
    // Valid BST: [2, 1, 3]
    TreeNode* r1 = new TreeNode(2);
    r1->left = new TreeNode(1);
    r1->right = new TreeNode(3);
    std::cout << std::boolalpha << isValidBST(r1) << std::endl;  // true

    // Invalid BST: [5, 1, 4, null, null, 3, 6]
    TreeNode* r2 = new TreeNode(5);
    r2->left = new TreeNode(1);
    r2->right = new TreeNode(4);
    r2->right->left = new TreeNode(3);
    r2->right->right = new TreeNode(6);
    std::cout << isValidBST(r2) << std::endl;  // false

    delete r1->left; delete r1->right; delete r1;
    delete r2->right->left; delete r2->right->right;
    delete r2->left; delete r2->right; delete r2;
    return 0;
}
```

**Complexity Analysis**

- **Time:** O(n) — each node is visited exactly once
- **Space:** O(h) for the recursion stack — O(log n) for balanced trees, O(n) for skewed trees

---

## Practice Resources

- [Linked List Cycle — LeetCode #141](https://leetcode.com/problems/linked-list-cycle/)
- [Binary Tree Inorder Traversal — LeetCode #94](https://leetcode.com/problems/binary-tree-inorder-traversal/)
- [Validate Binary Search Tree — LeetCode #98](https://leetcode.com/problems/validate-binary-search-tree/)
- [Linked List Operations — GeeksforGeeks](https://www.geeksforgeeks.org/data-structures/linked-list/)
- [Binary Tree Traversals — GeeksforGeeks](https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/)

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: Heap, Trie, Graph →](/docs/CodingTestPreparation/Standard/04_heap_trie_graph)
