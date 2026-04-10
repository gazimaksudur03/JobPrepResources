# Medium Interview Problem Patterns

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

As you move beyond single-concept problems, real coding interviews begin to combine multiple ideas into medium-difficulty questions. This section covers five pattern families that appear repeatedly at this level: **prefix sums** (fast subarray queries), **interval problems** (merge, insert, overlap detection), **matrix traversal** (spiral and diagonal patterns), **backtracking** (generating permutations, combinations, and subsets), and **bit manipulation** (compact state representation and clever tricks).

These patterns rarely appear in isolation — a single interview question might combine prefix sums with hashing, or intervals with greedy sorting. The goal of this section is to internalize each pattern so deeply that you can recognize and deploy it within the first few minutes of reading a problem. Many medium-level problems are straightforward once you identify the right pattern, but nearly impossible if you try to solve them from scratch.

Each pattern has a characteristic "shape" to watch for: prefix sums for subarray sum queries, interval merging whenever you see start/end pairs, backtracking whenever the problem asks you to "generate all" or "find all valid configurations," and bit manipulation when the problem involves power-of-two constraints or subset enumeration with small state spaces.

## Key Concepts

### Prefix Sums

A prefix sum array `prefix[i]` stores the sum of elements from index `0` to `i-1`. This lets you compute the sum of any subarray `[l, r]` in O(1): `sum(l, r) = prefix[r+1] - prefix[l]`.

```cpp
// Build prefix sum
std::vector<int> prefix(n + 1, 0);
for (int i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
}

// Query sum of nums[l..r]
int subarraySum = prefix[r + 1] - prefix[l];
```

**When to use:** Any problem asking about subarray sums, range sums, or cumulative totals. Often combined with a hash map to answer "how many subarrays sum to k?"

### Interval Problems

Interval problems involve a collection of `[start, end]` pairs. The core operations are:

**Merge Overlapping Intervals:**
1. Sort by start time
2. Iterate: if current interval overlaps the last merged interval, extend the end; otherwise, start a new group

```cpp
std::sort(intervals.begin(), intervals.end());
std::vector<std::vector<int>> merged;
for (auto& iv : intervals) {
    if (!merged.empty() && iv[0] <= merged.back()[1]) {
        merged.back()[1] = std::max(merged.back()[1], iv[1]);
    } else {
        merged.push_back(iv);
    }
}
```

**Insert Interval:** Find the position where the new interval sits, merge with any overlapping intervals, and concatenate the three segments (before, merged, after).

### Matrix Traversal Patterns

**Spiral Order:** Use four boundaries (top, bottom, left, right) and traverse in order: right across top row, down right column, left across bottom row, up left column. Shrink boundaries after each pass.

**Diagonal Traversal:** Elements on the same diagonal satisfy `i + j = constant` (for "/" diagonals) or `i - j = constant` (for "\\" diagonals).

```cpp
// Spiral order traversal
std::vector<int> spiralOrder(std::vector<std::vector<int>>& matrix) {
    std::vector<int> result;
    int top = 0, bottom = matrix.size() - 1;
    int left = 0, right = matrix[0].size() - 1;
    while (top <= bottom && left <= right) {
        for (int c = left; c <= right; c++) result.push_back(matrix[top][c]);
        top++;
        for (int r = top; r <= bottom; r++) result.push_back(matrix[r][right]);
        right--;
        if (top <= bottom) {
            for (int c = right; c >= left; c--) result.push_back(matrix[bottom][c]);
            bottom--;
        }
        if (left <= right) {
            for (int r = bottom; r >= top; r--) result.push_back(matrix[r][left]);
            left++;
        }
    }
    return result;
}
```

### Backtracking Basics

Backtracking is a systematic way to explore all possible configurations by building a solution incrementally and abandoning a branch ("backtracking") as soon as it cannot lead to a valid solution.

**Template:**

```cpp
void backtrack(std::vector<int>& current, /* state parameters */) {
    if (/* base case: solution is complete */) {
        result.push_back(current);
        return;
    }
    for (/* each candidate choice */) {
        if (/* choice is valid */) {
            current.push_back(choice);       // make choice
            backtrack(current, /* updated state */);
            current.pop_back();              // undo choice (backtrack)
        }
    }
}
```

**Permutations:** At each position, try every unused element.
**Combinations:** At each step, choose an element at or after the current index (prevents duplicates and respects order).
**Subsets:** For each element, decide to include it or not.

