# Basic Searching and Sorting

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

Searching and sorting are the most fundamental algorithmic operations. Almost every coding interview involves sorting data to enable efficient access or searching for specific elements under constraints. Understanding the mechanics, trade-offs, and complexity of each algorithm will let you pick the right tool instantly during an interview.

**Searching** means finding a target element (or proving it does not exist). Linear search is the naive O(n) approach; binary search exploits sorted data to achieve O(log n). **Sorting** means arranging elements in a defined order. Simple sorts (bubble, selection, insertion) run in O(n²) and are easy to implement. Efficient sorts (merge sort, quicksort) run in O(n log n) and are what you should use in practice. Counting sort achieves O(n + k) for small integer ranges.

Knowing *when* to use which algorithm is as important as knowing *how* to implement it. Binary search requires sorted data. Merge sort is stable and predictable (always O(n log n)). Quicksort is fast in practice but O(n²) in the worst case. Insertion sort excels on nearly-sorted data. Counting sort works only with bounded non-negative integers.

## Key Concepts

### Linear Search

Check every element sequentially until the target is found or the array ends.

```cpp
int linearSearch(const std::vector<int>& arr, int target) {
    for (int i = 0; i < (int)arr.size(); i++)
        if (arr[i] == target)
            return i;
    return -1;
}
// Time: O(n), Space: O(1)
```

### Binary Search — Iterative

Repeatedly halve the search space. Requires a **sorted** array.

```cpp
int binarySearch(const std::vector<int>& arr, int target) {
    int lo = 0, hi = (int)arr.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;  // avoids overflow
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}
// Time: O(log n), Space: O(1)
```

### Binary Search — Recursive

```cpp
int binarySearchRec(const std::vector<int>& arr, int target, int lo, int hi) {
    if (lo > hi) return -1;
    int mid = lo + (hi - lo) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) return binarySearchRec(arr, target, mid + 1, hi);
    return binarySearchRec(arr, target, lo, mid - 1);
}
// Time: O(log n), Space: O(log n) due to call stack
```

### Bubble Sort

Repeatedly swap adjacent elements that are out of order. Optimized variant exits early if no swaps occur.

```cpp
void bubbleSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break; // already sorted
    }
}
// Best: O(n) (already sorted), Worst: O(n²), Stable: Yes
```

### Selection Sort

Find the minimum of the unsorted portion and swap it into position.

```cpp
void selectionSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++)
            if (arr[j] < arr[minIdx])
                minIdx = j;
        std::swap(arr[i], arr[minIdx]);
    }
}
// Time: O(n²) always, Stable: No
```

### Insertion Sort

Insert each element into its correct position in the sorted portion built so far.

```cpp
void insertionSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}
// Best: O(n) (nearly sorted), Worst: O(n²), Stable: Yes
```

### Merge Sort

Divide the array in half, recursively sort each half, then merge the two sorted halves.

```cpp
void merge(std::vector<int>& arr, int left, int mid, int right) {
    std::vector<int> L(arr.begin() + left, arr.begin() + mid + 1);
    std::vector<int> R(arr.begin() + mid + 1, arr.begin() + right + 1);

    int i = 0, j = 0, k = left;
    while (i < (int)L.size() && j < (int)R.size()) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < (int)L.size()) arr[k++] = L[i++];
    while (j < (int)R.size()) arr[k++] = R[j++];
}

void mergeSort(std::vector<int>& arr, int left, int right) {
    if (left >= right) return;
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}
// Time: O(n log n) always, Space: O(n), Stable: Yes
```

### Quicksort

Choose a pivot, partition elements around it (smaller left, larger right), then recurse on each partition.

```cpp
int partition(std::vector<int>& arr, int lo, int hi) {
    int pivot = arr[hi];
    int i = lo - 1;
    for (int j = lo; j < hi; j++) {
        if (arr[j] <= pivot) {
            i++;
            std::swap(arr[i], arr[j]);
        }
    }
    std::swap(arr[i + 1], arr[hi]);
    return i + 1;
}

void quickSort(std::vector<int>& arr, int lo, int hi) {
    if (lo >= hi) return;
    int p = partition(arr, lo, hi);
    quickSort(arr, lo, p - 1);
    quickSort(arr, p + 1, hi);
}
// Best/Average: O(n log n), Worst: O(n²) (bad pivot), Space: O(log n) stack, Stable: No
```

### Counting Sort

Counts occurrences of each value. Works when the range of values k is not too large.

