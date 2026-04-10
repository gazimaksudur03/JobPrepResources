# Hard Interview Problem Patterns

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

Hard-level interview problems are distinguished not by obscure algorithms but by the need to combine multiple techniques and recognize non-obvious structural patterns. A problem might look like it requires dynamic programming, but the optimal solution uses a monotonic stack. Another might appear to need sorting, but a line sweep algorithm handles it in a single pass. Recognizing these patterns — and knowing which tool to reach for — is what separates candidates who solve hard problems from those who don't.

The patterns in this section represent the most frequently tested hard techniques at top-tier companies and competitive programming contests. The monotonic stack maintains a stack of elements in sorted order to efficiently answer "next greater/smaller element" queries. The two-heap pattern (max-heap + min-heap) efficiently tracks the median of a data stream. Line sweep converts 2D geometric or interval problems into sorted event processing. Meet-in-the-middle splits the search space in half to reduce exponential complexity from O(2^N) to O(2^(N/2)).

Advanced backtracking with pruning is the foundation for constraint satisfaction problems like N-Queens, Sudoku solving, and graph coloring. Divide and conquer optimization applies to specific DP recurrences to reduce O(N²) to O(N log N). Order statistics and randomized algorithms (like randomized quickselect) provide expected O(N) solutions to selection problems. Each of these patterns has a recognizable structure — learning to identify it during an interview is half the battle.

## Key Concepts

### Monotonic Stack

A monotonic stack maintains elements in strictly increasing or decreasing order. When a new element violates the monotonicity, elements are popped from the stack until the property is restored. This efficiently solves "next greater element," "next smaller element," and histogram-related problems.

**Increasing monotonic stack** (smallest at bottom): used to find the next greater element to the right.

**Decreasing monotonic stack** (largest at bottom): used to find the next smaller element to the right.

```cpp
vector<int> nextGreaterElement(const vector<int>& arr) {
    int n = arr.size();
    vector<int> result(n, -1);
    stack<int> st;  // stores indices
    for (int i = 0; i < n; i++) {
        while (!st.empty() && arr[st.top()] < arr[i]) {
            result[st.top()] = arr[i];
            st.pop();
        }
        st.push(i);
    }
    return result;
}
```

**Monotonic queue** extends this idea with a deque to maintain a sliding window maximum/minimum in O(1) amortized per element.

```cpp
vector<int> slidingWindowMax(const vector<int>& arr, int k) {
    deque<int> dq;
    vector<int> result;
    for (int i = 0; i < (int)arr.size(); i++) {
        while (!dq.empty() && dq.front() <= i - k)
            dq.pop_front();
        while (!dq.empty() && arr[dq.back()] <= arr[i])
            dq.pop_back();
        dq.push_back(i);
        if (i >= k - 1)
            result.push_back(arr[dq.front()]);
    }
    return result;
}
```

### Line Sweep Algorithm

Line sweep processes events (start/end of intervals, points entering/leaving) sorted by coordinate. A sweep line moves across one dimension, and a data structure (often a balanced BST, multiset, or priority queue) maintains the active set of objects.

Applications: counting overlapping intervals, finding the maximum number of simultaneous events, computing area of union of rectangles, closest pair of points.

```cpp
int maxOverlappingIntervals(vector<pair<int, int>>& intervals) {
    vector<pair<int, int>> events;
    for (auto& [s, e] : intervals) {
        events.push_back({s, 1});   // start event
        events.push_back({e, -1});  // end event
    }
    sort(events.begin(), events.end());
    int current = 0, maxOverlap = 0;
    for (auto& [pos, type] : events) {
        current += type;
        maxOverlap = max(maxOverlap, current);
    }
    return maxOverlap;
}
```

### Meet-in-the-Middle

When brute-force is O(2^N) and N is around 40, split the input into two halves of size N/2. Enumerate all possibilities for each half independently (O(2^(N/2)) each), then combine results using sorting + binary search or two pointers.

Classic example: given N integers, find the subset whose sum is closest to a target T. Split into two halves, enumerate all 2^(N/2) subset sums for each, sort one half, and binary search for the complement.

```cpp
long long closestSubsetSum(vector<int>& arr, long long target) {
    int n = arr.size();
    int half = n / 2;

    auto enumerate = [&](int start, int end) {
        vector<long long> sums;
        int sz = end - start;
        for (int mask = 0; mask < (1 << sz); mask++) {
            long long s = 0;
            for (int i = 0; i < sz; i++)
                if (mask & (1 << i))
                    s += arr[start + i];
            sums.push_back(s);
        }
        sort(sums.begin(), sums.end());
        return sums;
    };

    auto left = enumerate(0, half);
    auto right = enumerate(half, n);

    long long best = LLONG_MAX;
    for (long long s : left) {
        long long need = target - s;
        auto it = lower_bound(right.begin(), right.end(), need);
        if (it != right.end())
            best = min(best, abs(s + *it - target));
        if (it != right.begin())
            best = min(best, abs(s + *prev(it) - target));
    }
    return best;
}
```

