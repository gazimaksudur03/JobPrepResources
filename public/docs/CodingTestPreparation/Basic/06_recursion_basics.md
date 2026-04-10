# Recursion Basics

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

Recursion is a technique where a function solves a problem by calling itself with a smaller version of the same problem. It is one of the most important concepts in computer science and appears constantly in coding interviews — from simple mathematical computations to complex tree traversals, graph searches, and dynamic programming. If you can think recursively, you can solve a huge class of problems that are awkward or impossible to solve with simple loops.

Every recursive function has two essential parts: a **base case** that stops the recursion (preventing infinite calls), and a **recursive case** that breaks the problem into a smaller subproblem and calls the function again. The call stack manages all the intermediate states — each recursive call pushes a new frame onto the stack, and when a base case is reached, frames are popped off one by one as results propagate back up.

The biggest challenge for beginners is trusting the recursion. When you write `return n * factorial(n - 1)`, you must trust that `factorial(n - 1)` will correctly compute the answer for the smaller input. Think of it as mathematical induction: prove the base case works, prove the step works assuming smaller cases work, and the whole thing works. Once this mental model clicks, recursion becomes a natural and elegant problem-solving tool.

## Key Concepts

### Base Case

The base case is the condition under which the function stops calling itself and returns a known value directly. Without it, recursion runs forever (until stack overflow).

```cpp
int factorial(int n) {
    if (n <= 1) return 1;  // BASE CASE: we know 0! = 1 and 1! = 1
    return n * factorial(n - 1);
}
```

**Rules for good base cases:**
- Must be reachable (the recursive calls must eventually hit it)
- Should handle the smallest/simplest input
- Often handles 0, 1, empty, or null inputs

### Recursive Case

The recursive case reduces the problem and makes a recursive call. The reduction must move toward the base case:

```cpp
int sum(int n) {
    if (n == 0) return 0;         // base case
    return n + sum(n - 1);        // recursive case: reduces n by 1
}
// sum(3) = 3 + sum(2) = 3 + 2 + sum(1) = 3 + 2 + 1 + sum(0) = 6
```

### The Call Stack

Each function call creates a **stack frame** containing:
- The function's local variables
- The parameter values
- The return address (where to continue after the call returns)

```
factorial(4)
├── factorial(3)
│   ├── factorial(2)
│   │   ├── factorial(1)
│   │   │   └── returns 1          ← base case
│   │   └── returns 2 * 1 = 2
│   └── returns 3 * 2 = 6
└── returns 4 * 6 = 24
```

The stack grows with each call and shrinks as calls return. You can visualize it as a stack of plates — last in, first out (LIFO).

### Stack Overflow

If recursion goes too deep (too many nested calls), the program runs out of stack memory and crashes. This happens when:
- The base case is missing or unreachable
- The problem size is too large (e.g., `factorial(1000000)` with simple recursion)

```cpp
// BAD: infinite recursion — no base case
void infinite() {
    infinite();  // stack overflow!
}

// BAD: base case never reached
int bad(int n) {
    if (n == 0) return 0;
    return bad(n + 1);  // n increases, never reaches 0
}
```

The default stack size is typically 1–8 MB, supporting roughly 10,000–100,000 recursive calls depending on frame size.

### Recursion vs. Iteration

Every recursive solution can be converted to an iterative one (and vice versa), but some problems are far more natural in one form:

| Aspect | Recursion | Iteration |
|--------|-----------|-----------|
| Code clarity | Often more elegant | Sometimes verbose |
| Stack usage | Uses call stack (risk of overflow) | Uses loop variables |
| Performance | Function call overhead | Generally faster |
| Best for | Trees, graphs, divide-and-conquer | Simple counting, array traversal |

**Iterative factorial:**

```cpp
int factorial(int n) {
    int result = 1;
    for (int i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}
```

### Tail Recursion

A recursive call is **tail recursive** if the recursive call is the very last operation in the function (no computation after it returns). Some compilers can optimize tail recursion to run in constant stack space:

```cpp
// NOT tail recursive: multiplication happens AFTER the recursive call returns
int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// Tail recursive version using an accumulator
int factorialTail(int n, int acc = 1) {
    if (n <= 1) return acc;
    return factorialTail(n - 1, n * acc);  // recursive call is the LAST operation
}
```

### Recursion Tree Visualization

Drawing a recursion tree helps you understand the flow and identify redundant computations:

```
                    fib(5)
                   /      \
              fib(4)       fib(3)
             /     \       /     \
         fib(3)  fib(2)  fib(2)  fib(1)
        /    \   /   \    /   \
    fib(2) fib(1) fib(1) fib(0) fib(1) fib(0)
    /   \
fib(1) fib(0)
```

Notice how `fib(3)` is computed twice and `fib(2)` is computed three times. This is why naive Fibonacci recursion is exponential — and why memoization (caching results) turns it into O(N).

## Common Patterns

### Pattern 1: Linear Recursion

Process one element and recurse on the rest. Used for lists, strings, and simple counting:

```cpp
int arraySum(int arr[], int n) {
    if (n == 0) return 0;
    return arr[n - 1] + arraySum(arr, n - 1);
}
```