```cpp
void countingSort(std::vector<int>& arr) {
    if (arr.empty()) return;
    int maxVal = *std::max_element(arr.begin(), arr.end());
    std::vector<int> count(maxVal + 1, 0);

    for (int x : arr) count[x]++;

    int idx = 0;
    for (int val = 0; val <= maxVal; val++)
        while (count[val]-- > 0)
            arr[idx++] = val;
}
// Time: O(n + k), Space: O(k), Stable: Yes (with modification)
```

### Stability

A sort is **stable** if equal elements retain their original relative order. Stability matters when sorting by multiple keys.

| Algorithm | Stable? | Time (Best) | Time (Worst) | Space |
|-----------|:-------:|:-----------:|:------------:|:-----:|
| Bubble    | Yes | O(n) | O(n²) | O(1) |
| Selection | No  | O(n²) | O(n²) | O(1) |
| Insertion | Yes | O(n) | O(n²) | O(1) |
| Merge     | Yes | O(n log n) | O(n log n) | O(n) |
| Quick     | No  | O(n log n) | O(n²) | O(log n) |
| Counting  | Yes | O(n + k) | O(n + k) | O(k) |

### When to Use Which

- **Default:** Use `std::sort` (introsort, O(n log n) guaranteed).
- **Need stability:** Use `std::stable_sort` or merge sort.
- **Nearly sorted data:** Insertion sort is very fast (O(n) best case).
- **Small integer range:** Counting sort can beat comparison-based sorts.
- **Implement from scratch in interview:** Merge sort is the safest — always O(n log n) and straightforward to code.

## Common Patterns

### Pattern 1 — Sort Then Binary Search

Many problems become trivial once data is sorted. Sort first in O(n log n), then answer queries in O(log n) each.

### Pattern 2 — Binary Search on Answer

Instead of searching for an element, binary search on the *answer space*. "Is answer = X feasible?" becomes the predicate. This pattern appears in optimization problems.

### Pattern 3 — Lower Bound / Upper Bound

Use `std::lower_bound` (first element ≥ target) and `std::upper_bound` (first element > target) for range counting and first/last occurrence problems.

### Pattern 4 — Partitioning

Quicksort's partition step is useful independently: rearranging elements around a pivot appears in Dutch national flag, k-th smallest element, and three-way partitioning problems.

---

## Practice Problems

### Problem 1: Binary Search in a Sorted Array

**Problem Statement**

Given a sorted array of integers and a target value, return the index of the target. If the target is not found, return -1.

```
Input:  arr = [1, 3, 5, 7, 9, 11], target = 7
Output: 3

Input:  arr = [1, 3, 5, 7, 9, 11], target = 6
Output: -1
```

**Approach**

Classic binary search. Maintain `lo` and `hi` pointers. Compute `mid` and compare. Narrow the search space by half each iteration.

**Pseudo-code**

```
function binarySearch(arr, target):
    lo = 0, hi = arr.size - 1
    while lo <= hi:
        mid = lo + (hi - lo) / 2
        if arr[mid] == target: return mid
        if arr[mid] < target: lo = mid + 1
        else: hi = mid - 1
    return -1
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>

int binarySearch(const std::vector<int>& arr, int target) {
    int lo = 0, hi = (int)arr.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}

int main() {
    std::vector<int> arr = {1, 3, 5, 7, 9, 11};

    std::cout << binarySearch(arr, 7) << "\n";  // 3
    std::cout << binarySearch(arr, 6) << "\n";  // -1
    std::cout << binarySearch(arr, 1) << "\n";  // 0
    std::cout << binarySearch(arr, 11) << "\n"; // 5

    return 0;
}
```

**Complexity Analysis**

- **Time:** O(log n) — the search space halves each iteration.
- **Space:** O(1) — only a few integer variables.

---

### Problem 2: Merge Sort Implementation

**Problem Statement**

Implement merge sort to sort an array of integers in ascending order. Print the array after sorting.

```
Input:  [38, 27, 43, 3, 9, 82, 10]
Output: [3, 9, 10, 27, 38, 43, 82]
```

**Approach**

Recursively divide the array into halves until each sub-array has one element (base case). Then merge adjacent sorted sub-arrays by comparing elements from each and placing the smaller one first.

**Pseudo-code**