### Bit Manipulation Basics

Bitwise operations provide compact, fast ways to work with sets, flags, and binary representations:

```cpp
x & y       // AND: bits set in both
x | y       // OR: bits set in either
x ^ y       // XOR: bits set in exactly one
~x          // NOT: flip all bits
x << k      // left shift: multiply by 2^k
x >> k      // right shift: divide by 2^k

// Common tricks:
x & (x - 1)         // clear the lowest set bit
x & (-x)            // isolate the lowest set bit
__builtin_popcount(x)  // count set bits (GCC/Clang)

// Check if i-th bit is set:
bool isSet = (x >> i) & 1;

// Set i-th bit:
x |= (1 << i);

// Clear i-th bit:
x &= ~(1 << i);
```

**Subset enumeration with bitmasks:** For a set of `n` elements, iterate through all 2ⁿ subsets:

```cpp
for (int mask = 0; mask < (1 << n); mask++) {
    for (int i = 0; i < n; i++) {
        if (mask & (1 << i)) {
            // element i is in this subset
        }
    }
}
```

## Common Patterns

1. **Prefix Sum + Hash Map:** To count subarrays with sum = k, store prefix sum frequencies in a hash map. At each index, check how many previous prefix sums equal `current_prefix - k`.

2. **Sort + Merge for Intervals:** Most interval problems start with sorting by start time. After sorting, a single pass handles merging, counting overlaps, or inserting.

3. **Boundary-Shrinking for Matrix:** Spiral and layer-by-layer matrix problems use four boundary variables that shrink inward. This avoids complex index math.

4. **Backtracking with Pruning:** Add early termination conditions to avoid exploring invalid branches. For example, in combination sum, skip candidates that exceed the remaining target.

5. **Backtracking Duplicate Handling:** Sort the input array, then skip consecutive duplicates at the same recursion level: `if (i > start && nums[i] == nums[i-1]) continue;`

6. **XOR Properties:** `a ^ a = 0` and `a ^ 0 = a`. XOR all elements to find the single unique element, or to cancel out pairs.

---

## Practice Problems

### Problem 1: Subarray Sum Equals K

**Problem Statement**

Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals `k`. A subarray is a contiguous non-empty sequence of elements within the array.

```
Input:  nums = [1, 1, 1], k = 2
Output: 2
Explanation: Subarrays [1,1] starting at index 0 and [1,1] starting at index 1.

Input:  nums = [1, 2, 3], k = 3
Output: 2
Explanation: Subarrays [1,2] and [3].

Input:  nums = [1, -1, 0], k = 0
Output: 3
```

**Approach**

Compute a running prefix sum. At each index, the number of subarrays ending here with sum `k` equals the number of previous prefix sums that equal `current_prefix - k`. Use a hash map to store the frequency of each prefix sum seen so far. Initialize with `{0: 1}` to handle subarrays starting from index 0.

This works because if `prefix[j] - prefix[i] = k`, then the subarray from `i+1` to `j` has sum `k`. By counting how many previous `prefix[i]` equal `prefix[j] - k`, we count all valid starting points.

**Pseudo-code**

```
function subarraySum(nums, k):
    count = 0
    prefixSum = 0
    prefixFreq = {0: 1}
    for each num in nums:
        prefixSum += num
        count += prefixFreq[prefixSum - k]   // 0 if not present
        prefixFreq[prefixSum] += 1
    return count
```

**C++ Solution**

```cpp
#include <vector>
#include <unordered_map>

int subarraySum(std::vector<int>& nums, int k) {
    std::unordered_map<int, int> prefixFreq;
    prefixFreq[0] = 1;
    int prefixSum = 0, count = 0;

    for (int num : nums) {
        prefixSum += num;
        auto it = prefixFreq.find(prefixSum - k);
        if (it != prefixFreq.end()) {
            count += it->second;
        }
        prefixFreq[prefixSum]++;
    }
    return count;
}
```

**Complexity Analysis**

- **Time:** O(n) — single pass with O(1) hash map operations per element.
- **Space:** O(n) — hash map stores at most n + 1 distinct prefix sums.

---

### Problem 2: Merge Intervals

**Problem Statement**

Given an array of intervals where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.

```
Input:  intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: [1,3] and [2,6] overlap, so they merge into [1,6].

Input:  intervals = [[1,4],[4,5]]
Output: [[1,5]]
Explanation: [1,4] and [4,5] are considered overlapping (share endpoint 4).
```

