# Complexity Basics (Big-O)

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

Every coding interview ends with the same question: *"What's the time and space complexity?"* Big-O notation is the mathematical language used to describe how an algorithm's resource usage grows as the input size increases. Understanding it is non-negotiable — it determines whether your solution is accepted or times out on large inputs.

Big-O focuses on the **dominant term** as input size n approaches infinity. Constants and lower-order terms are dropped: O(3n² + 5n + 100) simplifies to O(n²). This gives a clean, hardware-independent way to compare algorithms. An O(n log n) sort will always beat an O(n²) sort for sufficiently large n, regardless of the machine.

There are three cases to consider for any algorithm: **best case** (most favorable input), **average case** (expected behavior over random inputs), and **worst case** (most unfavorable input). Interviews almost always ask for **worst-case** complexity unless stated otherwise. Space complexity measures additional memory your algorithm uses beyond the input itself.

## Key Concepts

### Common Complexity Classes

| Complexity | Name | Example |
|-----------|------|---------|
| O(1) | Constant | Array access, hash map lookup |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | Single loop through array |
| O(n log n) | Linearithmic | Merge sort, efficient sorting |
| O(n²) | Quadratic | Nested loops (brute force) |
| O(2ⁿ) | Exponential | Recursive subsets, brute force backtracking |
| O(n!) | Factorial | Generating all permutations |

### Growth Rate Comparison

For n = 1,000:

| Complexity | Operations (approx.) |
|-----------|---------------------|
| O(1) | 1 |
| O(log n) | 10 |
| O(n) | 1,000 |
| O(n log n) | 10,000 |
| O(n²) | 1,000,000 |
| O(2ⁿ) | 10³⁰⁰ (impossible) |

### Analyzing Loops

**Single loop → O(n)**

```cpp
for (int i = 0; i < n; i++) {
    // O(1) work
}
// Total: O(n)
```

**Nested loops → O(n²)**

```cpp
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        // O(1) work
    }
}
// Total: O(n²)
```

**Loop with halving → O(log n)**

```cpp
for (int i = n; i > 0; i /= 2) {
    // O(1) work
}
// Total: O(log n) — i halves each iteration
```

**Nested: outer O(n), inner O(log n) → O(n log n)**

```cpp
for (int i = 0; i < n; i++) {
    for (int j = 1; j < n; j *= 2) {
        // O(1) work
    }
}
// Total: O(n log n)
```

### Sequential vs. Nested

When operations are **sequential** (one after another), add their complexities:
- O(n) + O(n) = O(n)
- O(n) + O(n²) = O(n²) (dominated by larger term)

When operations are **nested** (one inside another), multiply:
- O(n) × O(n) = O(n²)
- O(n) × O(log n) = O(n log n)

### Space Complexity

Space complexity counts the **extra memory** allocated by your algorithm (excluding the input).

```cpp
// O(1) space — only a few variables
int sum = 0;
for (int i = 0; i < n; i++) sum += arr[i];

// O(n) space — creating a new array
std::vector<int> copy(arr.begin(), arr.end());

// O(n) space — hash map can store up to n entries
std::unordered_map<int, int> freq;
for (int x : arr) freq[x]++;
```

### Recursive Complexity and the Master Theorem

Recursive algorithms have their complexity described by **recurrence relations**.

**Linear recursion — O(n) time, O(n) space (call stack)**

```cpp
int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}
// T(n) = T(n-1) + O(1) → O(n)
```

**Binary recursion — O(2ⁿ) time**

```cpp
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}
// T(n) = T(n-1) + T(n-2) + O(1) → O(2ⁿ)
```

**Divide and conquer — Master Theorem basics**

For recurrences of the form **T(n) = a · T(n/b) + O(nᵈ)**:

| Condition | Complexity |
|-----------|-----------|
| d > log_b(a) | O(nᵈ) |
| d = log_b(a) | O(nᵈ log n) |
| d < log_b(a) | O(n^(log_b(a))) |

**Example — Merge Sort:** T(n) = 2·T(n/2) + O(n)
- a = 2, b = 2, d = 1
- log₂(2) = 1 = d → Case 2 → **O(n log n)**

**Example — Binary Search:** T(n) = T(n/2) + O(1)
- a = 1, b = 2, d = 0
- log₂(1) = 0 = d → Case 2 → **O(log n)**

### Best / Average / Worst Case

| Algorithm | Best | Average | Worst |
|-----------|------|---------|-------|
| Linear search | O(1) | O(n) | O(n) |
| Binary search | O(1) | O(log n) | O(log n) |
| Bubble sort | O(n) | O(n²) | O(n²) |
| Quick sort | O(n log n) | O(n log n) | O(n²) |
| Hash map lookup | O(1) | O(1) | O(n) |

## Common Patterns

### Pattern 1 — Recognize the Loop Structure

