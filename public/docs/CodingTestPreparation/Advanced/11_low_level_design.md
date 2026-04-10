# Low-Level Design and Custom Data Structures

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

Low-Level Design (LLD) interviews test your ability to translate requirements into clean, extensible, object-oriented code. Unlike high-level system design (which focuses on distributed architecture), LLD asks you to design classes, define interfaces, choose data structures, and write working implementations. The emphasis is on code quality: naming, separation of concerns, adherence to SOLID principles, and the ability to extend functionality without breaking existing code.

Custom data structure problems are the most common form of LLD in coding interviews. These ask you to build something from scratch — an LRU Cache, a HashMap, a Min Stack, a rate limiter — using fundamental building blocks like arrays, linked lists, and hash functions. The interviewer evaluates not just correctness but your design decisions: Why did you choose a doubly-linked list? Why is the hash function polynomial? How would you handle resizing?

Design patterns are the vocabulary of LLD. The factory pattern decouples object creation from usage. The observer pattern enables event-driven architectures. The strategy pattern lets you swap algorithms at runtime. The iterator pattern provides a uniform interface for traversal. Knowing when and how to apply these patterns demonstrates engineering maturity and is exactly what senior-level interviews assess.

## Key Concepts

### SOLID Principles

**S — Single Responsibility:** A class should have one reason to change. If a class handles both data storage and serialization, split it.

**O — Open/Closed:** Classes should be open for extension but closed for modification. Use inheritance or composition to add behavior without altering existing code.

**L — Liskov Substitution:** Derived classes must be substitutable for their base classes without breaking correctness. If `Square` extends `Rectangle`, setting width shouldn't silently change height.

**I — Interface Segregation:** Clients should not be forced to depend on interfaces they don't use. Split large interfaces into smaller, focused ones.

**D — Dependency Inversion:** High-level modules should depend on abstractions, not concrete implementations. Pass interfaces into constructors rather than instantiating dependencies internally.

```cpp
// Dependency Inversion example
class ILogger {
public:
    virtual void log(const std::string& msg) = 0;
    virtual ~ILogger() = default;
};

class FileLogger : public ILogger {
public:
    void log(const std::string& msg) override {
        // write to file
    }
};

class Service {
    ILogger& logger_;
public:
    Service(ILogger& logger) : logger_(logger) {}
    void doWork() {
        logger_.log("Work done");
    }
};
```

### LRU Cache Design

An LRU (Least Recently Used) Cache evicts the least recently accessed entry when the cache reaches capacity. It requires O(1) `get` and O(1) `put`.

**Data structure choice:** A hash map for O(1) key lookup + a doubly-linked list for O(1) insertion/removal and tracking access order. The most recently accessed item moves to the front; the back of the list is the eviction candidate.

```cpp
#include <unordered_map>
#include <list>

class LRUCache {
    int capacity_;
    std::list<std::pair<int, int>> order_;  // front = most recent
    std::unordered_map<int, std::list<std::pair<int, int>>::iterator> map_;

public:
    LRUCache(int capacity) : capacity_(capacity) {}

    int get(int key) {
        auto it = map_.find(key);
        if (it == map_.end()) return -1;
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
        if ((int)map_.size() == capacity_) {
            int evictKey = order_.back().first;
            order_.pop_back();
            map_.erase(evictKey);
        }
        order_.emplace_front(key, value);
        map_[key] = order_.begin();
    }
};
```

### HashMap from Scratch

A hash map stores key-value pairs and provides O(1) average-time lookup, insertion, and deletion. The core components are:

1. **Hash function:** Maps keys to bucket indices. A good hash function distributes keys uniformly.
2. **Bucket array:** An array of buckets (typically linked lists for chaining).
3. **Collision handling:** Chaining (linked list per bucket) or open addressing (probing).
4. **Load factor and resizing:** When the ratio of elements to buckets exceeds a threshold (~0.75), double the bucket count and rehash all entries.

