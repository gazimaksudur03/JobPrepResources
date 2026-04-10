# STL Basics

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

The **Standard Template Library (STL)** is the backbone of competitive C++ programming. It provides ready-made, highly optimized data structures (containers) and algorithms so you never have to implement a hash map or a sorting routine from scratch during an interview. Knowing which container to reach for — and its time-complexity guarantees — is one of the biggest productivity multipliers you can develop.

The STL has three pillars: **containers** (store data), **iterators** (traverse data), and **algorithms** (operate on data). Containers come in two broad families — *sequence containers* (`vector`, `deque`, `list`) that keep elements in insertion order, and *associative containers* (`map`, `set`, `unordered_map`, `unordered_set`) that organize elements by keys or values. Learning the most-used subset well is far more valuable than memorizing every container.

In coding interviews, `vector`, `unordered_map`, and `set` solve the vast majority of problems. Pairing them with `sort`, `lower_bound`, and range-based for loops will cover 90 % of what you need at the basic level.

## Key Concepts

### vector

A dynamic array that grows automatically. Use it as your default container.

```cpp
#include <vector>
#include <iostream>

int main() {
    std::vector<int> v = {3, 1, 4, 1, 5};
    v.push_back(9);          // append
    v.pop_back();             // remove last
    v[0] = 10;                // random access O(1)
    std::cout << v.size();    // 5
    std::cout << v.front();   // 10
    std::cout << v.back();    // 5

    for (int x : v)           // range-based for
        std::cout << x << " ";
}
```

| Operation       | Time     |
|-----------------|----------|
| `push_back`     | Amortized O(1) |
| `pop_back`      | O(1)     |
| Random access   | O(1)     |
| Insert/erase at middle | O(n) |

### string

`std::string` is essentially a `vector<char>` with extra text utilities.

```cpp
#include <string>

std::string s = "hello";
s += " world";               // concatenation
char c = s[0];                // 'h'
std::string sub = s.substr(0, 5); // "hello"
int pos = s.find("world");   // 6
s.erase(5, 1);               // remove the space
```

### pair

Bundles two values. Used constantly with maps and sorting.

```cpp
#include <utility>

std::pair<int, std::string> p = {1, "one"};
std::cout << p.first << " " << p.second; // 1 one
auto q = std::make_pair(2, "two");
```

### map and unordered_map

`map` stores key-value pairs in **sorted** order (red-black tree). `unordered_map` uses **hashing** for average O(1) access.

```cpp
#include <map>
#include <unordered_map>

// Sorted by key — O(log n) per operation
std::map<std::string, int> m;
m["banana"] = 2;
m["apple"]  = 5;
// iteration order: apple, banana

// Hashed — average O(1) per operation
std::unordered_map<std::string, int> um;
um["banana"] = 2;
um["apple"]  = 5;
// iteration order: undefined
```

| Operation  | `map` (sorted) | `unordered_map` (hash) |
|-----------|:--------------:|:---------------------:|
| Insert    | O(log n) | O(1) avg |
| Lookup    | O(log n) | O(1) avg |
| Erase     | O(log n) | O(1) avg |
| Ordered?  | Yes      | No       |

### set and unordered_set

Like maps but store **keys only** (no values). `set` is sorted; `unordered_set` is hashed.

```cpp
#include <set>

std::set<int> s = {3, 1, 4, 1, 5}; // {1, 3, 4, 5} — duplicates removed, sorted
s.insert(2);
s.erase(3);
bool found = s.count(4); // 1 (true)
```

### stack and queue

Adapter containers built on top of `deque` by default.

```cpp
#include <stack>
#include <queue>

std::stack<int> st;
st.push(10);
st.push(20);
st.top();  // 20  (LIFO)
st.pop();

std::queue<int> q;
q.push(10);
q.push(20);
q.front(); // 10  (FIFO)
q.pop();
```

### sort and Custom Comparators

`std::sort` sorts a range in O(n log n) using introsort.

```cpp
#include <algorithm>
#include <vector>

std::vector<int> v = {5, 2, 8, 1};
std::sort(v.begin(), v.end());          // ascending: 1 2 5 8
std::sort(v.begin(), v.end(), std::greater<int>()); // descending: 8 5 2 1

// Custom comparator via lambda
std::vector<std::pair<int,int>> pairs = {{1,5},{3,2},{2,8}};
std::sort(pairs.begin(), pairs.end(), [](const auto& a, const auto& b) {
    return a.second < b.second; // sort by second element
});
```

### Iterators and the auto Keyword

Iterators are generalized pointers that let algorithms work with any container.

```cpp
std::vector<int> v = {10, 20, 30};

// Traditional iterator
for (std::vector<int>::iterator it = v.begin(); it != v.end(); ++it)
    std::cout << *it << " ";

// With auto (preferred in modern C++)
for (auto it = v.begin(); it != v.end(); ++it)
    std::cout << *it << " ";

// Range-based for (cleanest)
for (auto& x : v)
    std::cout << x << " ";
```

Use `auto` with containers to avoid verbose type names:

```cpp
std::unordered_map<std::string, std::vector<int>> data;
auto it = data.find("key"); // much cleaner than the full type
```

## Common Patterns

### Pattern 1 — Frequency Counting with unordered_map

Many problems reduce to "count how many times each element appears." Build a frequency map in O(n), then query it.

