# Functions

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

Functions are the fundamental unit of code organization in C++. A function encapsulates a specific piece of logic that you can name, reuse, and test independently. In coding interviews, writing clean helper functions makes your solution easier to read, debug, and explain — all of which matter when an interviewer is evaluating your code.

Understanding how C++ passes data to functions (by value vs. by reference) is critical because it affects whether a function can modify its arguments. This distinction comes up constantly in problems that ask you to swap values, modify arrays, or build recursive solutions. Function overloading and default parameters let you write flexible interfaces, while inline functions and scope rules affect performance and correctness.

Every coding problem you solve will be written inside a function. The better you understand how functions work — how arguments flow in, how return values flow out, and how the call stack manages everything — the more confident you will be when implementing and debugging solutions under time pressure.

## Key Concepts

### Function Declaration and Definition

A **declaration** (prototype) tells the compiler about a function's name, return type, and parameter types. A **definition** provides the actual body.

```cpp
// Declaration (usually in a header or before main)
int add(int a, int b);

// Definition
int add(int a, int b) {
    return a + b;
}
```

In competitive programming and interviews, you typically write the full definition before `main()` so no separate declaration is needed.

### Parameters: By Value vs. By Reference

**Pass by value** — the function receives a copy. Changes inside the function do not affect the original.

```cpp
void increment(int x) {
    x++;  // only the local copy changes
}

int a = 5;
increment(a);
// a is still 5
```

**Pass by reference** — the function receives an alias to the original variable. Changes are reflected outside.

```cpp
void increment(int& x) {
    x++;  // modifies the original variable
}

int a = 5;
increment(a);
// a is now 6
```

**Pass by const reference** — used to avoid copying large objects while preventing modification:

```cpp
void print(const std::string& s) {
    std::cout << s << std::endl;
    // s[0] = 'X';  // ERROR: cannot modify
}
```

**When to use which:**
| Method | Copy cost | Can modify original? | Use case |
|--------|-----------|---------------------|----------|
| By value | Yes | No | Small types (int, char, bool) |
| By reference | No | Yes | When you need to modify the argument |
| By const reference | No | No | Large objects you only need to read |

### Return Types

A function can return any type, or `void` if it returns nothing:

```cpp
int square(int x) { return x * x; }
bool isEven(int x) { return x % 2 == 0; }
void greet() { std::cout << "Hello!" << std::endl; }
```

In C++17 and later, you can return multiple values using structured bindings with `std::pair` or `std::tuple`:

```cpp
#include <tuple>

std::pair<int, int> minMax(int a, int b) {
    return {std::min(a, b), std::max(a, b)};
}
```

### Default Parameters

You can provide default values for parameters. They must appear at the end of the parameter list:

```cpp
void printMessage(const std::string& msg, int times = 1) {
    for (int i = 0; i < times; i++) {
        std::cout << msg << std::endl;
    }
}

printMessage("Hello");       // prints once
printMessage("Hello", 3);   // prints three times
```

### Function Overloading

C++ allows multiple functions with the same name as long as their parameter lists differ (in type or count):

```cpp
int maxVal(int a, int b) { return (a > b) ? a : b; }
double maxVal(double a, double b) { return (a > b) ? a : b; }
int maxVal(int a, int b, int c) { return maxVal(maxVal(a, b), c); }
```

The compiler picks the correct version based on the arguments at the call site. This is resolved at compile time (static polymorphism).

### Inline Functions

The `inline` keyword suggests the compiler replace the function call with the function body to avoid call overhead:

```cpp
inline int square(int x) {
    return x * x;
}
```

Modern compilers usually make this optimization decision automatically, so `inline` is more of a hint. It is useful for very small, frequently called functions.

### Scope and Lifetime

- **Local variables** exist only within the block `{}` where they are declared.
- **Global variables** are accessible from any function but should be avoided in interviews (they make code harder to reason about).
- **Static local variables** persist across function calls:

```cpp
void counter() {
    static int count = 0;  // initialized only once
    count++;
    std::cout << count << std::endl;
}

counter();  // 1
counter();  // 2
counter();  // 3
```

## Common Patterns

### Pattern 1: Helper Functions for Readability

Break complex logic into small, named functions. Interviewers appreciate this:

```cpp
bool isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return false;
    }
    return true;
}

void printPrimesUpTo(int limit) {
    for (int i = 2; i <= limit; i++) {
        if (isPrime(i)) std::cout << i << " ";
    }
}
```

### Pattern 2: Recursive Functions

A function that calls itself. Every recursive function needs a **base case** (termination condition) and a **recursive case**:

```cpp
int factorial(int n) {
    if (n <= 1) return 1;        // base case
    return n * factorial(n - 1); // recursive case
}
```

### Pattern 3: Functions that Modify via Reference

When a problem says "modify in-place," pass by reference:

```cpp
void sortPair(int& a, int& b) {
    if (a > b) std::swap(a, b);
}
```

---

## Practice Problems

### Problem 1: Power Function (x^n Using Recursion)

