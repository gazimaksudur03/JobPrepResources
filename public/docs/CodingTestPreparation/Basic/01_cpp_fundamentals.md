# C++ Fundamentals

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

C++ is a statically-typed, compiled, general-purpose programming language that gives you fine-grained control over memory and hardware while still supporting high-level abstractions. Before you can solve any coding interview problem, you need a solid grasp of how C++ handles data, makes decisions, and communicates with the outside world through input and output.

This topic covers the absolute building blocks: how to declare and use variables of different types, how to perform arithmetic and logical operations, how to control the flow of your program with conditionals and loops, and how to read input and print output. These fundamentals appear in every single coding problem you will ever encounter, so mastering them is non-negotiable.

Think of this section as learning the alphabet before writing essays. The concepts here are simple individually, but combining them fluently is what separates a beginner from someone who can confidently walk into a coding interview.

## Key Concepts

### Variables and Data Types

A variable is a named storage location in memory. In C++, every variable has a type that determines how much memory it occupies and what operations are valid on it.

```cpp
int age = 25;            // 4 bytes, whole numbers
float pi = 3.14f;        // 4 bytes, single-precision decimal
double gravity = 9.8;    // 8 bytes, double-precision decimal
char grade = 'A';        // 1 byte, single character
bool isPassed = true;    // 1 byte, true or false
std::string name = "C++"; // variable size, text
```

**Key size facts for interviews:**
- `int` is 4 bytes on most systems (range: roughly -2.1 billion to +2.1 billion)
- `long long` is 8 bytes (use when values exceed ~2 × 10⁹)
- `double` has about 15–17 significant decimal digits of precision
- `char` stores ASCII values (0–127 for standard ASCII)

### Operators

```cpp
// Arithmetic
int sum = a + b;
int diff = a - b;
int prod = a * b;
int quot = a / b;    // integer division truncates: 7/2 = 3
int rem = a % b;     // modulus: 7%2 = 1

// Comparison (return bool)
a == b    a != b    a < b    a > b    a <= b    a >= b

// Logical
(a > 0 && b > 0)   // AND: both must be true
(a > 0 || b > 0)   // OR: at least one true
(!flag)             // NOT: inverts boolean

// Bitwise (appear in advanced problems)
a & b    a | b    a ^ b    ~a    a << n    a >> n
```

**Watch out:** Integer division truncates toward zero. `7 / 2` gives `3`, not `3.5`. If you need the decimal result, cast at least one operand: `(double)a / b`.

### Control Flow

#### if / else if / else

```cpp
if (score >= 90) {
    std::cout << "A";
} else if (score >= 80) {
    std::cout << "B";
} else {
    std::cout << "C or below";
}
```

#### switch

Best used when comparing a single variable against many constant values:

```cpp
switch (day) {
    case 1: std::cout << "Monday"; break;
    case 2: std::cout << "Tuesday"; break;
    default: std::cout << "Other day"; break;
}
```

Forgetting `break` causes fall-through — every subsequent case executes until a `break` is hit.

#### for loop

```cpp
for (int i = 0; i < n; i++) {
    std::cout << i << " ";
}
```

#### while loop

```cpp
int i = 0;
while (i < n) {
    std::cout << i << " ";
    i++;
}
```

#### do-while loop

Executes the body at least once, then checks the condition:

```cpp
int input;
do {
    std::cout << "Enter a positive number: ";
    std::cin >> input;
} while (input <= 0);
```

### Input / Output with cin and cout

```cpp
#include <iostream>
using namespace std;

int main() {
    int x;
    cout << "Enter a number: ";
    cin >> x;
    cout << "You entered: " << x << endl;
    return 0;
}
```

- `cin >> x` reads whitespace-delimited input
- `getline(cin, str)` reads an entire line including spaces
- After using `cin >>` before `getline`, call `cin.ignore()` to discard the leftover newline

### Type Casting

```cpp
// C-style cast
double d = (double)7 / 2;          // 3.5

// C++ static_cast (preferred)
double d = static_cast<double>(7) / 2;

// Implicit conversion (automatic)
int a = 3;
double b = a;  // b is 3.0 — widening is safe

// Narrowing (may lose data)
double x = 3.99;
int y = x;  // y is 3 — decimal part is truncated
```

### Constants

```cpp
const int MAX_SIZE = 100;      // cannot be modified after initialization
constexpr int SQ = 10 * 10;   // evaluated at compile time
```

Use `const` for values that should not change. Interviewers appreciate seeing `const` correctness in your code.

## Common Patterns

### Pattern 1: Iteration with Accumulators

Many problems ask you to traverse data and accumulate a result (sum, count, max, min):

```cpp
int sum = 0;
for (int i = 0; i < n; i++) {
    sum += arr[i];
}
```

### Pattern 2: Modular Arithmetic for Digit Extraction

Extracting digits from a number is a recurring theme:

```cpp
while (n > 0) {
    int digit = n % 10;  // last digit
    n /= 10;             // remove last digit
}
```