```cpp
class HashMap {
    struct Node {
        int key, value;
        Node* next;
        Node(int k, int v) : key(k), value(v), next(nullptr) {}
    };

    std::vector<Node*> buckets_;
    int size_, capacity_;
    static constexpr double LOAD_FACTOR = 0.75;

    int hash(int key) const {
        return ((long long)key % capacity_ + capacity_) % capacity_;
    }

    void resize() {
        int newCap = capacity_ * 2;
        std::vector<Node*> newBuckets(newCap, nullptr);
        for (int i = 0; i < capacity_; i++) {
            Node* curr = buckets_[i];
            while (curr) {
                Node* next = curr->next;
                int idx = ((long long)curr->key % newCap + newCap) % newCap;
                curr->next = newBuckets[idx];
                newBuckets[idx] = curr;
                curr = next;
            }
        }
        buckets_ = std::move(newBuckets);
        capacity_ = newCap;
    }

public:
    HashMap(int initialCap = 16) : size_(0), capacity_(initialCap) {
        buckets_.resize(capacity_, nullptr);
    }

    void put(int key, int value) {
        int idx = hash(key);
        Node* curr = buckets_[idx];
        while (curr) {
            if (curr->key == key) { curr->value = value; return; }
            curr = curr->next;
        }
        Node* node = new Node(key, value);
        node->next = buckets_[idx];
        buckets_[idx] = node;
        size_++;
        if ((double)size_ / capacity_ > LOAD_FACTOR) resize();
    }

    int get(int key) const {
        int idx = hash(key);
        Node* curr = buckets_[idx];
        while (curr) {
            if (curr->key == key) return curr->value;
            curr = curr->next;
        }
        return -1;
    }

    bool remove(int key) {
        int idx = hash(key);
        Node* curr = buckets_[idx];
        Node* prev = nullptr;
        while (curr) {
            if (curr->key == key) {
                if (prev) prev->next = curr->next;
                else buckets_[idx] = curr->next;
                delete curr;
                size_--;
                return true;
            }
            prev = curr;
            curr = curr->next;
        }
        return false;
    }
};
```

### Design Patterns

#### Factory Pattern

Creates objects without exposing the instantiation logic. The client code works with a common interface and doesn't know the concrete class.

```cpp
class Shape {
public:
    virtual void draw() = 0;
    virtual ~Shape() = default;
};

class Circle : public Shape {
public:
    void draw() override { std::cout << "Drawing Circle\n"; }
};

class Rectangle : public Shape {
public:
    void draw() override { std::cout << "Drawing Rectangle\n"; }
};

class ShapeFactory {
public:
    static std::unique_ptr<Shape> create(const std::string& type) {
        if (type == "circle") return std::make_unique<Circle>();
        if (type == "rectangle") return std::make_unique<Rectangle>();
        return nullptr;
    }
};
```

#### Observer Pattern

Defines a one-to-many dependency: when the subject changes state, all observers are notified automatically.

```cpp
#include <vector>
#include <algorithm>
#include <functional>

class EventEmitter {
    std::vector<std::function<void(int)>> listeners_;
public:
    void subscribe(std::function<void(int)> fn) {
        listeners_.push_back(std::move(fn));
    }

    void emit(int data) {
        for (auto& fn : listeners_)
            fn(data);
    }
};
```

#### Strategy Pattern

Encapsulates a family of algorithms and makes them interchangeable at runtime.

```cpp
class SortStrategy {
public:
    virtual void sort(std::vector<int>& data) = 0;
    virtual ~SortStrategy() = default;
};

class QuickSort : public SortStrategy {
public:
    void sort(std::vector<int>& data) override {
        std::sort(data.begin(), data.end());
    }
};

class Sorter {
    std::unique_ptr<SortStrategy> strategy_;
public:
    void setStrategy(std::unique_ptr<SortStrategy> s) {
        strategy_ = std::move(s);
    }
    void sort(std::vector<int>& data) {
        if (strategy_) strategy_->sort(data);
    }
};
```