**Approach**

Sort intervals by their start time. Initialize the merged list with the first interval. For each subsequent interval, if it overlaps with the last interval in the merged list (its start ≤ the last interval's end), extend the end of the last merged interval to cover both. Otherwise, append it as a new non-overlapping interval. Sorting ensures we only need to compare with the most recently added interval.

**Pseudo-code**

```
function merge(intervals):
    sort intervals by start time
    merged = [intervals[0]]
    for i = 1 to intervals.length - 1:
        if intervals[i].start <= merged.last.end:
            merged.last.end = max(merged.last.end, intervals[i].end)
        else:
            merged.append(intervals[i])
    return merged
```

**C++ Solution**

```cpp
#include <vector>
#include <algorithm>

std::vector<std::vector<int>> merge(std::vector<std::vector<int>>& intervals) {
    std::sort(intervals.begin(), intervals.end());
    std::vector<std::vector<int>> merged;
    merged.push_back(intervals[0]);

    for (int i = 1; i < (int)intervals.size(); i++) {
        if (intervals[i][0] <= merged.back()[1]) {
            merged.back()[1] = std::max(merged.back()[1], intervals[i][1]);
        } else {
            merged.push_back(intervals[i]);
        }
    }
    return merged;
}
```

**Complexity Analysis**

- **Time:** O(n log n) — sorting dominates. The merge pass is O(n).
- **Space:** O(n) — for the output array (or O(log n) for the sort's stack space if output is excluded).

---

### Problem 3: Generate All Permutations

**Problem Statement**

Given an array `nums` of distinct integers, return all possible permutations in any order.

```
Input:  nums = [1, 2, 3]
Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]

Input:  nums = [0, 1]
Output: [[0,1],[1,0]]

Input:  nums = [1]
Output: [[1]]
```

**Approach**

Use backtracking. Maintain a boolean array tracking which elements have been used. At each position in the permutation, try every unused element: mark it as used, add it to the current permutation, recurse to fill the next position, then unmark and remove it (backtrack). When the current permutation reaches length `n`, add it to the results.

An alternative approach swaps elements in-place: at position `i`, swap `nums[i]` with each `nums[j]` where `j >= i`, recurse for position `i+1`, then swap back. This avoids the boolean array but modifies the input.

**Pseudo-code**

```
function permute(nums):
    result = []
    backtrack(nums, [], used = [false]*n, result)
    return result

function backtrack(nums, current, used, result):
    if current.length == nums.length:
        result.append(copy of current)
        return
    for i = 0 to nums.length - 1:
        if not used[i]:
            used[i] = true
            current.append(nums[i])
            backtrack(nums, current, used, result)
            current.pop()
            used[i] = false
```

**C++ Solution**

```cpp
#include <vector>

class Solution {
    std::vector<std::vector<int>> result;

    void backtrack(std::vector<int>& nums, std::vector<int>& current,
                   std::vector<bool>& used) {
        if (current.size() == nums.size()) {
            result.push_back(current);
            return;
        }
        for (int i = 0; i < (int)nums.size(); i++) {
            if (used[i]) continue;
            used[i] = true;
            current.push_back(nums[i]);
            backtrack(nums, current, used);
            current.pop_back();
            used[i] = false;
        }
    }

public:
    std::vector<std::vector<int>> permute(std::vector<int>& nums) {
        result.clear();
        std::vector<int> current;
        std::vector<bool> used(nums.size(), false);
        backtrack(nums, current, used);
        return result;
    }
};
```

**Complexity Analysis**

- **Time:** O(n! × n) — there are n! permutations, and copying each one takes O(n).
- **Space:** O(n) for the recursion stack and the `used` array (excluding the output). The output itself takes O(n! × n).

---

## Practice Resources

- [LeetCode 560 — Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/) — Prefix sum + hash map
- [LeetCode 56 — Merge Intervals](https://leetcode.com/problems/merge-intervals/) — Classic interval merging
- [LeetCode 46 — Permutations](https://leetcode.com/problems/permutations/) — Backtracking fundamentals
- [LeetCode 78 — Subsets](https://leetcode.com/problems/subsets/) — Backtracking / bitmask enumeration
- [LeetCode 54 — Spiral Matrix](https://leetcode.com/problems/spiral-matrix/) — Matrix traversal pattern

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [→ Continue to Advanced Stage](/docs/CodingTestPreparation/Advanced/01_modern_advanced_cpp)
