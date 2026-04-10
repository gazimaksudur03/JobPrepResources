# Basic Data Structures — Stack, Queue, Linked List

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

Stacks, queues, and linked lists are the foundational data structures that underpin most of what you will encounter in coding interviews. While arrays offer random access, these structures impose a specific **access discipline** that makes certain operations extremely efficient and maps naturally to real-world problems like undo histories, task scheduling, and dynamic memory management.

A **stack** follows Last-In-First-Out (LIFO) — think of a stack of plates. A **queue** follows First-In-First-Out (FIFO) — think of a line at a ticket counter. A **linked list** is a chain of nodes where each node points to the next (and optionally the previous), allowing O(1) insertion and deletion at known positions without shifting elements.

Understanding these structures from the ground up — including how to implement them yourself — is critical. Interviewers often ask you to implement one structure using another, or to solve problems where the choice of data structure is the key insight. The STL provides `std::stack`, `std::queue`, and `std::list`, but knowing the underlying mechanics lets you adapt them to custom requirements.

## Key Concepts

### Stack (LIFO)

A stack supports three operations:
- `push(x)` — add x to the top.
- `pop()` — remove the top element.
- `top()` / `peek()` — view the top element without removing it.

All operations are O(1).

**Array-based implementation:**

```cpp
class Stack {
    std::vector<int> data;
public:
    void push(int x) { data.push_back(x); }

    void pop() {
        if (data.empty()) throw std::runtime_error("Stack underflow");
        data.pop_back();
    }

    int top() const {
        if (data.empty()) throw std::runtime_error("Stack is empty");
        return data.back();
    }

    bool empty() const { return data.empty(); }
    int size() const { return data.size(); }
};
```

**STL equivalent:**

```cpp
#include <stack>

std::stack<int> st;
st.push(10);
st.push(20);
int t = st.top(); // 20
st.pop();
```

### Queue (FIFO)

A queue supports:
- `push(x)` / `enqueue(x)` — add to the back.
- `pop()` / `dequeue()` — remove from the front.
- `front()` — view the front element.

All operations are O(1).

**Linked-list-based implementation:**

```cpp
class Queue {
    struct Node {
        int val;
        Node* next;
        Node(int v) : val(v), next(nullptr) {}
    };
    Node* head = nullptr;
    Node* tail = nullptr;
    int sz = 0;
public:
    void push(int x) {
        Node* node = new Node(x);
        if (tail) tail->next = node;
        else head = node;
        tail = node;
        sz++;
    }

    void pop() {
        if (!head) throw std::runtime_error("Queue underflow");
        Node* tmp = head;
        head = head->next;
        if (!head) tail = nullptr;
        delete tmp;
        sz--;
    }

    int front() const {
        if (!head) throw std::runtime_error("Queue is empty");
        return head->val;
    }

    bool empty() const { return head == nullptr; }
    int size() const { return sz; }

    ~Queue() { while (!empty()) pop(); }
};
```

**STL equivalent:**

```cpp
#include <queue>

std::queue<int> q;
q.push(10);
q.push(20);
int f = q.front(); // 10
q.pop();
```

### Singly Linked List

Each node holds a value and a pointer to the next node. The list has a `head` pointer.

```cpp
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int v) : val(v), next(nullptr) {}
};

class SinglyLinkedList {
    ListNode* head = nullptr;
public:
    void pushFront(int val) {
        ListNode* node = new ListNode(val);
        node->next = head;
        head = node;
    }

    void pushBack(int val) {
        ListNode* node = new ListNode(val);
        if (!head) { head = node; return; }
        ListNode* curr = head;
        while (curr->next) curr = curr->next;
        curr->next = node;
    }

    void popFront() {
        if (!head) return;
        ListNode* tmp = head;
        head = head->next;
        delete tmp;
    }

    void print() const {
        for (ListNode* curr = head; curr; curr = curr->next)
            std::cout << curr->val << " -> ";
        std::cout << "null\n";
    }

    ~SinglyLinkedList() { while (head) popFront(); }
};
```

| Operation | Singly Linked List |
|-----------|-------------------|
| Access by index | O(n) |
| Push front | O(1) |
| Push back | O(n) without tail pointer, O(1) with |
| Delete front | O(1) |
| Delete arbitrary | O(n) to find, O(1) to unlink |
| Search | O(n) |

### Doubly Linked List

Each node has both `next` and `prev` pointers, enabling O(1) deletion from either end and bidirectional traversal.