```cpp
std::unordered_map<int, int> freq;
for (int x : arr) freq[x]++;
```

### Pattern 2 — De-duplication with set / unordered_set

When you need unique elements or need to check membership quickly, insert everything into a set.

### Pattern 3 — Sorting with Custom Criteria

Problems that ask "sort by X, then by Y" need a custom comparator lambda passed to `std::sort`.

### Pattern 4 — Stack for Matching / Nesting

Parentheses matching, nearest greater element, and expression evaluation all use a stack.

---

## Practice Problems

### Problem 1: Find Duplicate Elements Using Set

**Problem Statement**

Given an integer array, return all elements that appear more than once. Output them in any order without duplicates.

```
Input:  [4, 3, 2, 7, 8, 2, 3, 1]
Output: [2, 3]
```

**Approach**

Traverse the array. Maintain a `seen` set. If an element is already in `seen`, add it to a `duplicates` set. Using a set for duplicates automatically prevents listing the same duplicate twice.

**Pseudo-code**

```
function findDuplicates(arr):
    seen = empty set
    duplicates = empty set
    for each x in arr:
        if x in seen:
            add x to duplicates
        else:
            add x to seen
    return elements of duplicates
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
#include <unordered_set>

std::vector<int> findDuplicates(const std::vector<int>& arr) {
    std::unordered_set<int> seen;
    std::unordered_set<int> dups;

    for (int x : arr) {
        if (seen.count(x))
            dups.insert(x);
        else
            seen.insert(x);
    }

    return std::vector<int>(dups.begin(), dups.end());
}

int main() {
    std::vector<int> arr = {4, 3, 2, 7, 8, 2, 3, 1};
    std::vector<int> result = findDuplicates(arr);

    for (int x : result)
        std::cout << x << " ";
    // Output: 2 3 (order may vary)

    return 0;
}
```

**Complexity Analysis**

- **Time:** O(n) — single pass through the array; hash set operations are O(1) average.
- **Space:** O(n) — worst case every element stored in `seen`.

---

### Problem 2: Count Frequency of Elements Using Map

**Problem Statement**

Given an array of integers, print each distinct element and how many times it appears, sorted by element value.

```
Input:  [1, 3, 2, 1, 4, 2, 1, 3]
Output:
  1 → 3
  2 → 2
  3 → 2
  4 → 1
```

**Approach**

Use `std::map` (sorted) to build a frequency table. Since `map` keeps keys in sorted order, iteration will produce output in ascending order automatically.

**Pseudo-code**

```
function countFrequency(arr):
    freq = empty sorted map
    for each x in arr:
        freq[x] += 1
    for each (key, value) in freq:
        print key → value
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
#include <map>

void countFrequency(const std::vector<int>& arr) {
    std::map<int, int> freq;

    for (int x : arr)
        freq[x]++;

    for (const auto& [key, count] : freq)
        std::cout << key << " -> " << count << "\n";
}

int main() {
    std::vector<int> arr = {1, 3, 2, 1, 4, 2, 1, 3};
    countFrequency(arr);
    // 1 -> 3
    // 2 -> 2
    // 3 -> 2
    // 4 -> 1

    return 0;
}
```

**Complexity Analysis**

- **Time:** O(n log n) — each of the n insertions into `std::map` takes O(log n). If sorted order is not needed, `unordered_map` reduces this to O(n).
- **Space:** O(k) where k is the number of distinct elements.

---

### Problem 3: Sort an Array of Pairs by Second Element

**Problem Statement**

Given a vector of `(int, int)` pairs, sort them in ascending order of their second element. If second elements are equal, sort by first element ascending.

```
Input:  [(1, 5), (3, 2), (2, 8), (4, 2)]
Output: [(3, 2), (4, 2), (1, 5), (2, 8)]
```

**Approach**

Use `std::sort` with a custom comparator lambda. Compare by `.second` first; if equal, compare by `.first`.

**Pseudo-code**

```
function sortBySecond(pairs):
    sort pairs with comparator:
        if a.second != b.second:
            return a.second < b.second
        return a.first < b.first
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<std::pair<int, int>> pairs = {{1, 5}, {3, 2}, {2, 8}, {4, 2}};

    std::sort(pairs.begin(), pairs.end(), [](const auto& a, const auto& b) {
        if (a.second != b.second)
            return a.second < b.second;
        return a.first < b.first;
    });

    for (const auto& [x, y] : pairs)
        std::cout << "(" << x << ", " << y << ") ";
    // (3, 2) (4, 2) (1, 5) (2, 8)

    return 0;
}
```

**Complexity Analysis**

- **Time:** O(n log n) — dominated by `std::sort`.
- **Space:** O(1) extra (sort is in-place, ignoring the O(log n) stack for introsort).

---

## Practice Resources

- [LeetCode — Contains Duplicate (easy)](https://leetcode.com/problems/contains-duplicate/)
- [LeetCode — Two Sum (hash map classic)](https://leetcode.com/problems/two-sum/)
- [LeetCode — Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/)
- [GeeksforGeeks — STL in C++](https://www.geeksforgeeks.org/the-c-standard-template-library-stl/)
- [Cplusplus.com — Containers Reference](https://cplusplus.com/reference/stl/)

---

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: Complexity Basics →](/docs/CodingTestPreparation/Basic/09_complexity_basics)