#### Iterator Pattern

Provides a way to access elements of a collection sequentially without exposing the underlying representation.

```cpp
template <typename T>
class DynamicArray {
    T* data_;
    int size_, capacity_;

public:
    class Iterator {
        T* ptr_;
    public:
        Iterator(T* p) : ptr_(p) {}
        T& operator*() { return *ptr_; }
        Iterator& operator++() { ptr_++; return *this; }
        bool operator!=(const Iterator& other) const { return ptr_ != other.ptr_; }
    };

    Iterator begin() { return Iterator(data_); }
    Iterator end() { return Iterator(data_ + size_); }
};
```

## Common Patterns

### Pattern 1: Hash Map + Linked List for Ordered Caches

The combination of a hash map (for O(1) lookup) and a doubly-linked list (for O(1) order manipulation) is the standard approach for LRU Cache, LFU Cache, and similar ordered-access structures.

### Pattern 2: Class Diagram to Code Translation

When given a UML class diagram, map classes to C++ classes, associations to member variables (composition/aggregation), inheritance arrows to public inheritance, and interface boxes to pure virtual base classes. Use `std::unique_ptr` for ownership and raw references for non-owning relationships.

### Pattern 3: Auxiliary Stack for O(1) Metadata

When a data structure needs to track a running property (min, max, median) alongside normal operations, maintain a parallel auxiliary structure. For Min Stack, a second stack tracks the current minimum at each level.

### Pattern 4: Separation of Interface and Implementation

Define abstract base classes for core operations, then provide concrete implementations. This enables testing with mocks, supports the strategy pattern, and follows the Dependency Inversion principle.

---

## Practice Problems

### Problem 1: Design and Implement an LRU Cache

**Problem Statement**

Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the `LRUCache` class:

- `LRUCache(int capacity)` — Initialize the cache with positive size capacity.
- `int get(int key)` — Return the value of the key if it exists, otherwise return -1.
- `void put(int key, int value)` — Update or insert the value. If the number of keys exceeds the capacity, evict the least recently used key.

Both operations must run in O(1) average time complexity.

```
Input:
  LRUCache cache(2);
  cache.put(1, 1);
  cache.put(2, 2);
  cache.get(1);       // returns 1
  cache.put(3, 3);    // evicts key 2
  cache.get(2);       // returns -1
  cache.get(3);       // returns 3
```

**Approach**

Combine a `std::unordered_map<int, iterator>` with a `std::list<pair<int,int>>`. The list maintains access order (most recent at front). On `get`, move the accessed node to the front using `splice`. On `put`, if the key exists, update and move to front. If new, check capacity — if full, evict `back()` of the list, remove from map, then insert at front.

**Pseudo-code**

```
class LRUCache:
    map: key -> iterator into list
    list: doubly linked list of (key, value) pairs
    capacity: int

    get(key):
        if key not in map: return -1
        move map[key] to front of list
        return map[key]->value

    put(key, value):
        if key in map:
            update map[key]->value
            move to front
            return
        if map.size == capacity:
            evict = list.back
            map.erase(evict.key)
            list.pop_back
        list.push_front(key, value)
        map[key] = list.begin
```

**C++ Solution**

```cpp
#include <iostream>
#include <unordered_map>
#include <list>
using namespace std;

class LRUCache {
    int capacity_;
    list<pair<int, int>> order_;
    unordered_map<int, list<pair<int, int>>::iterator> map_;

public:
    LRUCache(int capacity) : capacity_(capacity) {}

    int get(int key) {
        auto it = map_.find(key);
        if (it == map_.end()) return -1;
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
        if ((int)map_.size() == capacity_) {
            int evictKey = order_.back().first;
            order_.pop_back();
            map_.erase(evictKey);
        }
        order_.emplace_front(key, value);
        map_[key] = order_.begin();
    }
};

int main() {
    LRUCache cache(2);
    cache.put(1, 1);
    cache.put(2, 2);
    cout << cache.get(1) << endl;    // 1
    cache.put(3, 3);                 // evicts 2
    cout << cache.get(2) << endl;    // -1
    cout << cache.get(3) << endl;    // 3
    return 0;
}
```