### Pattern 3: Conditional Classification

Classifying input based on multiple conditions (FizzBuzz, grade assignment, leap year):

```cpp
if (condition1 && condition2) {
    // most specific case first
} else if (condition1) {
    // broader case
} else {
    // default
}
```

Always order conditions from most specific to most general to avoid incorrect matches.

---

## Practice Problems

### Problem 1: FizzBuzz

**Problem Statement**

Print numbers from 1 to N. For multiples of 3, print "Fizz" instead of the number. For multiples of 5, print "Buzz". For multiples of both 3 and 5, print "FizzBuzz".

```
Input: N = 15
Output: 1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz
```

**Approach**

Check divisibility in the correct order. The key insight is to check divisibility by both 3 and 5 *first*, because if you check for 3 alone first, numbers like 15 would print "Fizz" instead of "FizzBuzz". Use the modulo operator `%` to test divisibility.

**Pseudo-code**

```
for i from 1 to N:
    if i is divisible by both 3 and 5:
        print "FizzBuzz"
    else if i is divisible by 3:
        print "Fizz"
    else if i is divisible by 5:
        print "Buzz"
    else:
        print i
```

**C++ Solution**

```cpp
#include <iostream>
using namespace std;

void fizzBuzz(int n) {
    for (int i = 1; i <= n; i++) {
        if (i % 3 == 0 && i % 5 == 0) {
            cout << "FizzBuzz";
        } else if (i % 3 == 0) {
            cout << "Fizz";
        } else if (i % 5 == 0) {
            cout << "Buzz";
        } else {
            cout << i;
        }
        if (i < n) cout << " ";
    }
    cout << endl;
}

int main() {
    int n;
    cin >> n;
    fizzBuzz(n);
    return 0;
}
```

**Complexity Analysis**
- **Time:** O(N) — single pass from 1 to N
- **Space:** O(1) — no extra data structures

---

### Problem 2: Swap Two Numbers Without a Temp Variable

**Problem Statement**

Given two integers `a` and `b`, swap their values without using a temporary variable.

```
Input: a = 5, b = 10
Output: a = 10, b = 5
```

**Approach**

Use arithmetic operations or the XOR trick. The arithmetic approach works by encoding both values into one variable: add them together, then subtract to recover each original value. The XOR approach exploits the property that `x ^ x = 0` and `x ^ 0 = x`.

**Pseudo-code**

```
// Arithmetic method:
a = a + b
b = a - b    // b now has original a
a = a - b    // a now has original b

// XOR method:
a = a ^ b
b = a ^ b    // b now has original a
a = a ^ b    // a now has original b
```

**C++ Solution**

```cpp
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;

    cout << "Before swap: a = " << a << ", b = " << b << endl;

    // XOR method (safe from overflow, works only for integers)
    a = a ^ b;
    b = a ^ b;
    a = a ^ b;

    cout << "After swap:  a = " << a << ", b = " << b << endl;

    return 0;
}
```

**Complexity Analysis**
- **Time:** O(1) — constant number of operations
- **Space:** O(1) — no extra memory used

---

### Problem 3: Check if a Year is a Leap Year

**Problem Statement**

Given a year, determine whether it is a leap year. A leap year is divisible by 4, but not by 100, unless it is also divisible by 400.

```
Input: 2024
Output: Leap Year

Input: 1900
Output: Not a Leap Year

Input: 2000
Output: Leap Year
```

**Approach**

Apply the leap year rules in the correct order. A year is a leap year if:
1. It is divisible by 400, **OR**
2. It is divisible by 4 **AND** not divisible by 100.

This can be written as a single boolean expression. Checking divisibility by 400 first simplifies the logic.

**Pseudo-code**

```
if (year is divisible by 400) OR (year is divisible by 4 AND year is not divisible by 100):
    it is a leap year
else:
    it is not a leap year
```

**C++ Solution**

```cpp
#include <iostream>
using namespace std;

bool isLeapYear(int year) {
    return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
}

int main() {
    int year;
    cin >> year;

    if (isLeapYear(year)) {
        cout << year << " is a Leap Year" << endl;
    } else {
        cout << year << " is Not a Leap Year" << endl;
    }

    return 0;
}
```

**Complexity Analysis**
- **Time:** O(1) — fixed number of modulo operations
- **Space:** O(1) — no extra memory

---

## Practice Resources

- [LeetCode — FizzBuzz (#412)](https://leetcode.com/problems/fizz-buzz/)
- [GeeksforGeeks — C++ Data Types](https://www.geeksforgeeks.org/cpp-data-types/)
- [GeeksforGeeks — Operators in C++](https://www.geeksforgeeks.org/operators-in-cpp/)
- [HackerRank — C++ Introduction Challenges](https://www.hackerrank.com/domains/cpp?filters%5Bsubdomains%5D%5B%5D=cpp-introduction)
- [cppreference.com — Fundamental Types](https://en.cppreference.com/w/cpp/language/types)

---

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: Functions →](/docs/CodingTestPreparation/Basic/02_functions)
