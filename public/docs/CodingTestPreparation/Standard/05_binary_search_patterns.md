# Binary Search Patterns

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

Binary search is far more than just "find an element in a sorted array." It is a general technique for efficiently narrowing down a search space by half at each step, applicable to any problem where you can define a monotonic predicate — a condition that flips from false to true (or true to false) at some boundary point. Once you recognize this pattern, binary search becomes a tool for optimization problems, capacity planning, and even geometric problems.

The classic binary search runs in O(log n) time, making it one of the most efficient algorithms available. But its power is often underestimated. "Search on answer" (also called binary search on the result) applies binary search not to the input array but to the space of possible answers. Instead of asking "is this element in the array?", you ask "can we achieve this target value?" — and if the feasibility check is monotonic, binary search finds the optimal answer.

Getting binary search right is notoriously tricky. Off-by-one errors, choosing between `lo < hi` vs `lo <= hi`, and deciding when to use `mid` vs `mid + 1` vs `mid - 1` are common sources of bugs. This section establishes clear templates for each variant so you can apply them confidently under interview pressure.

## Key Concepts

### Standard Binary Search

The most basic form: find the index of a target in a sorted array, or return -1.

```cpp
int binarySearch(const std::vector<int>& arr, int target) {
    int lo = 0, hi = (int)arr.size() - 1;

    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2; // avoids overflow vs (lo+hi)/2
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }

    return -1;
}
```

Key details: `lo + (hi - lo) / 2` prevents integer overflow. The loop uses `lo <= hi` because the search space includes both endpoints.

### lower_bound and upper_bound

These STL functions find insertion points in sorted ranges:

- `lower_bound(val)` → iterator to first element **≥ val**
- `upper_bound(val)` → iterator to first element **> val**

```cpp
std::vector<int> v = {1, 2, 4, 4, 4, 6, 8};

auto lb = std::lower_bound(v.begin(), v.end(), 4); // points to index 2
auto ub = std::upper_bound(v.begin(), v.end(), 4); // points to index 5

int count_of_4 = ub - lb; // 3
```

Implementing lower_bound manually:

```cpp
int lowerBound(const std::vector<int>& arr, int target) {
    int lo = 0, hi = arr.size();
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}
```

Notice the difference: `lo < hi` (not `<=`), and `hi = mid` (not `mid - 1`). This template finds the first position where the predicate `arr[mid] >= target` is true.

### Search on Answer (Minimize/Maximize a Value)

When the problem asks "what is the minimum/maximum value X such that some condition holds?", and the condition is monotonic in X, apply binary search on the answer space.

Template for "find minimum X where condition is feasible":

```cpp
int lo = MIN_POSSIBLE_ANSWER;
int hi = MAX_POSSIBLE_ANSWER;

while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (isFeasible(mid))
        hi = mid;        // mid works, try smaller
    else
        lo = mid + 1;    // mid doesn't work, need larger
}
// lo == hi == answer
```

Template for "find maximum X where condition is feasible":

```cpp
int lo = MIN_POSSIBLE_ANSWER;
int hi = MAX_POSSIBLE_ANSWER;

while (lo < hi) {
    int mid = lo + (hi - lo + 1) / 2; // round up to avoid infinite loop
    if (isFeasible(mid))
        lo = mid;        // mid works, try larger
    else
        hi = mid - 1;    // mid doesn't work, need smaller
}
```

### Binary Search on Rotated Arrays

A rotated sorted array like `[4,5,6,7,0,1,2]` has two sorted halves. At each step, determine which half is sorted, then check if the target lies within that sorted half.

### Binary Search on Matrix

For an m × n matrix where rows and columns are sorted, you can treat it as a 1D sorted array of size `m * n`. Map index `mid` to `matrix[mid / n][mid % n]`.

### Floating-Point Binary Search

When the answer is a real number, use a fixed number of iterations (e.g., 100) instead of checking `lo < hi`, because floating-point comparison can cause infinite loops.

```cpp
double lo = 0.0, hi = 1e9;
for (int iter = 0; iter < 100; ++iter) {
    double mid = (lo + hi) / 2.0;
    if (isFeasible(mid)) hi = mid;
    else lo = mid;
}
// lo ≈ hi ≈ answer
```