**Complexity Analysis**
- **Time:** O(1) for both `get` and `put`. Hash map lookup is O(1) average, and list `splice`/`push_front`/`pop_back` are all O(1).
- **Space:** O(capacity) — the map and list each store at most `capacity` entries.

---

### Problem 2: Design a HashMap from Scratch (with Chaining)

**Problem Statement**

Design a HashMap without using any built-in hash table libraries. Implement:

- `void put(int key, int value)` — Insert or update a (key, value) pair.
- `int get(int key)` — Return the value mapped to key, or -1 if not found.
- `void remove(int key)` — Remove the key and its value if it exists.

Assume keys are integers. The implementation should handle collisions using separate chaining and resize when the load factor exceeds 0.75.

```
Input:
  MyHashMap map;
  map.put(1, 10);
  map.put(2, 20);
  map.get(1);       // returns 10
  map.get(3);       // returns -1
  map.remove(2);
  map.get(2);       // returns -1
```

**Approach**

Use an array of buckets, where each bucket is a linked list of (key, value) nodes. The hash function maps a key to a bucket index via `key % capacity`. On collision, append to the bucket's list. When the load factor (size / capacity) exceeds 0.75, double the bucket array and rehash all entries.

**Pseudo-code**

```
class MyHashMap:
    buckets: array of linked lists
    size, capacity

    hash(key): return key mod capacity

    put(key, value):
        idx = hash(key)
        if key exists in buckets[idx]:
            update value
        else:
            append (key, value) to buckets[idx]
            size++
        if size / capacity > 0.75:
            resize(capacity * 2)

    get(key):
        idx = hash(key)
        search buckets[idx] for key
        return value or -1

    remove(key):
        idx = hash(key)
        find and remove node with key from buckets[idx]
        size--
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
using namespace std;

class MyHashMap {
    struct Node {
        int key, value;
        Node* next;
        Node(int k, int v) : key(k), value(v), next(nullptr) {}
    };

    vector<Node*> buckets_;
    int size_, capacity_;

    int hash(int key) const {
        return ((long long)key % capacity_ + capacity_) % capacity_;
    }

    void resize() {
        int newCap = capacity_ * 2;
        vector<Node*> newBuckets(newCap, nullptr);
        for (int i = 0; i < capacity_; i++) {
            Node* curr = buckets_[i];
            while (curr) {
                Node* next = curr->next;
                int idx = ((long long)curr->key % newCap + newCap) % newCap;
                curr->next = newBuckets[idx];
                newBuckets[idx] = curr;
                curr = next;
            }
        }
        buckets_ = move(newBuckets);
        capacity_ = newCap;
    }

public:
    MyHashMap() : size_(0), capacity_(16) {
        buckets_.resize(capacity_, nullptr);
    }

    ~MyHashMap() {
        for (int i = 0; i < capacity_; i++) {
            Node* curr = buckets_[i];
            while (curr) {
                Node* next = curr->next;
                delete curr;
                curr = next;
            }
        }
    }

    void put(int key, int value) {
        int idx = hash(key);
        Node* curr = buckets_[idx];
        while (curr) {
            if (curr->key == key) {
                curr->value = value;
                return;
            }
            curr = curr->next;
        }
        Node* node = new Node(key, value);
        node->next = buckets_[idx];
        buckets_[idx] = node;
        size_++;
        if ((double)size_ / capacity_ > 0.75)
            resize();
    }

    int get(int key) const {
        int idx = hash(key);
        Node* curr = buckets_[idx];
        while (curr) {
            if (curr->key == key) return curr->value;
            curr = curr->next;
        }
        return -1;
    }

    void remove(int key) {
        int idx = hash(key);
        Node* curr = buckets_[idx];
        Node* prev = nullptr;
        while (curr) {
            if (curr->key == key) {
                if (prev) prev->next = curr->next;
                else buckets_[idx] = curr->next;
                delete curr;
                size_--;
                return;
            }
            prev = curr;
            curr = curr->next;
        }
    }
};

int main() {
    MyHashMap map;
    map.put(1, 10);
    map.put(2, 20);
    cout << map.get(1) << endl;      // 10
    cout << map.get(3) << endl;      // -1
    map.remove(2);
    cout << map.get(2) << endl;      // -1
    return 0;
}
```