Count the nesting depth and how the loop variable changes. Halving/doubling → logarithmic. Linear increment → linear. Nested linear → quadratic.

### Pattern 2 — Trading Time for Space

Many interview optimizations replace an O(n²) brute-force approach with an O(n) approach that uses O(n) extra space (typically a hash map). This is the classic time-space trade-off.

### Pattern 3 — Amortized Analysis

Some operations are expensive occasionally but cheap most of the time. `vector::push_back` is O(1) amortized because resizing (O(n)) happens rarely. Interviewers accept "amortized O(1)" as an answer.

### Pattern 4 — Recursive Tree Depth = Space

For recursive algorithms, the call stack depth equals the space complexity. A balanced binary tree recursion uses O(log n) stack space; a linear recursion uses O(n).

---

## Practice Problems

### Problem 1: Identify Time Complexity of Code Snippets

**Problem Statement**

Determine the time complexity of each of the following five code snippets.

**Snippet A:**
```cpp
for (int i = 0; i < n; i++)
    for (int j = i; j < n; j++)
        sum++;
```

**Snippet B:**
```cpp
for (int i = 1; i < n; i *= 2)
    sum++;
```

**Snippet C:**
```cpp
for (int i = 0; i < n; i++)
    for (int j = 0; j < 100; j++)
        sum++;
```

**Snippet D:**
```cpp
for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++)
        for (int k = 0; k < n; k++)
            sum++;
```

**Snippet E:**
```cpp
void solve(int n) {
    if (n <= 0) return;
    solve(n / 2);
    solve(n / 2);
}
```

**Approach**

Analyze each snippet by counting iterations. For nested loops, multiply. For loops where the variable doubles or halves, think logarithmically. For recursion, write the recurrence and apply the Master Theorem.

**Pseudo-code**

```
A: outer i=0..n-1, inner j=i..n-1 → n + (n-1) + ... + 1 = n(n+1)/2 → O(n²)
B: i doubles each time: 1, 2, 4, 8, ... until n → log₂(n) iterations → O(log n)
C: outer O(n), inner fixed 100 → O(100n) = O(n)
D: three nested loops each O(n) → O(n³)
E: T(n) = 2T(n/2) + O(1), a=2, b=2, d=0, log₂2=1 > 0 → O(n)
```

**C++ Solution**

```cpp
#include <iostream>

void snippetA(int n) {
    long long sum = 0;
    for (int i = 0; i < n; i++)
        for (int j = i; j < n; j++)
            sum++;
    std::cout << "A: " << sum << " ops (O(n^2))\n";
}

void snippetB(int n) {
    long long sum = 0;
    for (int i = 1; i < n; i *= 2)
        sum++;
    std::cout << "B: " << sum << " ops (O(log n))\n";
}

void snippetC(int n) {
    long long sum = 0;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < 100; j++)
            sum++;
    std::cout << "C: " << sum << " ops (O(n))\n";
}

void snippetD(int n) {
    long long sum = 0;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            for (int k = 0; k < n; k++)
                sum++;
    std::cout << "D: " << sum << " ops (O(n^3))\n";
}

int snippetE_count;
void snippetE(int n) {
    if (n <= 0) return;
    snippetE_count++;
    snippetE(n / 2);
    snippetE(n / 2);
}

int main() {
    int n = 100;
    snippetA(n);  // A: 5050 ops (O(n^2))
    snippetB(n);  // B: 7 ops (O(log n))
    snippetC(n);  // C: 10000 ops (O(n))

    n = 10; // smaller n for cubic
    snippetD(n);  // D: 1000 ops (O(n^3))

    snippetE_count = 0;
    snippetE(100);
    std::cout << "E: " << snippetE_count << " calls (O(n))\n";

    return 0;
}
```

**Complexity Analysis**

| Snippet | Time | Reasoning |
|---------|------|-----------|
| A | O(n²) | Triangular sum: n(n+1)/2 |
| B | O(log n) | Variable doubles each iteration |
| C | O(n) | Inner loop is constant (100) |
| D | O(n³) | Three nested linear loops |
| E | O(n) | Master theorem: 2T(n/2) + O(1) |

---

### Problem 2: Two-Sum — Brute Force vs. Hash Map

**Problem Statement**

Given an array of integers and a target, find two indices whose elements sum to the target. Compare the brute force approach with the hash map approach.

```
Input:  arr = [2, 7, 11, 15], target = 9
Output: [0, 1] (because arr[0] + arr[1] == 9)
```

**Approach**

- **Brute force:** Check every pair (i, j). Time O(n²), Space O(1).
- **Hash map:** For each element, check if `target - element` is in the map. Time O(n), Space O(n).

**Pseudo-code**

