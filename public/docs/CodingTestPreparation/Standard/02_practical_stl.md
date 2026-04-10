# Practical STL Use

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

The Standard Template Library (STL) is not just a collection of containers — it is an entire philosophy of generic, composable, and efficient programming. The real power of STL lies in its algorithms library, which provides over 100 ready-to-use algorithms that work with any container through iterators. Mastering these algorithms eliminates the need to write common operations from scratch and dramatically reduces bugs.

Lambda expressions, introduced in C++11, transformed how we use STL algorithms. Before lambdas, you had to write separate functor classes or function pointers for every custom comparison or transformation — verbose and error-prone. Lambdas let you define behavior inline, right where it's used. Combined with custom comparators, you can sort, filter, and transform data in expressive one-liners.

In coding interviews, STL fluency is a force multiplier. Knowing that `lower_bound` gives you O(log n) search on sorted data, or that `priority_queue` with a custom comparator solves "top K" problems elegantly, means you can solve problems faster with fewer bugs. Interviewers appreciate clean STL-based solutions because they demonstrate both language mastery and algorithmic thinking.

## Key Concepts

### Essential STL Algorithms

**Sorting and Searching:**

```cpp
#include <algorithm>
#include <vector>

std::vector<int> v = {5, 2, 8, 1, 9, 3};

// Sort in ascending order — O(n log n) guaranteed
std::sort(v.begin(), v.end());

// Sort in descending order
std::sort(v.begin(), v.end(), std::greater<int>());

// Binary search (requires sorted range) — O(log n)
bool found = std::binary_search(v.begin(), v.end(), 5);

// Lower bound: iterator to first element >= value
auto it = std::lower_bound(v.begin(), v.end(), 5);

// Upper bound: iterator to first element > value
auto it2 = std::upper_bound(v.begin(), v.end(), 5);
```

**Why `lower_bound` and `upper_bound` matter:** These give you the exact insertion point and count of elements. The number of elements equal to `x` is `upper_bound(x) - lower_bound(x)`.

**Accumulate and Transform:**

```cpp
#include <numeric>

std::vector<int> v = {1, 2, 3, 4, 5};

// Sum all elements
int sum = std::accumulate(v.begin(), v.end(), 0);  // 15

// Product of all elements
int product = std::accumulate(v.begin(), v.end(), 1, std::multiplies<int>());

// Transform: apply a function to each element, store in another range
std::vector<int> squared(v.size());
std::transform(v.begin(), v.end(), squared.begin(),
               [](int x) { return x * x; });
// squared = {1, 4, 9, 16, 25}
```

**Removing Elements:**

```cpp
// remove_if doesn't actually erase — it moves unwanted elements to the end
// and returns an iterator to the new logical end (erase-remove idiom)
v.erase(
    std::remove_if(v.begin(), v.end(), [](int x) { return x % 2 == 0; }),
    v.end()
);

// unique removes consecutive duplicates (sort first for all duplicates)
std::sort(v.begin(), v.end());
v.erase(std::unique(v.begin(), v.end()), v.end());
```

### Lambda Expressions

Lambdas are anonymous functions defined inline. Their syntax is:

```
[capture](parameters) -> return_type { body }
```

```cpp
// Capture nothing
auto square = [](int x) { return x * x; };

// Capture by value
int threshold = 10;
auto above = [threshold](int x) { return x > threshold; };

// Capture by reference (can modify the captured variable)
int count = 0;
std::for_each(v.begin(), v.end(), [&count](int x) {
    if (x > 0) ++count;
});

// Capture all by reference
auto fn = [&](int x) { /* can access all local variables by reference */ };
```

### Custom Comparators

Comparators define ordering for `sort`, `priority_queue`, `set`, `map`, etc.

```cpp
// Sort intervals by end time
struct Interval { int start, end; };

std::vector<Interval> intervals = {{1,4}, {2,3}, {3,5}};

std::sort(intervals.begin(), intervals.end(),
    [](const Interval& a, const Interval& b) {
        return a.end < b.end;  // ascending by end time
    });
```

### priority_queue with Custom Ordering

By default, `priority_queue` is a max-heap. To create a min-heap or use custom ordering:

```cpp
// Min-heap of ints
std::priority_queue<int, std::vector<int>, std::greater<int>> minHeap;

// Custom comparator for pairs (min-heap by second element)
auto cmp = [](const std::pair<int,int>& a, const std::pair<int,int>& b) {
    return a.second > b.second;  // greater means min-heap
};
std::priority_queue<std::pair<int,int>, std::vector<std::pair<int,int>>,
                    decltype(cmp)> pq(cmp);
```