**Complexity Analysis**
- **Time:** O(1) average for `put`, `get`, and `remove`. Worst case O(N) if all keys hash to the same bucket (degenerate hash function). Resizing is O(N) amortized over N insertions.
- **Space:** O(N) — where N is the number of stored key-value pairs, plus O(capacity) for the bucket array.

---

### Problem 3: Design a Min Stack

**Problem Statement**

Design a stack that supports the following operations in O(1) time:

- `void push(int val)` — Push element onto stack.
- `void pop()` — Remove the top element.
- `int top()` — Get the top element.
- `int getMin()` — Retrieve the minimum element in the stack.

All operations must be O(1) time complexity.

```
Input:
  MinStack s;
  s.push(-2);
  s.push(0);
  s.push(-3);
  s.getMin();   // returns -3
  s.pop();
  s.top();      // returns 0
  s.getMin();   // returns -2
```

**Approach**

Maintain two stacks: the main stack and a min stack. The min stack tracks the current minimum at each level. When pushing a value, also push onto the min stack the smaller of the new value and the current minimum. When popping, pop from both stacks. `getMin()` simply returns the top of the min stack.

A space-optimized variant: only push onto the min stack when the new value is ≤ the current minimum, and only pop from the min stack when the popped value equals the min stack's top.

**Pseudo-code**

```
class MinStack:
    main_stack: stack of integers
    min_stack: stack of integers

    push(val):
        main_stack.push(val)
        if min_stack empty or val <= min_stack.top():
            min_stack.push(val)

    pop():
        if main_stack.top() == min_stack.top():
            min_stack.pop()
        main_stack.pop()

    top():
        return main_stack.top()

    getMin():
        return min_stack.top()
```

**C++ Solution**

```cpp
#include <iostream>
#include <stack>
using namespace std;

class MinStack {
    stack<int> main_;
    stack<int> min_;

public:
    void push(int val) {
        main_.push(val);
        if (min_.empty() || val <= min_.top())
            min_.push(val);
    }

    void pop() {
        if (main_.top() == min_.top())
            min_.pop();
        main_.pop();
    }

    int top() const {
        return main_.top();
    }

    int getMin() const {
        return min_.top();
    }
};

int main() {
    MinStack s;
    s.push(-2);
    s.push(0);
    s.push(-3);
    cout << s.getMin() << endl;   // -3
    s.pop();
    cout << s.top() << endl;      // 0
    cout << s.getMin() << endl;   // -2
    return 0;
}
```

**Complexity Analysis**
- **Time:** O(1) for all four operations — `push`, `pop`, `top`, and `getMin` each perform a constant number of stack operations.
- **Space:** O(N) in the worst case (when elements are pushed in decreasing order, the min stack holds all N elements). In practice, the min stack is much smaller if values are not monotonically decreasing.

---

## Practice Resources

- [LeetCode — LRU Cache (#146)](https://leetcode.com/problems/lru-cache/)
- [LeetCode — Design HashMap (#706)](https://leetcode.com/problems/design-hashmap/)
- [LeetCode — Min Stack (#155)](https://leetcode.com/problems/min-stack/)
- [GeeksforGeeks — SOLID Principles in C++](https://www.geeksforgeeks.org/solid-principle-in-programming-understand-with-real-life-examples/)
- [Refactoring Guru — Design Patterns](https://refactoring.guru/design-patterns)

---

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: Hard Interview Patterns →](/docs/CodingTestPreparation/Advanced/12_hard_interview_patterns)