```cpp
struct DListNode {
    int val;
    DListNode* prev;
    DListNode* next;
    DListNode(int v) : val(v), prev(nullptr), next(nullptr) {}
};

class DoublyLinkedList {
    DListNode* head = nullptr;
    DListNode* tail = nullptr;
public:
    void pushFront(int val) {
        DListNode* node = new DListNode(val);
        node->next = head;
        if (head) head->prev = node;
        head = node;
        if (!tail) tail = node;
    }

    void pushBack(int val) {
        DListNode* node = new DListNode(val);
        node->prev = tail;
        if (tail) tail->next = node;
        tail = node;
        if (!head) head = node;
    }

    void popFront() {
        if (!head) return;
        DListNode* tmp = head;
        head = head->next;
        if (head) head->prev = nullptr;
        else tail = nullptr;
        delete tmp;
    }

    void popBack() {
        if (!tail) return;
        DListNode* tmp = tail;
        tail = tail->prev;
        if (tail) tail->next = nullptr;
        else head = nullptr;
        delete tmp;
    }

    ~DoublyLinkedList() { while (head) popFront(); }
};
```

### When to Use Each

| Need | Best Structure |
|------|---------------|
| Last-in, first-out (undo, DFS) | Stack |
| First-in, first-out (BFS, scheduling) | Queue |
| Frequent insert/delete at arbitrary positions | Linked List |
| Random access by index | Array / Vector |
| Both ends efficiently | Deque or Doubly Linked List |

## Common Patterns

### Pattern 1 — Stack for Matching Brackets

Any problem involving nested or paired delimiters (parentheses, HTML tags, expressions) maps to a stack: push on open, pop on close, check match.

### Pattern 2 — Queue for Level-Order / BFS

Breadth-first search on trees and graphs uses a queue: enqueue the start node, then repeatedly dequeue and enqueue neighbors.

### Pattern 3 — Linked List Pointer Manipulation

Interview linked list problems revolve around pointer rewiring: reversing, merging, detecting cycles, and finding midpoints using slow/fast pointers.

### Pattern 4 — Simulate One Structure with Another

A classic question type: implement a queue using two stacks, or a stack using two queues. This tests your understanding of the access discipline of each structure.

---

## Practice Problems

### Problem 1: Valid Parentheses

**Problem Statement**

Given a string containing only `(`, `)`, `{`, `}`, `[`, and `]`, determine if the input string is valid. A string is valid if:
1. Open brackets are closed by the same type of brackets.
2. Open brackets are closed in the correct order.

```
Input:  "({[]})"
Output: true

Input:  "({[})"
Output: false
```

**Approach**

Use a stack. For every opening bracket, push its expected closing bracket. For every closing bracket, check if it matches the stack's top. If the stack is empty at the end, the string is valid.

**Pseudo-code**

```
function isValid(s):
    stack = empty
    for each char c in s:
        if c is '(': push ')'
        else if c is '{': push '}'
        else if c is '[': push ']'
        else:
            if stack is empty or stack.top != c: return false
            stack.pop()
    return stack is empty
```

**C++ Solution**

```cpp
#include <iostream>
#include <stack>
#include <string>

bool isValid(const std::string& s) {
    std::stack<char> st;
    for (char c : s) {
        if (c == '(') st.push(')');
        else if (c == '{') st.push('}');
        else if (c == '[') st.push(']');
        else {
            if (st.empty() || st.top() != c) return false;
            st.pop();
        }
    }
    return st.empty();
}

int main() {
    std::cout << std::boolalpha;
    std::cout << isValid("({[]})") << "\n"; // true
    std::cout << isValid("({[})") << "\n";  // false
    std::cout << isValid("") << "\n";       // true (empty is valid)
    std::cout << isValid("((") << "\n";     // false

    return 0;
}
```

**Complexity Analysis**

- **Time:** O(n) — single pass through the string.
- **Space:** O(n) — worst case all opening brackets are pushed onto the stack.

---

### Problem 2: Implement a Queue Using Two Stacks

**Problem Statement**

Implement a queue (FIFO) using only two stacks. Support `push`, `pop`, `peek`, and `empty` operations. Each operation should be efficient on average.

```
Input:
  push(1), push(2), peek() → 1, pop() → 1, empty() → false
```

**Approach**

Use two stacks: `inStack` for pushing and `outStack` for popping. When `outStack` is empty and we need to pop/peek, pour all elements from `inStack` into `outStack`. This reversal gives FIFO order. Each element is moved at most twice, so amortized cost per operation is O(1).