## Common Patterns

### Predicate-Based Binary Search
Frame the problem as finding the boundary where a predicate flips. This unifies all binary search variants into one mental model.

### Binary Search + Greedy Feasibility Check
For "search on answer" problems, the feasibility check is often a greedy simulation (e.g., "can we split the array into k subarrays each with sum ≤ mid?").

### Bisect on Sorted Ranges
Use `lower_bound`/`upper_bound` to count elements in ranges, find closest elements, or implement order statistics.

### Rotated Array Template
Identify the sorted half, check if the target is in that half, and narrow accordingly. This pattern handles both finding elements and finding the minimum.

---

## Practice Problems

### Problem 1: Search in Rotated Sorted Array

**Problem Statement**

Given an integer array `nums` sorted in ascending order and then rotated at some unknown pivot, and an integer `target`, return the index of `target` in `nums`, or `-1` if it is not present. The algorithm must run in O(log n) time.

Input: `nums = [4,5,6,7,0,1,2]`, `target = 0`
Output: `4`

Input: `nums = [4,5,6,7,0,1,2]`, `target = 3`
Output: `-1`

**Approach**

At each step of binary search, at least one of the two halves (`[lo..mid]` or `[mid..hi]`) is sorted. Check which half is sorted by comparing `nums[lo]` with `nums[mid]`. If the sorted half contains the target (by range check), search there. Otherwise, search the other half.

Why this works: the rotation breaks the array into two sorted subarrays. At each `mid`, one half is guaranteed to be fully sorted, which gives us enough information to decide which half to explore.

**Pseudo-code**

```
function search(nums, target):
    lo = 0, hi = nums.size - 1

    while lo <= hi:
        mid = lo + (hi - lo) / 2
        if nums[mid] == target: return mid

        if nums[lo] <= nums[mid]:   // left half is sorted
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:                        // right half is sorted
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1

    return -1
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>

int search(std::vector<int>& nums, int target) {
    int lo = 0, hi = (int)nums.size() - 1;

    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;

        if (nums[lo] <= nums[mid]) {
            if (nums[lo] <= target && target < nums[mid])
                hi = mid - 1;
            else
                lo = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[hi])
                lo = mid + 1;
            else
                hi = mid - 1;
        }
    }

    return -1;
}

int main() {
    std::vector<int> nums = {4, 5, 6, 7, 0, 1, 2};
    std::cout << search(nums, 0) << std::endl;  // 4
    std::cout << search(nums, 3) << std::endl;  // -1
    return 0;
}
```

**Complexity Analysis**

- **Time:** O(log n) — the search space halves each iteration
- **Space:** O(1)

---

### Problem 2: Find Minimum in Rotated Sorted Array

**Problem Statement**

Given a sorted array of unique integers that has been rotated between 1 and n times, find the minimum element. The algorithm must run in O(log n) time.

Input: `nums = [3,4,5,1,2]`
Output: `1`

Input: `nums = [4,5,6,7,0,1,2]`
Output: `0`

Input: `nums = [11,13,15,17]`
Output: `11` (no rotation, or rotated n times)

**Approach**

The minimum is the point where the rotation "breaks" the sorted order. Compare `nums[mid]` with `nums[hi]`:
- If `nums[mid] > nums[hi]`, the minimum is in the right half (the break point is to the right).
- Otherwise, the minimum is in the left half (including `mid`).

We compare with `nums[hi]` rather than `nums[lo]` because comparing with `lo` doesn't correctly handle the case where the subarray is already fully sorted.

**Pseudo-code**