**Why is the comparator "reversed"?** `priority_queue` puts the element for which the comparator returns `false` on top. So `greater<int>` gives a min-heap because it returns `false` when the first element is smaller (which then goes to the top).

### Iterators in Depth

Iterators are the glue between containers and algorithms. Categories (from weakest to strongest):

| Category | Operations | Example |
|----------|-----------|---------|
| Input | Read forward once | `istream_iterator` |
| Output | Write forward once | `ostream_iterator` |
| Forward | Read/write forward, multi-pass | `forward_list::iterator` |
| Bidirectional | Forward + backward | `list::iterator`, `set::iterator` |
| Random Access | Bidirectional + arithmetic | `vector::iterator`, `deque::iterator` |

```cpp
// Iterator arithmetic (random access only)
auto it = v.begin();
it += 3;          // jump to 4th element
int dist = it - v.begin();  // 3

// std::advance works with all iterator types
std::list<int> lst = {1, 2, 3, 4, 5};
auto lit = lst.begin();
std::advance(lit, 3);  // now points to 4th element

// std::next / std::prev (C++11)
auto nxt = std::next(lst.begin(), 2);  // 3rd element
```

## Common Patterns

### Erase-Remove Idiom
`std::remove` / `std::remove_if` + `container.erase()` — the standard way to delete elements matching a condition from a vector.

### Sort + Unique for Deduplication
Sort the array, then apply `std::unique` followed by `erase` to remove all duplicates in O(n log n).

### Custom Comparator for Greedy Problems
Many greedy problems (interval scheduling, task assignment) require sorting by a specific criterion — always think about what comparator to use.

### Accumulate for Reduction
Any time you need to reduce a range to a single value (sum, product, concatenation, custom fold), reach for `std::accumulate`.

### Top-K with priority_queue
Use a min-heap of size K to find the K largest elements, or a max-heap of size K for the K smallest. This gives O(n log k) which is better than full sort.

---

## Practice Problems

### Problem 1: K Most Frequent Elements Using priority_queue

**Problem Statement**

Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order.

Input: `nums = [1,1,1,2,2,3]`, `k = 2`
Output: `[1, 2]`

Input: `nums = [1]`, `k = 1`
Output: `[1]`

Constraints: 1 ≤ k ≤ number of unique elements, answer is guaranteed to be unique.

**Approach**

First, count frequencies using an `unordered_map`. Then use a min-heap (priority_queue with greater comparator) of size `k` to find the top-k frequent elements. Push each element-frequency pair onto the heap; if the heap size exceeds `k`, pop the minimum. After processing all elements, the heap contains exactly the k most frequent elements.

Why a min-heap of size k instead of a max-heap? Because we want to efficiently discard the least frequent element when the heap is full. The smallest frequency stays on top and gets popped.

**Pseudo-code**

```
function topKFrequent(nums, k):
    freq = count frequency of each element
    minHeap = priority_queue (min by frequency)

    for each (element, count) in freq:
        push (count, element) to minHeap
        if minHeap.size > k:
            pop from minHeap

    result = extract all elements from minHeap
    return result
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
#include <unordered_map>
#include <queue>

std::vector<int> topKFrequent(std::vector<int>& nums, int k) {
    std::unordered_map<int, int> freq;
    for (int n : nums) freq[n]++;

    // Min-heap: (frequency, element) — smallest frequency on top
    using pii = std::pair<int, int>;
    std::priority_queue<pii, std::vector<pii>, std::greater<pii>> minHeap;

    for (auto& [val, cnt] : freq) {
        minHeap.push({cnt, val});
        if ((int)minHeap.size() > k)
            minHeap.pop();
    }

    std::vector<int> result;
    while (!minHeap.empty()) {
        result.push_back(minHeap.top().second);
        minHeap.pop();
    }
    return result;
}

int main() {
    std::vector<int> nums = {1,1,1,2,2,3};
    int k = 2;
    auto res = topKFrequent(nums, k);
    for (int x : res) std::cout << x << " ";  // 2 1
    std::cout << std::endl;
    return 0;
}
```

**Complexity Analysis**

- **Time:** O(n log k) — counting is O(n), each heap operation is O(log k), done for each unique element
- **Space:** O(n) for the frequency map, O(k) for the heap

---

### Problem 2: Remove Duplicates from Sorted Array Using STL

**Problem Statement**

Given a sorted integer array `nums`, remove the duplicates in-place such that each unique element appears only once. Return the number of unique elements. The first `k` elements of `nums` should contain the unique elements in their original order.

Input: `nums = [1,1,2]`
Output: `k = 2`, `nums = [1,2,_]`

