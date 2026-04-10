# Arrays

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

Arrays are the most fundamental data structure in programming — a contiguous block of memory that stores a fixed-size sequence of elements of the same type. In coding interviews, arrays appear in the vast majority of problems, either as the primary data structure or as the underlying storage for more complex structures.

Understanding arrays means understanding memory layout: elements sit next to each other in memory, so accessing any element by index takes constant time O(1). This property makes arrays incredibly fast for random access but inflexible when you need to insert or remove elements in the middle. In C++, you will work with both raw C-style arrays and `std::vector` (a dynamic array from the STL), but this section focuses on raw arrays to build your foundational understanding.

The key array skills for interviews are: traversal (visiting every element), in-place modification (changing the array without extra space), and understanding how arrays interact with functions (arrays decay to pointers when passed). Master these and you will be ready for the array-heavy problems that dominate early interview rounds.

## Key Concepts

### Declaration and Initialization

```cpp
// Declaration with size
int arr[5];  // uninitialized — contains garbage values

// Declaration with initialization
int arr[5] = {1, 2, 3, 4, 5};

// Partial initialization — remaining elements are 0
int arr[5] = {1, 2};  // {1, 2, 0, 0, 0}

// Zero-initialize all elements
int arr[5] = {};       // {0, 0, 0, 0, 0}
int arr[5] = {0};      // {0, 0, 0, 0, 0}

// Let compiler deduce size
int arr[] = {10, 20, 30};  // size is 3
```

### Accessing Elements

Array indexing is **zero-based**: the first element is at index 0.

```cpp
int arr[4] = {10, 20, 30, 40};
arr[0];  // 10 (first element)
arr[3];  // 40 (last element)
arr[4];  // UNDEFINED BEHAVIOR — out of bounds!
```

Out-of-bounds access is one of the most common bugs. C++ does **not** check bounds at runtime for raw arrays. Always ensure `0 <= index < size`.

### Traversal

```cpp
int arr[5] = {1, 2, 3, 4, 5};
int n = 5;

// Index-based traversal
for (int i = 0; i < n; i++) {
    std::cout << arr[i] << " ";
}

// Range-based for loop (C++11)
for (int x : arr) {
    std::cout << x << " ";
}
```

### Multi-Dimensional Arrays

```cpp
// 2D array: 3 rows, 4 columns
int matrix[3][4] = {
    {1, 2, 3, 4},
    {5, 6, 7, 8},
    {9, 10, 11, 12}
};

// Traversal
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 4; j++) {
        std::cout << matrix[i][j] << " ";
    }
    std::cout << std::endl;
}
```

Memory layout is **row-major**: `matrix[0][0], matrix[0][1], ..., matrix[0][3], matrix[1][0], ...` are contiguous.

### Passing Arrays to Functions

When you pass an array to a function, it **decays to a pointer** to its first element. The function does not know the array's size, so you must pass the size separately:

```cpp
void printArray(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        std::cout << arr[i] << " ";
    }
    std::cout << std::endl;
}

int main() {
    int data[] = {5, 3, 8, 1};
    printArray(data, 4);
    return 0;
}
```

Because the function receives a pointer, modifications to `arr[i]` inside the function **do** affect the original array.

### Common Pitfalls

1. **Off-by-one errors**: Using `<=` instead of `<` in loop bounds
2. **Uninitialized arrays**: Reading before writing leads to garbage values
3. **Stack overflow with large arrays**: Declaring `int arr[10000000]` on the stack may crash; use `static` or `std::vector` for large arrays
4. **Forgetting size**: Arrays don't carry their size — always track it separately

## Common Patterns

### Pattern 1: Find Min/Max in a Single Pass

Initialize your result with the first element, then compare with every other element:

```cpp
int maxVal = arr[0];
for (int i = 1; i < n; i++) {
    if (arr[i] > maxVal) {
        maxVal = arr[i];
    }
}
```

### Pattern 2: Two-Pointer Technique

Use two indices (one at the start, one at the end) moving toward each other. Useful for reversing, palindrome checks, and partitioning:

```cpp
int left = 0, right = n - 1;
while (left < right) {
    std::swap(arr[left], arr[right]);
    left++;
    right--;
}
```

### Pattern 3: In-Place Modification with Write Pointer

Use one pointer for reading and another for writing to filter or transform elements without extra space:

```cpp
int write = 0;
for (int read = 0; read < n; read++) {
    if (arr[read] != 0) {
        arr[write++] = arr[read];
    }
}
```

---

## Practice Problems

### Problem 1: Find the Maximum Element in an Array

**Problem Statement**

Given an array of N integers, find and return the maximum element.

```
Input: arr = [3, 7, 2, 9, 5], N = 5
Output: 9

Input: arr = [-1, -5, -3], N = 3
Output: -1
```

**Approach**

Initialize a variable `maxVal` with the first element of the array. Iterate through the remaining elements, updating `maxVal` whenever a larger element is found. This guarantees a single pass through the array.