```
function findMin(nums):
    lo = 0, hi = nums.size - 1

    while lo < hi:
        mid = lo + (hi - lo) / 2
        if nums[mid] > nums[hi]:
            lo = mid + 1    // min is in right half
        else:
            hi = mid         // min is mid or to the left

    return nums[lo]
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>

int findMin(std::vector<int>& nums) {
    int lo = 0, hi = (int)nums.size() - 1;

    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] > nums[hi])
            lo = mid + 1;
        else
            hi = mid;
    }

    return nums[lo];
}

int main() {
    std::vector<int> nums1 = {3, 4, 5, 1, 2};
    std::cout << findMin(nums1) << std::endl;  // 1

    std::vector<int> nums2 = {4, 5, 6, 7, 0, 1, 2};
    std::cout << findMin(nums2) << std::endl;  // 0

    std::vector<int> nums3 = {11, 13, 15, 17};
    std::cout << findMin(nums3) << std::endl;  // 11
    return 0;
}
```

**Complexity Analysis**

- **Time:** O(log n)
- **Space:** O(1)

---

### Problem 3: Koko Eating Bananas (Search on Answer)

**Problem Statement**

Koko loves bananas. There are `n` piles of bananas, the ith pile has `piles[i]` bananas. Guards will return in `h` hours. Koko can choose an eating speed `k` (bananas per hour). Each hour, she chooses a pile and eats `k` bananas from it. If the pile has fewer than `k` bananas, she eats the whole pile and won't eat any more during that hour. Return the minimum integer `k` such that she can eat all bananas within `h` hours.

Input: `piles = [3,6,7,11]`, `h = 8`
Output: `4`

Input: `piles = [30,11,23,4,20]`, `h = 5`
Output: `30`

Input: `piles = [30,11,23,4,20]`, `h = 6`
Output: `23`

**Approach**

Binary search on the answer space. The minimum speed is 1, the maximum speed is `max(piles)` (eating the largest pile in one hour). For each candidate speed `mid`, calculate the total hours needed (sum of `ceil(pile / mid)` for each pile). If hours ≤ h, the speed is feasible — try smaller. Otherwise, try larger.

The feasibility predicate is monotonic: if speed `k` works, any speed `k' > k` also works. This is exactly the property that makes binary search applicable.

**Pseudo-code**

```
function minEatingSpeed(piles, h):
    lo = 1
    hi = max(piles)

    while lo < hi:
        mid = lo + (hi - lo) / 2
        if canFinish(piles, mid, h):
            hi = mid         // feasible, try smaller speed
        else:
            lo = mid + 1     // not feasible, need faster

    return lo

function canFinish(piles, speed, h):
    hours = 0
    for each pile in piles:
        hours += ceil(pile / speed)
    return hours <= h
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

bool canFinish(const std::vector<int>& piles, int speed, int h) {
    long long hours = 0;
    for (int pile : piles) {
        hours += (pile + speed - 1) / speed; // ceil division
    }
    return hours <= h;
}

int minEatingSpeed(std::vector<int>& piles, int h) {
    int lo = 1;
    int hi = *std::max_element(piles.begin(), piles.end());

    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (canFinish(piles, mid, h))
            hi = mid;
        else
            lo = mid + 1;
    }

    return lo;
}

int main() {
    std::vector<int> p1 = {3, 6, 7, 11};
    std::cout << minEatingSpeed(p1, 8) << std::endl;   // 4

    std::vector<int> p2 = {30, 11, 23, 4, 20};
    std::cout << minEatingSpeed(p2, 5) << std::endl;    // 30

    std::vector<int> p3 = {30, 11, 23, 4, 20};
    std::cout << minEatingSpeed(p3, 6) << std::endl;    // 23
    return 0;
}
```

**Complexity Analysis**

- **Time:** O(n log m) where n is the number of piles and m is the maximum pile size. Binary search runs O(log m) iterations, each checking feasibility in O(n).
- **Space:** O(1)

---

## Practice Resources

- [Search in Rotated Sorted Array — LeetCode #33](https://leetcode.com/problems/search-in-rotated-sorted-array/)
- [Find Minimum in Rotated Sorted Array — LeetCode #153](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/)
- [Koko Eating Bananas — LeetCode #875](https://leetcode.com/problems/koko-eating-bananas/)
- [Binary Search Tutorial — GeeksforGeeks](https://www.geeksforgeeks.org/binary-search/)
- [Binary Search Patterns — LeetCode Explore](https://leetcode.com/explore/learn/card/binary-search/)

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: Two Pointers →](/docs/CodingTestPreparation/Standard/06_two_pointers)