```
function mergeSort(arr, left, right):
    if left >= right: return
    mid = (left + right) / 2
    mergeSort(arr, left, mid)
    mergeSort(arr, mid + 1, right)
    merge(arr, left, mid, right)

function merge(arr, left, mid, right):
    L = arr[left..mid]
    R = arr[mid+1..right]
    i = j = 0, k = left
    while i < |L| and j < |R|:
        if L[i] <= R[j]: arr[k++] = L[i++]
        else: arr[k++] = R[j++]
    copy remaining L or R into arr
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>

void merge(std::vector<int>& arr, int left, int mid, int right) {
    std::vector<int> L(arr.begin() + left, arr.begin() + mid + 1);
    std::vector<int> R(arr.begin() + mid + 1, arr.begin() + right + 1);

    int i = 0, j = 0, k = left;
    while (i < (int)L.size() && j < (int)R.size()) {
        if (L[i] <= R[j])
            arr[k++] = L[i++];
        else
            arr[k++] = R[j++];
    }
    while (i < (int)L.size()) arr[k++] = L[i++];
    while (j < (int)R.size()) arr[k++] = R[j++];
}

void mergeSort(std::vector<int>& arr, int left, int right) {
    if (left >= right) return;
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}

int main() {
    std::vector<int> arr = {38, 27, 43, 3, 9, 82, 10};

    std::cout << "Before: ";
    for (int x : arr) std::cout << x << " ";
    std::cout << "\n";

    mergeSort(arr, 0, arr.size() - 1);

    std::cout << "After:  ";
    for (int x : arr) std::cout << x << " ";
    std::cout << "\n";
    // 3 9 10 27 38 43 82

    return 0;
}
```

**Complexity Analysis**

- **Time:** O(n log n) in all cases — log n levels of recursion, O(n) merge work per level.
- **Space:** O(n) — temporary arrays used during merging.

---

### Problem 3: Find First and Last Occurrence of an Element

**Problem Statement**

Given a sorted array of integers and a target, find the starting and ending index of the target. If the target is not found, return `[-1, -1]`.

```
Input:  arr = [5, 7, 7, 8, 8, 8, 10], target = 8
Output: [3, 5]

Input:  arr = [5, 7, 7, 8, 8, 8, 10], target = 6
Output: [-1, -1]
```

**Approach**

Run binary search twice:
1. **Find first occurrence:** When `arr[mid] == target`, don't return immediately; instead set `hi = mid - 1` to keep searching left.
2. **Find last occurrence:** When `arr[mid] == target`, set `lo = mid + 1` to keep searching right.

Each search is O(log n).

**Pseudo-code**

```
function findFirst(arr, target):
    lo = 0, hi = n - 1, result = -1
    while lo <= hi:
        mid = (lo + hi) / 2
        if arr[mid] == target:
            result = mid
            hi = mid - 1
        else if arr[mid] < target: lo = mid + 1
        else: hi = mid - 1
    return result

function findLast(arr, target):
    lo = 0, hi = n - 1, result = -1
    while lo <= hi:
        mid = (lo + hi) / 2
        if arr[mid] == target:
            result = mid
            lo = mid + 1
        else if arr[mid] < target: lo = mid + 1
        else: hi = mid - 1
    return result
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>

int findFirst(const std::vector<int>& arr, int target) {
    int lo = 0, hi = (int)arr.size() - 1, result = -1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] == target) {
            result = mid;
            hi = mid - 1;
        } else if (arr[mid] < target) {
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    return result;
}

int findLast(const std::vector<int>& arr, int target) {
    int lo = 0, hi = (int)arr.size() - 1, result = -1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] == target) {
            result = mid;
            lo = mid + 1;
        } else if (arr[mid] < target) {
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    return result;
}

std::pair<int, int> searchRange(const std::vector<int>& arr, int target) {
    return {findFirst(arr, target), findLast(arr, target)};
}

int main() {
    std::vector<int> arr = {5, 7, 7, 8, 8, 8, 10};

    auto [first1, last1] = searchRange(arr, 8);
    std::cout << "[" << first1 << ", " << last1 << "]\n"; // [3, 5]

    auto [first2, last2] = searchRange(arr, 6);
    std::cout << "[" << first2 << ", " << last2 << "]\n"; // [-1, -1]

    auto [first3, last3] = searchRange(arr, 7);
    std::cout << "[" << first3 << ", " << last3 << "]\n"; // [1, 2]

    return 0;
}
```

**Complexity Analysis**

- **Time:** O(log n) — two binary searches, each O(log n).
- **Space:** O(1) — only integer variables.

---

## Practice Resources

- [LeetCode — Binary Search](https://leetcode.com/problems/binary-search/)
- [LeetCode — Sort an Array](https://leetcode.com/problems/sort-an-array/)
- [LeetCode — Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)
- [GeeksforGeeks — Sorting Algorithms](https://www.geeksforgeeks.org/sorting-algorithms/)
- [Visualgo — Sorting Visualizations](https://visualgo.net/en/sorting)

---

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: Math and Implementation →](/docs/CodingTestPreparation/Basic/12_math_and_implementation)
