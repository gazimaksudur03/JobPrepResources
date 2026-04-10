# Advanced STL Internals and Usage

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

The Standard Template Library is far more than a collection of containers and algorithms — it is a carefully layered architecture built on the concept of **iterators** as the universal glue between data structures and algorithms. Understanding the internal workings of STL containers — how `std::vector` grows, why `std::map` is a red-black tree, how `std::unordered_map` handles collisions via chaining and bucket arrays — separates candidates who merely use the STL from those who can reason about its performance characteristics under pressure.

Beyond the standard containers, competitive programmers and systems engineers routinely reach for **policy-based data structures** from the `__gnu_pbds` (Policy-Based Data Structures) extension. The most notable is the **order statistics tree**, which supports O(log N) rank queries (`find_by_order`) and order statistics (`order_of_key`) — operations that would require a hand-rolled balanced BST otherwise.

This section also covers writing **STL-compatible iterators** for custom containers, allocator basics, and the iterator category taxonomy that the STL uses for algorithm dispatch. Mastering these internals gives you the vocabulary and confidence to discuss trade-offs with interviewers and to pick the right container for the right job.

## Key Concepts

### Iterator Categories

The STL defines five iterator categories, each a refinement of the previous:

| Category | Operations | Example |
|---|---|---|
| **Input** | Read, single-pass forward (`++`, `*`, `==`) | `std::istream_iterator` |
| **Output** | Write, single-pass forward (`++`, `*`) | `std::ostream_iterator` |
| **Forward** | Read/write, multi-pass forward | `std::forward_list::iterator` |
| **Bidirectional** | Forward + backward (`--`) | `std::list::iterator`, `std::map::iterator` |
| **Random Access** | Bidirectional + O(1) jump (`+n`, `-n`, `[]`, `<`) | `std::vector::iterator`, `std::deque::iterator` |

Algorithms like `std::sort` require random access iterators, while `std::find` only needs input iterators. This is why you cannot `std::sort` a `std::list` directly (use `list::sort()` instead).

### Allocators (Basics)

Every STL container takes an allocator template parameter (defaulting to `std::allocator<T>`). Allocators abstract memory allocation/deallocation. Custom allocators are used for:
- Arena/pool allocation for performance-critical paths
- Shared memory containers
- Tracking/debugging memory usage

```cpp
template <typename T>
struct PoolAllocator {
    using value_type = T;
    T* allocate(std::size_t n);
    void deallocate(T* p, std::size_t n);
};
```

For interviews, knowing that allocators exist and what they control is sufficient.

### STL Container Internals

#### std::vector — Dynamic Array

- Contiguous memory block.
- `push_back` is amortised O(1) due to geometric growth (typically 2x).
- Reallocation invalidates all iterators.
- `reserve(n)` pre-allocates to avoid repeated reallocations.

```cpp
std::vector<int> v;
v.reserve(1000); // one allocation for up to 1000 elements
for (int i = 0; i < 1000; ++i)
    v.push_back(i); // no reallocations
```

#### std::map / std::set — Red-Black Tree

- Self-balancing BST guaranteeing O(log N) insert, find, erase.
- Iterators traverse in sorted order.
- Each node is a separate heap allocation (pointer-heavy, cache-unfriendly).

#### std::unordered_map / std::unordered_set — Hash Table

- Array of buckets; each bucket is a linked list (separate chaining).
- Average O(1) lookup, worst case O(N) if all keys hash to the same bucket.
- `load_factor()` = size / bucket_count. Rehashes when it exceeds `max_load_factor()` (default 1.0).
- Iteration order is unspecified.

```cpp
std::unordered_map<std::string, int> m;
m.reserve(1000); // pre-allocate buckets to avoid rehashing
m["key"] = 42;
std::cout << m.bucket_count(); // number of buckets
std::cout << m.load_factor();  // current load
```

### Writing STL-Compatible Containers and Iterators

To make a custom container work with STL algorithms and range-based for, you need:
1. `begin()` and `end()` returning iterators.
2. The iterator must satisfy the appropriate iterator category by providing the correct `iterator_traits` specialisation (or nested typedefs).