```
// Brute force
for i = 0 to n-1:
    for j = i+1 to n-1:
        if arr[i] + arr[j] == target:
            return [i, j]

// Hash map
map = {}
for i = 0 to n-1:
    complement = target - arr[i]
    if complement in map:
        return [map[complement], i]
    map[arr[i]] = i
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
#include <unordered_map>

// Brute force: O(n²) time, O(1) space
std::pair<int,int> twoSumBrute(const std::vector<int>& arr, int target) {
    int n = arr.size();
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            if (arr[i] + arr[j] == target)
                return {i, j};
    return {-1, -1};
}

// Hash map: O(n) time, O(n) space
std::pair<int,int> twoSumHash(const std::vector<int>& arr, int target) {
    std::unordered_map<int, int> seen;
    for (int i = 0; i < (int)arr.size(); i++) {
        int complement = target - arr[i];
        if (seen.count(complement))
            return {seen[complement], i};
        seen[arr[i]] = i;
    }
    return {-1, -1};
}

int main() {
    std::vector<int> arr = {2, 7, 11, 15};
    int target = 9;

    auto [i1, j1] = twoSumBrute(arr, target);
    std::cout << "Brute force: [" << i1 << ", " << j1 << "]\n";

    auto [i2, j2] = twoSumHash(arr, target);
    std::cout << "Hash map:    [" << i2 << ", " << j2 << "]\n";

    return 0;
}
```

**Complexity Analysis**

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Brute force | O(n²) | O(1) | n ≤ ~5,000 |
| Hash map | O(n) | O(n) | n up to 10⁶+ |

The hash map approach is the standard interview answer. It demonstrates the **time-space trade-off**: use O(n) extra space to reduce time from O(n²) to O(n).

---

### Problem 3: Optimize Nested Loop from O(n²) to O(n)

**Problem Statement**

Given an array of integers, find the maximum subarray sum (contiguous subarray with the largest sum). Start with the O(n²) brute force, then optimize to O(n) using Kadane's algorithm.

```
Input:  [-2, 1, -3, 4, -1, 2, 1, -5, 4]
Output: 6 (subarray [4, -1, 2, 1])
```

**Approach**

- **Brute force O(n²):** Try every starting index and compute the sum for every ending index.
- **Kadane's O(n):** Maintain a running sum. If it drops below zero, reset it. Track the global maximum throughout.

**Pseudo-code**

```
// Brute force O(n²)
maxSum = -infinity
for i = 0 to n-1:
    currentSum = 0
    for j = i to n-1:
        currentSum += arr[j]
        maxSum = max(maxSum, currentSum)

// Kadane's O(n)
maxSum = arr[0]
currentSum = arr[0]
for i = 1 to n-1:
    currentSum = max(arr[i], currentSum + arr[i])
    maxSum = max(maxSum, currentSum)
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <climits>

// Brute force: O(n²) time, O(1) space
int maxSubarrayBrute(const std::vector<int>& arr) {
    int n = arr.size();
    int maxSum = INT_MIN;
    for (int i = 0; i < n; i++) {
        int currentSum = 0;
        for (int j = i; j < n; j++) {
            currentSum += arr[j];
            maxSum = std::max(maxSum, currentSum);
        }
    }
    return maxSum;
}

// Kadane's algorithm: O(n) time, O(1) space
int maxSubarrayKadane(const std::vector<int>& arr) {
    int maxSum = arr[0];
    int currentSum = arr[0];
    for (int i = 1; i < (int)arr.size(); i++) {
        currentSum = std::max(arr[i], currentSum + arr[i]);
        maxSum = std::max(maxSum, currentSum);
    }
    return maxSum;
}

int main() {
    std::vector<int> arr = {-2, 1, -3, 4, -1, 2, 1, -5, 4};

    std::cout << "Brute force: " << maxSubarrayBrute(arr) << "\n";  // 6
    std::cout << "Kadane's:    " << maxSubarrayKadane(arr) << "\n";  // 6

    return 0;
}
```

**Complexity Analysis**

| Approach | Time | Space |
|----------|------|-------|
| Brute force | O(n²) | O(1) |
| Kadane's algorithm | O(n) | O(1) |

Kadane's insight: at each index, the best subarray ending here is either the element alone or the element appended to the previous best. This eliminates the need for the inner loop.

---

## Practice Resources

- [LeetCode — Maximum Subarray (Kadane's)](https://leetcode.com/problems/maximum-subarray/)
- [LeetCode — Two Sum](https://leetcode.com/problems/two-sum/)
- [GeeksforGeeks — Analysis of Algorithms](https://www.geeksforgeeks.org/analysis-of-algorithms-set-1-asymptotic-analysis/)
- [Big-O Cheat Sheet](https://www.bigocheatsheet.com/)
- [GeeksforGeeks — Master Theorem](https://www.geeksforgeeks.org/master-theorem-in-data-structure/)

---

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: Basic Data Structures →](/docs/CodingTestPreparation/Basic/10_basic_data_structures)