### Advanced Backtracking with Pruning

Backtracking explores all possible solutions by building candidates incrementally and abandoning (pruning) branches that cannot lead to valid solutions. For hard problems, the key is aggressive pruning:

- **Constraint propagation:** After placing a queen, immediately mark all attacked positions.
- **Ordering heuristics:** Try the most constrained variable first (MRV in CSP terms).
- **Symmetry breaking:** Avoid exploring mirror/rotation-equivalent configurations.
- **Bound checking:** If the remaining search space cannot possibly improve on the current best, prune.

### Two Heaps (Median Finding)

Maintain two heaps: a max-heap for the lower half of the data and a min-heap for the upper half. The median is either the top of the max-heap (odd count) or the average of both tops (even count). Rebalancing ensures the heaps differ in size by at most 1.

```cpp
class MedianFinder {
    priority_queue<int> maxHeap;                           // lower half
    priority_queue<int, vector<int>, greater<int>> minHeap; // upper half

public:
    void addNum(int num) {
        maxHeap.push(num);
        minHeap.push(maxHeap.top());
        maxHeap.pop();
        if (minHeap.size() > maxHeap.size()) {
            maxHeap.push(minHeap.top());
            minHeap.pop();
        }
    }

    double findMedian() {
        if (maxHeap.size() > minHeap.size())
            return maxHeap.top();
        return (maxHeap.top() + minHeap.top()) / 2.0;
    }
};
```

### Divide and Conquer Optimization

Applies to DP recurrences of the form `dp[i][j] = min over k of (dp[i-1][k] + cost(k+1, j))` where the optimal `k` for `dp[i][j]` is monotonically non-decreasing in `j`. This lets you solve each row of the DP in O(N log N) instead of O(N²) using a divide-and-conquer approach on the `j` dimension.

### Order Statistics

The k-th smallest element in an unsorted array can be found in O(N) expected time using randomized quickselect (partition around a random pivot, recurse into the relevant side). The `std::nth_element` function in C++ STL implements this.

```cpp
int quickselect(vector<int>& arr, int left, int right, int k) {
    if (left == right) return arr[left];
    int pivotIdx = left + rand() % (right - left + 1);
    swap(arr[pivotIdx], arr[right]);
    int pivot = arr[right];
    int storeIdx = left;
    for (int i = left; i < right; i++) {
        if (arr[i] < pivot)
            swap(arr[i], arr[storeIdx++]);
    }
    swap(arr[storeIdx], arr[right]);
    if (k == storeIdx) return arr[k];
    if (k < storeIdx) return quickselect(arr, left, storeIdx - 1, k);
    return quickselect(arr, storeIdx + 1, right, k);
}
```

### Randomized Algorithms

Beyond quickselect, randomized approaches include:
- **Randomized hashing:** Multiple random hash functions reduce collision probability.
- **Random sampling:** Reservoir sampling selects k items uniformly from a stream.
- **Monte Carlo methods:** Approximate solutions with probabilistic guarantees (e.g., Miller-Rabin primality test).

## Common Patterns

### Pattern 1: Monotonic Stack for Histogram Problems

Problems involving "largest rectangle in histogram," "trapping rain water," and "stock span" all reduce to finding the nearest smaller (or greater) element on each side. Use a monotonic stack to process all elements in a single left-to-right pass.

### Pattern 2: Two Heaps for Running Statistics

Whenever a problem asks for the median, the k-th largest, or maintaining sorted order in a stream, consider the two-heap approach. The max-heap/min-heap split provides O(log N) insertion and O(1) median access.

### Pattern 3: Backtracking Template

Most backtracking problems follow this structure:

```
function backtrack(state, choices):
    if state is complete:
        record solution
        return
    for each choice in choices:
        if choice is valid:
            make choice
            backtrack(new state, remaining choices)
            undo choice
```

The art is in defining "valid" (the pruning conditions) as tightly as possible.

### Pattern 4: Line Sweep for Interval/Geometric Problems

When a problem involves intervals on a number line or geometric objects in 2D, sort events by coordinate and sweep. Maintain an active set that changes at each event. This reduces 2D problems to 1D processing.

---

## Practice Problems

### Problem 1: Trapping Rain Water (Monotonic Stack)

**Problem Statement**

Given `N` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