**Pseudo-code**

```
class MyQueue:
    inStack = empty stack
    outStack = empty stack

    push(x):
        inStack.push(x)

    transfer():
        if outStack is empty:
            while inStack is not empty:
                outStack.push(inStack.pop())

    pop():
        transfer()
        return outStack.pop()

    peek():
        transfer()
        return outStack.top()

    empty():
        return inStack.empty() and outStack.empty()
```

**C++ Solution**

```cpp
#include <iostream>
#include <stack>

class MyQueue {
    std::stack<int> inStack, outStack;

    void transfer() {
        if (outStack.empty()) {
            while (!inStack.empty()) {
                outStack.push(inStack.top());
                inStack.pop();
            }
        }
    }

public:
    void push(int x) {
        inStack.push(x);
    }

    int pop() {
        transfer();
        int val = outStack.top();
        outStack.pop();
        return val;
    }

    int peek() {
        transfer();
        return outStack.top();
    }

    bool empty() const {
        return inStack.empty() && outStack.empty();
    }
};

int main() {
    MyQueue q;
    q.push(1);
    q.push(2);
    q.push(3);

    std::cout << q.peek() << "\n"; // 1
    std::cout << q.pop() << "\n";  // 1
    std::cout << q.pop() << "\n";  // 2
    q.push(4);
    std::cout << q.pop() << "\n";  // 3
    std::cout << q.pop() << "\n";  // 4
    std::cout << std::boolalpha << q.empty() << "\n"; // true

    return 0;
}
```

**Complexity Analysis**

- **Time:** Amortized O(1) per operation. Each element is pushed and popped from each stack at most once — total work for n operations is O(n).
- **Space:** O(n) — both stacks together hold all n elements.

---

### Problem 3: Reverse a Singly Linked List

**Problem Statement**

Given the head of a singly linked list, reverse the list and return the new head.

```
Input:  1 -> 2 -> 3 -> 4 -> 5 -> null
Output: 5 -> 4 -> 3 -> 2 -> 1 -> null
```

**Approach**

Use three pointers: `prev`, `curr`, and `next`. At each step, save `curr->next`, point `curr->next` to `prev`, then advance `prev` and `curr`. When `curr` becomes null, `prev` is the new head.

**Pseudo-code**

```
function reverseList(head):
    prev = null
    curr = head
    while curr is not null:
        next = curr.next
        curr.next = prev
        prev = curr
        curr = next
    return prev
```

**C++ Solution**

```cpp
#include <iostream>

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int v) : val(v), next(nullptr) {}
};

ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr) {
        ListNode* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}

// Recursive approach for comparison
ListNode* reverseListRecursive(ListNode* head) {
    if (!head || !head->next) return head;
    ListNode* newHead = reverseListRecursive(head->next);
    head->next->next = head;
    head->next = nullptr;
    return newHead;
}

void printList(ListNode* head) {
    while (head) {
        std::cout << head->val;
        if (head->next) std::cout << " -> ";
        head = head->next;
    }
    std::cout << " -> null\n";
}

int main() {
    ListNode* head = new ListNode(1);
    head->next = new ListNode(2);
    head->next->next = new ListNode(3);
    head->next->next->next = new ListNode(4);
    head->next->next->next->next = new ListNode(5);

    std::cout << "Original: ";
    printList(head);

    head = reverseList(head);
    std::cout << "Reversed: ";
    printList(head);
    // 5 -> 4 -> 3 -> 2 -> 1 -> null

    // Clean up
    while (head) {
        ListNode* tmp = head;
        head = head->next;
        delete tmp;
    }

    return 0;
}
```

**Complexity Analysis**

- **Time:** O(n) — single traversal of the list.
- **Space:** O(1) for the iterative approach (only three pointers). The recursive approach uses O(n) stack space.

---

## Practice Resources

- [LeetCode — Valid Parentheses](https://leetcode.com/problems/valid-parentheses/)
- [LeetCode — Implement Queue using Stacks](https://leetcode.com/problems/implement-queue-using-stacks/)
- [LeetCode — Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/)
- [GeeksforGeeks — Stack Data Structure](https://www.geeksforgeeks.org/stack-data-structure/)
- [GeeksforGeeks — Linked List Data Structure](https://www.geeksforgeeks.org/data-structures/linked-list/)

---

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: Searching and Sorting →](/docs/CodingTestPreparation/Basic/11_searching_and_sorting)