**Problem Statement**

Implement a function that computes x raised to the power n (x^n) using recursion. Handle both positive and zero exponents.

```
Input: x = 2, n = 10
Output: 1024

Input: x = 3, n = 0
Output: 1
```

**Approach**

Use the **fast exponentiation** (exponentiation by squaring) technique. The insight is that x^n can be computed as:
- If n is 0, return 1 (base case)
- If n is even, x^n = (x^(n/2))^2
- If n is odd, x^n = x × x^(n-1)

This reduces the number of multiplications from O(n) to O(log n).

**Pseudo-code**

```
function power(x, n):
    if n == 0: return 1
    if n is even:
        half = power(x, n / 2)
        return half * half
    else:
        return x * power(x, n - 1)
```

**C++ Solution**

```cpp
#include <iostream>
using namespace std;

long long power(long long x, int n) {
    if (n == 0) return 1;

    if (n % 2 == 0) {
        long long half = power(x, n / 2);
        return half * half;
    } else {
        return x * power(x, n - 1);
    }
}

int main() {
    long long x;
    int n;
    cin >> x >> n;
    cout << x << "^" << n << " = " << power(x, n) << endl;
    return 0;
}
```

**Complexity Analysis**
- **Time:** O(log N) — the exponent is halved at each even step
- **Space:** O(log N) — recursion depth due to the call stack

---

### Problem 2: Find Maximum of Three Numbers Using Functions

**Problem Statement**

Write a function that takes three integers and returns the maximum among them. Do not use any built-in `max` function.

```
Input: 3, 7, 5
Output: 7

Input: -1, -5, -3
Output: -1
```

**Approach**

Build up from a simpler function: write a function that finds the max of two numbers, then use it to find the max of three. This demonstrates function composition and reuse — something interviewers like to see.

**Pseudo-code**

```
function maxOfTwo(a, b):
    if a >= b: return a
    else: return b

function maxOfThree(a, b, c):
    return maxOfTwo(maxOfTwo(a, b), c)
```

**C++ Solution**

```cpp
#include <iostream>
using namespace std;

int maxOfTwo(int a, int b) {
    return (a >= b) ? a : b;
}

int maxOfThree(int a, int b, int c) {
    return maxOfTwo(maxOfTwo(a, b), c);
}

int main() {
    int a, b, c;
    cin >> a >> b >> c;
    cout << "Maximum: " << maxOfThree(a, b, c) << endl;
    return 0;
}
```

**Complexity Analysis**
- **Time:** O(1) — constant number of comparisons
- **Space:** O(1) — no extra memory

---

### Problem 3: Temperature Converter (Celsius ↔ Fahrenheit)

**Problem Statement**

Write two functions: one to convert Celsius to Fahrenheit and one to convert Fahrenheit to Celsius. The formulas are:
- F = C × 9/5 + 32
- C = (F − 32) × 5/9

```
Input: 100°C
Output: 212.00°F

Input: 32°F
Output: 0.00°C
```

**Approach**

Create two clearly named functions that apply the conversion formulas. Use `double` for precision. This problem tests your ability to write clean, reusable functions with proper types. Use function overloading or separate names to distinguish the two directions.

**Pseudo-code**

```
function celsiusToFahrenheit(c):
    return c * 9.0 / 5.0 + 32.0

function fahrenheitToCelsius(f):
    return (f - 32.0) * 5.0 / 9.0
```

**C++ Solution**

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

double celsiusToFahrenheit(double celsius) {
    return celsius * 9.0 / 5.0 + 32.0;
}

double fahrenheitToCelsius(double fahrenheit) {
    return (fahrenheit - 32.0) * 5.0 / 9.0;
}

int main() {
    double temp;
    char unit;
    cin >> temp >> unit;

    cout << fixed << setprecision(2);

    if (unit == 'C' || unit == 'c') {
        cout << temp << "°C = "
             << celsiusToFahrenheit(temp) << "°F" << endl;
    } else if (unit == 'F' || unit == 'f') {
        cout << temp << "°F = "
             << fahrenheitToCelsius(temp) << "°C" << endl;
    } else {
        cout << "Invalid unit. Use C or F." << endl;
    }

    return 0;
}
```

**Complexity Analysis**
- **Time:** O(1) — single arithmetic computation
- **Space:** O(1) — no extra memory

---

## Practice Resources

- [LeetCode — Pow(x, n) (#50)](https://leetcode.com/problems/powx-n/)
- [GeeksforGeeks — Functions in C++](https://www.geeksforgeeks.org/functions-in-cpp/)
- [HackerRank — Functions in C++](https://www.hackerrank.com/challenges/c-tutorial-functions/problem)
- [GeeksforGeeks — Pass by Reference vs Pass by Value](https://www.geeksforgeeks.org/passing-by-pointer-vs-passing-by-reference-in-cpp/)
- [cppreference.com — Function Declarations](https://en.cppreference.com/w/cpp/language/function)

---

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: Arrays →](/docs/CodingTestPreparation/Basic/03_arrays)