```
Input:  height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]
Output: 6
```

```
Input:  height = [4, 2, 0, 3, 2, 5]
Output: 9
```

**Approach**

Use a monotonic decreasing stack that stores indices. When the current bar is taller than the stack's top, water is trapped between the current bar and the bar below the top. Pop the top (this is the "bottom" of the trapped water). The water width is `current_index - new_stack_top - 1`, and the water height is `min(height[current], height[new_stack_top]) - height[bottom]`. Accumulate the trapped water for each pop.

Alternatively, the two-pointer approach works: maintain `left_max` and `right_max` pointers. Move the pointer with the smaller max inward, and the water trapped at that position is `max_height - current_height`.

**Pseudo-code**

```
function trap(height):
    stack = empty (stores indices)
    water = 0
    for i from 0 to n - 1:
        while stack not empty and height[i] > height[stack.top()]:
            bottom = stack.pop()
            if stack empty: break
            width = i - stack.top() - 1
            h = min(height[i], height[stack.top()]) - height[bottom]
            water += width * h
        stack.push(i)
    return water
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
#include <stack>
using namespace std;

int trap(const vector<int>& height) {
    int n = height.size();
    stack<int> st;
    int water = 0;

    for (int i = 0; i < n; i++) {
        while (!st.empty() && height[i] > height[st.top()]) {
            int bottom = st.top();
            st.pop();
            if (st.empty()) break;
            int width = i - st.top() - 1;
            int h = min(height[i], height[st.top()]) - height[bottom];
            water += width * h;
        }
        st.push(i);
    }

    return water;
}

int main() {
    vector<int> height = {0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1};
    cout << trap(height) << endl;  // 6
    return 0;
}
```

**Complexity Analysis**
- **Time:** O(N) — each index is pushed and popped from the stack at most once, so the total number of stack operations is at most 2N.
- **Space:** O(N) — in the worst case (strictly decreasing heights), all N indices are on the stack simultaneously.

---

### Problem 2: Find Median from Data Stream (Two Heaps)

**Problem Statement**

Design a data structure that supports:

- `void addNum(int num)` — Add an integer from the data stream.
- `double findMedian()` — Return the median of all elements added so far.

The median is the middle value in an ordered list. If the list size is even, the median is the average of the two middle values.

```
Input:
  addNum(1)
  addNum(2)
  findMedian()    // returns 1.5
  addNum(3)
  findMedian()    // returns 2.0
```

```
Input:
  addNum(6)
  findMedian()    // returns 6.0
  addNum(10)
  findMedian()    // returns 8.0
  addNum(2)
  findMedian()    // returns 6.0
```

**Approach**

Maintain two heaps:
1. A **max-heap** (`lo`) storing the smaller half of the numbers.
2. A **min-heap** (`hi`) storing the larger half.

Invariant: `lo.size()` is either equal to `hi.size()` or one greater. To add a number: push it to `lo`, then move `lo`'s top to `hi` (to maintain the partition property), then rebalance sizes. The median is `lo.top()` if sizes differ, or `(lo.top() + hi.top()) / 2.0` if sizes are equal.

**Pseudo-code**

```
class MedianFinder:
    lo: max-heap (lower half)
    hi: min-heap (upper half)

    addNum(num):
        lo.push(num)
        hi.push(lo.top())
        lo.pop()
        if hi.size() > lo.size():
            lo.push(hi.top())
            hi.pop()

    findMedian():
        if lo.size() > hi.size():
            return lo.top()
        return (lo.top() + hi.top()) / 2.0
```

**C++ Solution**

```cpp
#include <iostream>
#include <queue>
using namespace std;

class MedianFinder {
    priority_queue<int> lo;                                  // max-heap
    priority_queue<int, vector<int>, greater<int>> hi;       // min-heap

public:
    void addNum(int num) {
        lo.push(num);
        hi.push(lo.top());
        lo.pop();

        if (hi.size() > lo.size()) {
            lo.push(hi.top());
            hi.pop();
        }
    }

    double findMedian() {
        if (lo.size() > hi.size())
            return lo.top();
        return (lo.top() + hi.top()) / 2.0;
    }
};

int main() {
    MedianFinder mf;
    mf.addNum(1);
    mf.addNum(2);
    cout << mf.findMedian() << endl;  // 1.5
    mf.addNum(3);
    cout << mf.findMedian() << endl;  // 2
    mf.addNum(6);
    cout << mf.findMedian() << endl;  // 2.5
    mf.addNum(10);
    cout << mf.findMedian() << endl;  // 3
    mf.addNum(2);
    cout << mf.findMedian() << endl;  // 2.5
    return 0;
}
```