**Pseudo-code**

```
function findMax(arr, n):
    maxVal = arr[0]
    for i from 1 to n-1:
        if arr[i] > maxVal:
            maxVal = arr[i]
    return maxVal
```

**C++ Solution**

```cpp
#include <iostream>
using namespace std;

int findMax(int arr[], int n) {
    int maxVal = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > maxVal) {
            maxVal = arr[i];
        }
    }
    return maxVal;
}

int main() {
    int n;
    cin >> n;

    int arr[n];
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }

    cout << "Maximum element: " << findMax(arr, n) << endl;
    return 0;
}
```

**Complexity Analysis**
- **Time:** O(N) — every element is visited exactly once
- **Space:** O(1) — only a single variable tracks the maximum

---

### Problem 2: Reverse an Array In-Place

**Problem Statement**

Given an array of N integers, reverse it in-place (without using an additional array).

```
Input: arr = [1, 2, 3, 4, 5]
Output: [5, 4, 3, 2, 1]

Input: arr = [10, 20]
Output: [20, 10]
```

**Approach**

Use the **two-pointer technique**: place one pointer at the beginning and another at the end. Swap the elements at both pointers, then move the pointers toward each other. Repeat until they meet in the middle. This reverses the array using no extra memory.

**Pseudo-code**

```
function reverseArray(arr, n):
    left = 0
    right = n - 1
    while left < right:
        swap(arr[left], arr[right])
        left = left + 1
        right = right - 1
```

**C++ Solution**

```cpp
#include <iostream>
using namespace std;

void reverseArray(int arr[], int n) {
    int left = 0, right = n - 1;
    while (left < right) {
        swap(arr[left], arr[right]);
        left++;
        right--;
    }
}

void printArray(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        cout << arr[i];
        if (i < n - 1) cout << " ";
    }
    cout << endl;
}

int main() {
    int n;
    cin >> n;

    int arr[n];
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }

    reverseArray(arr, n);
    printArray(arr, n);

    return 0;
}
```

**Complexity Analysis**
- **Time:** O(N) — each element is swapped at most once (N/2 swaps)
- **Space:** O(1) — only two index variables used

---

### Problem 3: Rotate an Array by K Positions

**Problem Statement**

Given an array of N integers and an integer K, rotate the array to the right by K positions.

```
Input: arr = [1, 2, 3, 4, 5, 6, 7], K = 3
Output: [5, 6, 7, 1, 2, 3, 4]

Input: arr = [1, 2, 3], K = 1
Output: [3, 1, 2]
```

**Approach**

The **reversal algorithm** is the most elegant O(N) in-place solution:
1. Normalize K: `K = K % N` (handles K > N)
2. Reverse the entire array
3. Reverse the first K elements
4. Reverse the remaining N−K elements

Why this works: reversing the entire array puts the last K elements at the front (but reversed), and the first N−K elements at the back (also reversed). The two partial reverses then fix the internal order of each group.

**Pseudo-code**

```
function rotate(arr, n, k):
    k = k % n
    reverse(arr, 0, n - 1)      // reverse entire array
    reverse(arr, 0, k - 1)      // reverse first k elements
    reverse(arr, k, n - 1)      // reverse remaining elements
```

**C++ Solution**

```cpp
#include <iostream>
using namespace std;

void reverse(int arr[], int start, int end) {
    while (start < end) {
        swap(arr[start], arr[end]);
        start++;
        end--;
    }
}

void rotateRight(int arr[], int n, int k) {
    k = k % n;
    if (k == 0) return;

    reverse(arr, 0, n - 1);
    reverse(arr, 0, k - 1);
    reverse(arr, k, n - 1);
}

void printArray(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        cout << arr[i];
        if (i < n - 1) cout << " ";
    }
    cout << endl;
}

int main() {
    int n, k;
    cin >> n;

    int arr[n];
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }

    cin >> k;
    rotateRight(arr, n, k);
    printArray(arr, n);

    return 0;
}
```

**Complexity Analysis**
- **Time:** O(N) — three reversal passes, each at most O(N)
- **Space:** O(1) — all operations are in-place

---

## Practice Resources

- [LeetCode — Rotate Array (#189)](https://leetcode.com/problems/rotate-array/)
- [LeetCode — Find Maximum in Array (Easy Problems)](https://leetcode.com/problemset/all/?difficulty=EASY&topicSlugs=array)
- [GeeksforGeeks — Arrays in C++](https://www.geeksforgeeks.org/arrays-in-cpp/)
- [GeeksforGeeks — Reversal Algorithm for Array Rotation](https://www.geeksforgeeks.org/program-for-array-rotation-continued-reversal-algorithm/)
- [HackerRank — Arrays Introduction](https://www.hackerrank.com/challenges/arrays-introduction/problem)

---

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: Strings →](/docs/CodingTestPreparation/Basic/04_strings)