```cpp
template <typename T>
class ForwardIterator {
    Node<T>* current_;
public:
    using iterator_category = std::forward_iterator_tag;
    using value_type = T;
    using difference_type = std::ptrdiff_t;
    using pointer = T*;
    using reference = T&;

    explicit ForwardIterator(Node<T>* p) : current_(p) {}
    reference operator*() const { return current_->data; }
    pointer operator->() const { return &current_->data; }
    ForwardIterator& operator++() { current_ = current_->next; return *this; }
    ForwardIterator operator++(int) { auto tmp = *this; ++(*this); return tmp; }
    bool operator==(const ForwardIterator& other) const { return current_ == other.current_; }
    bool operator!=(const ForwardIterator& other) const { return current_ != other.current_; }
};
```

### Policy-Based Data Structures — Order Statistics Tree

The GNU `__gnu_pbds` library provides a tree with augmented node information. The **order statistics tree** supports:

- `find_by_order(k)` — iterator to the k-th element (0-indexed), O(log N)
- `order_of_key(x)` — number of elements strictly less than x, O(log N)

```cpp
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/tree_policy.hpp>
using namespace __gnu_pbds;

typedef tree<int, null_type, std::less<int>,
             rb_tree_tag, tree_order_statistics_node_update> ordered_set;

ordered_set os;
os.insert(1); os.insert(3); os.insert(5); os.insert(7);

auto it = os.find_by_order(2); // iterator to 3rd element (5)
int rank = os.order_of_key(5); // 2 (elements < 5: {1, 3})
```

## Common Patterns

### Pattern 1: Choosing the Right Container

| Need | Container | Why |
|---|---|---|
| Sorted order + fast lookup | `std::set` / `std::map` | O(log N) balanced BST |
| Fast unordered lookup | `std::unordered_set` / `std::unordered_map` | O(1) average hash |
| FIFO queue | `std::queue` (adaptor over `deque`) | O(1) push/pop |
| Priority access | `std::priority_queue` | O(log N) heap |
| Rank queries | `__gnu_pbds::tree` | O(log N) order statistics |
| LRU Cache | `std::list` + `std::unordered_map` | O(1) access + eviction |

### Pattern 2: Erasing During Iteration

```cpp
// Safe erase from map/set during iteration
for (auto it = m.begin(); it != m.end(); ) {
    if (shouldRemove(it->second))
        it = m.erase(it);
    else
        ++it;
}
```

### Pattern 3: Custom Comparators

```cpp
// Min-heap with custom comparator
auto cmp = [](const auto& a, const auto& b) { return a.cost > b.cost; };
std::priority_queue<Node, std::vector<Node>, decltype(cmp)> pq(cmp);
```

---

## Practice Problems

### Problem 1: Kth Smallest Element Using Policy-Based Data Structure

**Problem Statement**

Given an array of N integers and Q queries, each query is one of:
- `1 x` — insert x into the set
- `2 x` — delete one occurrence of x from the set
- `3 k` — find the k-th smallest element (1-indexed)

*Input:*
```
Array: [3, 1, 4, 1, 5]
Queries: 3 2 → 2nd smallest
         1 2 → insert 2
         3 3 → 3rd smallest
```
*Output:*
```
1
2
```

**Approach**

Use the GNU policy-based order statistics tree. To handle duplicates (since `tree` is a set), encode each element as a pair `(value, unique_id)`. `find_by_order(k-1)` gives the k-th smallest. For deletion, find the exact pair and erase it.

**Pseudo-code**

```
ordered_set<pair<int,int>> os
counter = 0

insert(x): os.insert({x, counter++})
delete(x): find element with value x, erase it
kth(k): return os.find_by_order(k-1)->first
```

**C++ Solution**

```cpp
#include <iostream>
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/tree_policy.hpp>
using namespace __gnu_pbds;
using namespace std;

typedef tree<pair<int,int>, null_type, less<pair<int,int>>,
             rb_tree_tag, tree_order_statistics_node_update> ordered_set;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    ordered_set os;
    int uid = 0;

    int n;
    cin >> n;
    for (int i = 0; i < n; ++i) {
        int x;
        cin >> x;
        os.insert({x, uid++});
    }

    int q;
    cin >> q;
    while (q--) {
        int type, val;
        cin >> type >> val;
        if (type == 1) {
            os.insert({val, uid++});
        } else if (type == 2) {
            auto it = os.lower_bound({val, 0});
            if (it != os.end() && it->first == val)
                os.erase(it);
        } else {
            // k-th smallest (1-indexed)
            auto it = os.find_by_order(val - 1);
            cout << it->first << '\n';
        }
    }
    return 0;
}
```