Input: `nums = [0,0,1,1,1,2,2,3,3,4]`
Output: `k = 5`, `nums = [0,1,2,3,4,_,_,_,_,_]`

**Approach**

Since the array is already sorted, consecutive duplicates are adjacent. Use `std::unique`, which moves unique elements to the front and returns an iterator to the new logical end. The distance from `begin()` to this iterator is the count of unique elements. This is the erase-remove idiom without the erase step (since we only need the count).

**Pseudo-code**

```
function removeDuplicates(nums):
    newEnd = std::unique(nums.begin(), nums.end())
    return distance(nums.begin(), newEnd)
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int removeDuplicates(std::vector<int>& nums) {
    if (nums.empty()) return 0;
    auto newEnd = std::unique(nums.begin(), nums.end());
    return static_cast<int>(newEnd - nums.begin());
}

int main() {
    std::vector<int> nums = {0, 0, 1, 1, 1, 2, 2, 3, 3, 4};
    int k = removeDuplicates(nums);

    std::cout << "Unique count: " << k << std::endl;  // 5
    std::cout << "Array: ";
    for (int i = 0; i < k; ++i)
        std::cout << nums[i] << " ";  // 0 1 2 3 4
    std::cout << std::endl;
    return 0;
}
```

**Complexity Analysis**

- **Time:** O(n) — `std::unique` makes a single pass through the array
- **Space:** O(1) — in-place operation

---

### Problem 3: Custom Sort with Lambda — Sort Intervals by End Time

**Problem Statement**

Given a collection of intervals where each interval is a pair `[start, end]`, sort them by their end time in ascending order. If two intervals have the same end time, sort by start time in ascending order. Then find the maximum number of non-overlapping intervals (interval scheduling problem).

Input: `intervals = [[1,3],[2,4],[3,5],[0,2],[5,7]]`
Output (sorted): `[[0,2],[1,3],[2,4],[3,5],[5,7]]`
Maximum non-overlapping: `3` → `[0,2], [3,5], [5,7]`

**Approach**

This is the classic greedy interval scheduling problem. The key insight: always pick the interval that ends earliest, because it leaves the most room for subsequent intervals. Sort by end time using a lambda comparator, then greedily select intervals that don't overlap with the last selected one.

**Pseudo-code**

```
function maxNonOverlapping(intervals):
    sort intervals by end time (lambda: a.end < b.end, tie-break by a.start < b.start)

    count = 1
    lastEnd = intervals[0].end

    for i from 1 to n-1:
        if intervals[i].start >= lastEnd:
            count++
            lastEnd = intervals[i].end

    return count
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int maxNonOverlapping(std::vector<std::vector<int>>& intervals) {
    if (intervals.empty()) return 0;

    std::sort(intervals.begin(), intervals.end(),
        [](const std::vector<int>& a, const std::vector<int>& b) {
            if (a[1] == b[1]) return a[0] < b[0];
            return a[1] < b[1];
        });

    int count = 1;
    int lastEnd = intervals[0][1];

    for (size_t i = 1; i < intervals.size(); ++i) {
        if (intervals[i][0] >= lastEnd) {
            ++count;
            lastEnd = intervals[i][1];
        }
    }

    return count;
}

int main() {
    std::vector<std::vector<int>> intervals = {{1,3},{2,4},{3,5},{0,2},{5,7}};

    int result = maxNonOverlapping(intervals);

    std::cout << "Sorted intervals: ";
    for (auto& iv : intervals)
        std::cout << "[" << iv[0] << "," << iv[1] << "] ";
    std::cout << std::endl;

    std::cout << "Max non-overlapping: " << result << std::endl;  // 3
    return 0;
}
```

**Complexity Analysis**

- **Time:** O(n log n) for sorting, O(n) for the greedy scan — overall O(n log n)
- **Space:** O(1) extra space (sort is in-place, ignoring stack space used by sort)

---

## Practice Resources

- [STL Algorithms — cppreference.com](https://en.cppreference.com/w/cpp/algorithm)
- [Top K Frequent Elements — LeetCode #347](https://leetcode.com/problems/top-k-frequent-elements/)
- [Remove Duplicates from Sorted Array — LeetCode #26](https://leetcode.com/problems/remove-duplicates-from-sorted-array/)
- [Non-overlapping Intervals — LeetCode #435](https://leetcode.com/problems/non-overlapping-intervals/)
- [C++ Lambda Expressions — GeeksforGeeks](https://www.geeksforgeeks.org/lambda-expression-in-c/)

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: Linked Lists, Trees, BST →](/docs/CodingTestPreparation/Standard/03_linked_list_trees_bst)