**Complexity Analysis**
- **Time:** O(log N) per `addNum` — each heap insertion/extraction is O(log N). `findMedian` is O(1) — it only reads the tops of the heaps.
- **Space:** O(N) — all N elements are stored across the two heaps.

---

### Problem 3: N-Queens (Advanced Backtracking)

**Problem Statement**

Place N queens on an N×N chessboard such that no two queens threaten each other. Two queens threaten each other if they share the same row, column, or diagonal. Return the total number of distinct solutions (or all board configurations).

```
Input:  N = 4
Output: 2
// Solution 1:        Solution 2:
// . Q . .            . . Q .
// . . . Q            Q . . .
// Q . . .            . . . Q
// . . Q .            . Q . .
```

```
Input:  N = 8
Output: 92
```

**Approach**

Place queens row by row. For each row, try each column. A column is valid if no previously placed queen is in the same column or on the same diagonal. Track occupied columns and diagonals using sets or boolean arrays:
- `cols[c]` — column `c` is occupied
- `diag1[r - c + N - 1]` — the `\` diagonal through (r, c)
- `diag2[r + c]` — the `/` diagonal through (r, c)

Pruning: skip any column where `cols[c]`, `diag1[r-c+N-1]`, or `diag2[r+c]` is set. This dramatically reduces the search space from N^N to a manageable number.

**Pseudo-code**

```
function solveNQueens(N):
    count = 0
    cols = array of false, size N
    diag1 = array of false, size 2N-1
    diag2 = array of false, size 2N-1

    function backtrack(row):
        if row == N:
            count += 1
            return
        for col from 0 to N-1:
            if cols[col] or diag1[row-col+N-1] or diag2[row+col]:
                continue
            cols[col] = diag1[row-col+N-1] = diag2[row+col] = true
            backtrack(row + 1)
            cols[col] = diag1[row-col+N-1] = diag2[row+col] = false

    backtrack(0)
    return count
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

class NQueensSolver {
    int n_;
    int count_;
    vector<bool> cols_, diag1_, diag2_;
    vector<vector<string>> solutions_;
    vector<int> queens_;

    void backtrack(int row) {
        if (row == n_) {
            count_++;
            vector<string> board(n_, string(n_, '.'));
            for (int r = 0; r < n_; r++)
                board[r][queens_[r]] = 'Q';
            solutions_.push_back(board);
            return;
        }
        for (int col = 0; col < n_; col++) {
            if (cols_[col] || diag1_[row - col + n_ - 1] || diag2_[row + col])
                continue;
            cols_[col] = diag1_[row - col + n_ - 1] = diag2_[row + col] = true;
            queens_[row] = col;
            backtrack(row + 1);
            cols_[col] = diag1_[row - col + n_ - 1] = diag2_[row + col] = false;
        }
    }

public:
    int solve(int n) {
        n_ = n;
        count_ = 0;
        cols_.assign(n, false);
        diag1_.assign(2 * n - 1, false);
        diag2_.assign(2 * n - 1, false);
        queens_.resize(n);
        solutions_.clear();
        backtrack(0);
        return count_;
    }

    const vector<vector<string>>& getSolutions() const {
        return solutions_;
    }
};

int main() {
    NQueensSolver solver;

    int n = 8;
    int count = solver.solve(n);
    cout << "N = " << n << ": " << count << " solutions" << endl;

    // Print solutions for N = 4
    solver.solve(4);
    for (const auto& board : solver.getSolutions()) {
        for (const auto& row : board)
            cout << row << endl;
        cout << endl;
    }

    return 0;
}
```

**Complexity Analysis**
- **Time:** O(N!) in the worst case — but pruning reduces this dramatically. At row 0 there are N choices, at row 1 at most N-2 (same column and two diagonals eliminated), and so on. For N = 8, only 15,720 nodes are explored (vs. 8^8 = 16 million without pruning).
- **Space:** O(N) — for the recursion stack (depth N), the column and diagonal arrays (O(N) each), and the queens placement array. Storing all solutions adds O(N² × S) where S is the number of solutions.

---

## Practice Resources

- [LeetCode — Trapping Rain Water (#42)](https://leetcode.com/problems/trapping-rain-water/)
- [LeetCode — Find Median from Data Stream (#295)](https://leetcode.com/problems/find-median-from-data-stream/)
- [LeetCode — N-Queens (#51)](https://leetcode.com/problems/n-queens/)
- [LeetCode — Sliding Window Maximum (#239)](https://leetcode.com/problems/sliding-window-maximum/)
- [Codeforces — Meet in the Middle Problems](https://codeforces.com/blog/entry/95571)

---

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation)