**Complexity Analysis**

- **Time:** O((N + Q) log N) — each insert, delete, and order query is O(log N).
- **Space:** O(N + Q) for storing all elements with unique IDs.

---

### Problem 2: Custom Iterator for a Singly Linked List

**Problem Statement**

Implement a singly linked list `SList<T>` with a forward iterator so that it works with range-based for loops and STL algorithms like `std::find` and `std::for_each`.

*Example:*
```cpp
SList<int> list;
list.push_front(3); list.push_front(2); list.push_front(1);
for (int x : list) std::cout << x << ' '; // 1 2 3
auto it = std::find(list.begin(), list.end(), 2);
```

**Approach**

Define a `Node` struct with data and next pointer. The `SList` manages a head pointer. Define an inner `Iterator` class satisfying `std::forward_iterator_tag` with the five required type aliases. Provide `begin()` returning `Iterator(head_)` and `end()` returning `Iterator(nullptr)`.

**Pseudo-code**

```
struct Node<T>:
    data: T
    next: Node*

class SList<T>:
    head = null

    push_front(val): new_node->next = head; head = new_node
    begin(): return Iterator(head)
    end(): return Iterator(null)

class Iterator:
    ptr: Node*
    operator*: return ptr->data
    operator++: ptr = ptr->next; return this
    operator==: return ptr == other.ptr
```

**C++ Solution**

```cpp
#include <iostream>
#include <algorithm>
#include <iterator>
#include <cassert>

template <typename T>
class SList {
    struct Node {
        T data;
        Node* next;
        Node(const T& d, Node* n = nullptr) : data(d), next(n) {}
    };

    Node* head_ = nullptr;
    std::size_t size_ = 0;

public:
    SList() = default;

    ~SList() {
        while (head_) {
            Node* tmp = head_;
            head_ = head_->next;
            delete tmp;
        }
    }

    SList(const SList&) = delete;
    SList& operator=(const SList&) = delete;

    void push_front(const T& val) {
        head_ = new Node(val, head_);
        ++size_;
    }

    std::size_t size() const { return size_; }

    class Iterator {
        Node* current_;
    public:
        using iterator_category = std::forward_iterator_tag;
        using value_type = T;
        using difference_type = std::ptrdiff_t;
        using pointer = T*;
        using reference = T&;

        explicit Iterator(Node* p = nullptr) : current_(p) {}

        reference operator*() const { return current_->data; }
        pointer operator->() const { return &current_->data; }

        Iterator& operator++() {
            current_ = current_->next;
            return *this;
        }

        Iterator operator++(int) {
            Iterator tmp = *this;
            current_ = current_->next;
            return tmp;
        }

        bool operator==(const Iterator& other) const {
            return current_ == other.current_;
        }

        bool operator!=(const Iterator& other) const {
            return current_ != other.current_;
        }
    };

    Iterator begin() { return Iterator(head_); }
    Iterator end()   { return Iterator(nullptr); }

    // const versions
    class ConstIterator {
        const Node* current_;
    public:
        using iterator_category = std::forward_iterator_tag;
        using value_type = T;
        using difference_type = std::ptrdiff_t;
        using pointer = const T*;
        using reference = const T&;

        explicit ConstIterator(const Node* p = nullptr) : current_(p) {}
        reference operator*() const { return current_->data; }
        pointer operator->() const { return &current_->data; }
        ConstIterator& operator++() { current_ = current_->next; return *this; }
        ConstIterator operator++(int) { auto tmp = *this; ++(*this); return tmp; }
        bool operator==(const ConstIterator& o) const { return current_ == o.current_; }
        bool operator!=(const ConstIterator& o) const { return current_ != o.current_; }
    };

    ConstIterator begin() const { return ConstIterator(head_); }
    ConstIterator end()   const { return ConstIterator(nullptr); }
};

int main() {
    SList<int> list;
    list.push_front(3);
    list.push_front(2);
    list.push_front(1);

    // Range-based for
    for (int x : list)
        std::cout << x << ' '; // 1 2 3
    std::cout << '\n';

    // STL algorithm
    auto it = std::find(list.begin(), list.end(), 2);
    assert(it != list.end() && *it == 2);

    // std::for_each
    std::for_each(list.begin(), list.end(), [](int x) {
        std::cout << x * x << ' '; // 1 4 9
    });
    std::cout << '\n';

    std::cout << "All tests passed.\n";
    return 0;
}
```