### Pattern 2: Divide and Conquer

Split the problem in half, solve both halves recursively, and combine results. Used in merge sort, binary search, and more:

```cpp
int binarySearch(int arr[], int low, int high, int target) {
    if (low > high) return -1;
    int mid = low + (high - low) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] > target) return binarySearch(arr, low, mid - 1, target);
    return binarySearch(arr, mid + 1, high, target);
}
```

### Pattern 3: Multiple Recursive Calls

Call the function multiple times per invocation. Used in tree problems and combinatorial generation:

```cpp
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}
```

---

## Practice Problems

### Problem 1: Factorial of N

**Problem Statement**

Given a non-negative integer N, compute N! (N factorial). By definition, 0! = 1 and N! = N × (N−1) × ... × 2 × 1.

```
Input: 5
Output: 120

Input: 0
Output: 1

Input: 10
Output: 3628800
```

**Approach**

The factorial has a natural recursive definition: `factorial(0) = 1` and `factorial(n) = n * factorial(n - 1)`. The base case is `n <= 1` returning 1. Each recursive call reduces n by 1, guaranteeing termination.

**Pseudo-code**

```
function factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)
```

**C++ Solution**

```cpp
#include <iostream>
using namespace std;

long long factorial(int n) {
    if (n <= 1) return 1;
    return (long long)n * factorial(n - 1);
}

int main() {
    int n;
    cin >> n;
    cout << n << "! = " << factorial(n) << endl;
    return 0;
}
```

**Complexity Analysis**
- **Time:** O(N) — exactly N recursive calls
- **Space:** O(N) — N frames on the call stack

---

### Problem 2: Fibonacci Number

**Problem Statement**

Given a non-negative integer N, return the Nth Fibonacci number. The Fibonacci sequence is defined as:
- F(0) = 0
- F(1) = 1
- F(N) = F(N−1) + F(N−2) for N ≥ 2

```
Input: 6
Output: 8    (sequence: 0, 1, 1, 2, 3, 5, 8)

Input: 0
Output: 0

Input: 10
Output: 55
```

**Approach**

The naive recursive solution directly follows the definition but has exponential time complexity due to redundant computations. We present both the naive version and the **memoized** version. Memoization stores previously computed results in an array so each subproblem is solved only once, reducing time to O(N).

**Pseudo-code**

```
// Naive version
function fib(n):
    if n <= 1: return n
    return fib(n - 1) + fib(n - 2)

// Memoized version
function fib(n, memo):
    if n <= 1: return n
    if memo[n] is already computed: return memo[n]
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
    return memo[n]
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
using namespace std;

// Memoized Fibonacci
long long fib(int n, vector<long long>& memo) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
    return memo[n];
}

int main() {
    int n;
    cin >> n;

    vector<long long> memo(n + 1, -1);
    cout << "F(" << n << ") = " << fib(n, memo) << endl;

    return 0;
}
```

**Complexity Analysis**
- **Naive recursion:** Time O(2^N), Space O(N) — exponential due to redundant calls
- **Memoized recursion:** Time O(N), Space O(N) — each subproblem computed once; memo array + call stack

---

### Problem 3: Sum of Digits of a Number

**Problem Statement**

Given a non-negative integer N, compute the sum of its digits using recursion.

```
Input: 1234
Output: 10    (1 + 2 + 3 + 4)

Input: 9999
Output: 36    (9 + 9 + 9 + 9)

Input: 0
Output: 0
```

**Approach**

Extract the last digit with `N % 10`, then recurse on the remaining number `N / 10`. The base case is when N becomes 0 (no more digits). This is a clean example of linear recursion where each call processes one digit and makes the number smaller.

**Pseudo-code**

```
function sumOfDigits(n):
    if n == 0:
        return 0
    return (n % 10) + sumOfDigits(n / 10)
```

**C++ Solution**

```cpp
#include <iostream>
using namespace std;

int sumOfDigits(int n) {
    if (n == 0) return 0;
    return (n % 10) + sumOfDigits(n / 10);
}

int main() {
    int n;
    cin >> n;

    if (n == 0) {
        cout << "Sum of digits: 0" << endl;
    } else {
        cout << "Sum of digits: " << sumOfDigits(n) << endl;
    }

    return 0;
}
```

**Complexity Analysis**
- **Time:** O(D) where D is the number of digits in N (equivalently O(log₁₀ N))
- **Space:** O(D) — one stack frame per digit

---

## Practice Resources

- [LeetCode — Fibonacci Number (#509)](https://leetcode.com/problems/fibonacci-number/)
- [LeetCode — Pow(x, n) (#50)](https://leetcode.com/problems/powx-n/)
- [GeeksforGeeks — Recursion in C++](https://www.geeksforgeeks.org/introduction-to-recursion-2/)
- [GeeksforGeeks — Tail Recursion](https://www.geeksforgeeks.org/tail-recursion/)
- [HackerRank — Recursion Challenges](https://www.hackerrank.com/domains/algorithms?filters%5Bsubdomains%5D%5B%5D=recursion)

---

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: Basic OOP →](/docs/CodingTestPreparation/Basic/07_basic_oop)