**Complexity Analysis**

- **Time:** `push_front` O(1), iteration O(N), `std::find` O(N).
- **Space:** O(N) for N nodes.

---

### Problem 3: LRU Cache Using list + unordered_map

**Problem Statement**

Design a Least Recently Used (LRU) cache with the following operations, both in O(1) time:
- `get(key)` — return the value if the key exists (and mark as recently used), otherwise return -1
- `put(key, value)` — insert or update. If the cache is full, evict the least recently used entry.

*Capacity: 2*
```
put(1, 1), put(2, 2), get(1) → 1
put(3, 3) → evicts key 2
get(2) → -1, get(3) → 3
```

**Approach**

Use a doubly-linked list (`std::list`) to maintain access order — most recently used at the front, least recently used at the back. Use an `unordered_map` mapping keys to list iterators for O(1) lookup. On access, splice the node to the front. On eviction, remove from the back.

**Pseudo-code**

```
class LRUCache:
    list: doubly linked list of (key, value) pairs
    map: key -> iterator into list
    capacity: int

    get(key):
        if key not in map: return -1
        move map[key] node to front of list
        return node.value

    put(key, value):
        if key in map:
            update node value
            move to front
        else:
            if size == capacity:
                remove last node from list
                remove its key from map
            push (key, value) to front of list
            map[key] = front iterator
```

**C++ Solution**

```cpp
#include <iostream>
#include <list>
#include <unordered_map>
#include <cassert>

class LRUCache {
    int capacity_;
    std::list<std::pair<int, int>> order_; // front = MRU, back = LRU
    std::unordered_map<int, std::list<std::pair<int, int>>::iterator> map_;

public:
    explicit LRUCache(int capacity) : capacity_(capacity) {}

    int get(int key) {
        auto it = map_.find(key);
        if (it == map_.end()) return -1;

        // Move to front (most recently used)
        order_.splice(order_.begin(), order_, it->second);
        return it->second->second;
    }

    void put(int key, int value) {
        auto it = map_.find(key);
        if (it != map_.end()) {
            it->second->second = value;
            order_.splice(order_.begin(), order_, it->second);
            return;
        }

        if ((int)order_.size() == capacity_) {
            int lruKey = order_.back().first;
            order_.pop_back();
            map_.erase(lruKey);
        }

        order_.emplace_front(key, value);
        map_[key] = order_.begin();
    }
};

int main() {
    LRUCache cache(2);
    cache.put(1, 1);
    cache.put(2, 2);
    assert(cache.get(1) == 1);   // returns 1, key 1 is now MRU

    cache.put(3, 3);             // evicts key 2 (LRU)
    assert(cache.get(2) == -1);  // key 2 was evicted
    assert(cache.get(3) == 3);

    cache.put(4, 4);             // evicts key 1
    assert(cache.get(1) == -1);
    assert(cache.get(3) == 3);
    assert(cache.get(4) == 4);

    std::cout << "All tests passed.\n";
    return 0;
}
```

**Complexity Analysis**

- **Time:** O(1) for both `get` and `put` — hash map lookup is O(1) average, list splice/insert/erase at known positions is O(1).
- **Space:** O(capacity) for the list and the hash map.

---

## Practice Resources

- [LeetCode 146 — LRU Cache](https://leetcode.com/problems/lru-cache/) — classic design problem using list + map
- [LeetCode 380 — Insert Delete GetRandom O(1)](https://leetcode.com/problems/insert-delete-getrandom-o1/) — tests STL container internals knowledge
- [cp-algorithms — Policy-Based Data Structures](https://cp-algorithms.com/data_structures/policy_based.html) — order statistics tree tutorial
- [cppreference — Iterator Library](https://en.cppreference.com/w/cpp/iterator) — full iterator category reference
- [GeeksforGeeks — Ordered Set (PBDS)](https://www.geeksforgeeks.org/ordered-set-gnu-c-pbds/) — practical guide to GNU PBDS

---

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: Segment Tree, Fenwick Tree, Sparse Table →](/docs/CodingTestPreparation/Advanced/04_segment_fenwick_sparse)
