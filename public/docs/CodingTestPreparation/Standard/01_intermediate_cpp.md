# Intermediate C++ — Templates and Exceptions

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

Templates are one of the most powerful features in C++ and form the backbone of generic programming. Rather than writing the same function or class for every data type, templates let you write code once and have the compiler generate type-specific versions automatically. This is not runtime polymorphism — it happens entirely at compile time, meaning zero overhead. The entire Standard Template Library (STL) is built on templates, so understanding them is essential to mastering C++.

Exception handling provides a structured way to deal with runtime errors without cluttering your main logic with error-checking code. Instead of returning error codes from every function (and hoping the caller checks them), you can throw an exception when something goes wrong and catch it at an appropriate level. This separation of normal flow from error-handling flow makes code cleaner and more maintainable.

Beyond templates and exceptions, this section also covers type casting operators and scoping mechanisms. C++ provides four explicit cast operators — each with a specific purpose — replacing the error-prone C-style cast. Namespaces prevent name collisions in large projects, and `enum class` (scoped enumerations) provide type-safe constants that don't leak into the enclosing scope.

## Key Concepts

### Function Templates

A function template is a blueprint for creating functions that work with any data type. The compiler generates (instantiates) a concrete function for each type used.

```cpp
template <typename T>
T add(T a, T b) {
    return a + b;
}

// Usage — compiler generates add<int> and add<double>
int x = add(3, 5);
double y = add(2.5, 3.7);
```

You can also have multiple template parameters and mix template parameters with regular parameters:

```cpp
template <typename T, typename U>
auto multiply(T a, U b) -> decltype(a * b) {
    return a * b;
}
```

### Class Templates

Class templates extend the same idea to entire classes. You define a class once and instantiate it for different types.

```cpp
template <typename T>
class Pair {
    T first, second;
public:
    Pair(T a, T b) : first(a), second(b) {}
    T getMax() const { return (first > second) ? first : second; }
};

Pair<int> p(10, 20);
Pair<std::string> sp("hello", "world");
```

### Template Specialization

Sometimes the generic template doesn't work well for a particular type. Template specialization lets you provide a custom implementation for specific types.

```cpp
// Primary template
template <typename T>
class Printer {
public:
    void print(T val) { std::cout << val << std::endl; }
};

// Full specialization for bool
template <>
class Printer<bool> {
public:
    void print(bool val) { std::cout << (val ? "true" : "false") << std::endl; }
};
```

Partial specialization is also possible for class templates (but not function templates):

```cpp
// Partial specialization for pointer types
template <typename T>
class Printer<T*> {
public:
    void print(T* val) {
        if (val) std::cout << *val << std::endl;
        else std::cout << "nullptr" << std::endl;
    }
};
```

### Exception Handling (try/catch/throw)

Exceptions allow you to separate error handling from normal logic. When an error occurs, you `throw` an exception. Somewhere up the call stack, a `catch` block handles it.

```cpp
double safeDivide(double num, double den) {
    if (den == 0.0)
        throw std::runtime_error("Division by zero");
    return num / den;
}

int main() {
    try {
        double result = safeDivide(10.0, 0.0);
        std::cout << result << std::endl;
    } catch (const std::runtime_error& e) {
        std::cerr << "Error: " << e.what() << std::endl;
    } catch (...) {
        std::cerr << "Unknown error occurred" << std::endl;
    }
}
```

Key rules: catch blocks are checked in order (put more specific exceptions first), catch by `const` reference to avoid slicing, and the `catch(...)` block catches anything.

### Custom Exceptions

Derive from `std::exception` or its subclasses to create meaningful exception types:

```cpp
class InsufficientFundsException : public std::runtime_error {
    double amount_;
public:
    InsufficientFundsException(double amount)
        : std::runtime_error("Insufficient funds"), amount_(amount) {}
    double getAmount() const { return amount_; }
};
```

### Type Casting

C++ provides four cast operators, each with a specific purpose:

| Cast | Purpose |
|------|---------|
| `static_cast<T>` | Safe conversions the compiler can verify (e.g., int ↔ double, base → derived when you're sure) |
| `dynamic_cast<T>` | Safe downcasting in polymorphic hierarchies (returns nullptr on failure for pointers) |
| `const_cast<T>` | Add or remove `const` qualifier (use sparingly) |
| `reinterpret_cast<T>` | Bit-level reinterpretation (dangerous, avoid unless interfacing with hardware/C APIs) |

```cpp
Base* bp = new Derived();
Derived* dp = dynamic_cast<Derived*>(bp); // safe downcast
if (dp) {
    dp->derivedMethod();
}
```

### Namespaces

Namespaces prevent naming collisions, especially in large projects or when combining libraries:

```cpp
namespace math {
    double pi = 3.14159265358979;
    double area(double r) { return pi * r * r; }
}

namespace physics {
    double pi = 3.14159; // different precision, no conflict
}

double a = math::area(5.0);
```

### Scoped Enumerations (enum class)

Unlike traditional `enum`, `enum class` values don't implicitly convert to integers and don't leak into the enclosing scope:

```cpp
enum class Color { Red, Green, Blue };
enum class TrafficLight { Red, Yellow, Green };

Color c = Color::Red;
// int x = c;          // ERROR: no implicit conversion
int x = static_cast<int>(c); // OK: explicit conversion
```

## Common Patterns

### SFINAE (Substitution Failure Is Not An Error)
Templates that conditionally enable/disable overloads based on type traits. Used extensively in library code.

### RAII with Exceptions
Resource Acquisition Is Initialization — wrap resources in objects whose destructors clean up. Combined with exceptions, this ensures no resource leaks even when errors occur.

### Tag Dispatch
Use empty tag types to select template overloads at compile time based on iterator categories or type properties.

### Template Method Pattern in Interviews
Interviewers often ask you to write a generic function (e.g., find max, swap, sort comparator) to test your understanding of templates and type deduction.

---

## Practice Problems

### Problem 1: Generic Max Function Using Templates

**Problem Statement**

Write a function template `maxOf` that takes two arguments of the same type and returns the larger one. It should work with `int`, `double`, `char`, and `std::string`. Provide a specialization for `const char*` that compares strings lexicographically (since the default `>` operator compares pointer addresses).

Input: Two values of the same type
Output: The larger of the two

Example:
```
maxOf(3, 7)           → 7
maxOf(3.14, 2.72)     → 3.14
maxOf("apple", "banana") → "banana"  (lexicographic)
```

**Approach**

Write a primary function template that uses the `>` operator. Then write a full specialization for `const char*` that uses `std::strcmp` to compare C-strings properly. This demonstrates both template basics and when specialization is necessary.

**Pseudo-code**

```
function maxOf<T>(a, b):
    return (a > b) ? a : b

specialization maxOf<const char*>(a, b):
    return strcmp(a, b) > 0 ? a : b
```

**C++ Solution**

```cpp
#include <iostream>
#include <cstring>
#include <string>

template <typename T>
T maxOf(T a, T b) {
    return (a > b) ? a : b;
}

template <>
const char* maxOf<const char*>(const char* a, const char* b) {
    return (std::strcmp(a, b) > 0) ? a : b;
}

int main() {
    std::cout << maxOf(3, 7) << std::endl;               // 7
    std::cout << maxOf(3.14, 2.72) << std::endl;          // 3.14
    std::cout << maxOf('a', 'z') << std::endl;            // z
    std::cout << maxOf<std::string>("apple", "banana")    // banana
              << std::endl;
    std::cout << maxOf("apple", "banana") << std::endl;   // banana (uses specialization)
    return 0;
}
```

**Complexity Analysis**

- **Time:** O(1) for numeric types; O(n) for strings where n is the string length
- **Space:** O(1)

---

### Problem 2: Template-Based Stack Implementation

**Problem Statement**

Implement a generic stack class using templates that supports `push`, `pop`, `top`, `isEmpty`, and `size` operations. The stack should throw an exception if `pop` or `top` is called on an empty stack. Use a `std::vector` as the internal container.

Example:
```
Stack<int> s;
s.push(10); s.push(20); s.push(30);
s.top()    → 30
s.pop()    → (removes 30)
s.size()   → 2
s.pop(); s.pop(); s.pop() → throws exception
```

**Approach**

Create a class template `Stack<T>` with a `std::vector<T>` member. Each operation delegates to vector methods. For error handling, throw `std::underflow_error` when attempting operations on an empty stack. This tests class templates, exception handling, and encapsulation in one problem.

**Pseudo-code**

```
class Stack<T>:
    data = vector<T>

    push(val):
        data.push_back(val)

    pop():
        if data is empty: throw underflow_error
        data.pop_back()

    top():
        if data is empty: throw underflow_error
        return data.back()

    isEmpty(): return data.empty()
    size(): return data.size()
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
#include <stdexcept>

template <typename T>
class Stack {
    std::vector<T> data_;
public:
    void push(const T& val) {
        data_.push_back(val);
    }

    void pop() {
        if (data_.empty())
            throw std::underflow_error("pop() called on empty stack");
        data_.pop_back();
    }

    const T& top() const {
        if (data_.empty())
            throw std::underflow_error("top() called on empty stack");
        return data_.back();
    }

    bool isEmpty() const { return data_.empty(); }
    size_t size() const { return data_.size(); }
};

int main() {
    Stack<int> s;
    s.push(10);
    s.push(20);
    s.push(30);

    std::cout << "Top: " << s.top() << std::endl;   // 30
    s.pop();
    std::cout << "Size: " << s.size() << std::endl;  // 2

    try {
        s.pop();
        s.pop();
        s.pop(); // triggers exception
    } catch (const std::underflow_error& e) {
        std::cerr << "Exception: " << e.what() << std::endl;
    }

    return 0;
}
```

**Complexity Analysis**

- **Time:** O(1) amortized for push, O(1) for pop, top, isEmpty, size
- **Space:** O(n) where n is the number of elements in the stack

---

### Problem 3: Safe Division with Exception Handling

**Problem Statement**

Write a program that reads pairs of integers from the user and performs division. Handle all possible errors: division by zero, invalid input (non-numeric), and overflow. Create a custom exception class `DivisionError` that stores the numerator and denominator. The program should continue processing until the user enters "quit".

Input: Pairs of integers (numerator, denominator)
Output: Result of integer division, or an appropriate error message

Example:
```
Enter numerator and denominator: 10 3
Result: 3

Enter numerator and denominator: 10 0
Error: Division by zero (10 / 0)

Enter numerator and denominator: abc 5
Error: Invalid input — expected integers

Enter numerator and denominator: -2147483648 -1
Error: Integer overflow in division
```

**Approach**

Create a custom `DivisionError` exception class inheriting from `std::runtime_error`. In the division function, check for zero denominator and the special overflow case (`INT_MIN / -1`). Wrap input parsing in a try block to catch `std::invalid_argument` from `std::stoi`. This problem exercises custom exceptions, multiple catch blocks, and robust error handling.

**Pseudo-code**

```
class DivisionError extends runtime_error:
    store numerator, denominator

function safeDivide(a, b):
    if b == 0: throw DivisionError(a, b, "Division by zero")
    if a == INT_MIN and b == -1: throw overflow_error
    return a / b

main loop:
    read line
    parse two integers (catch invalid_argument)
    call safeDivide (catch DivisionError, overflow_error)
    print result
```

**C++ Solution**

```cpp
#include <iostream>
#include <string>
#include <sstream>
#include <stdexcept>
#include <climits>

class DivisionError : public std::runtime_error {
    int numerator_, denominator_;
public:
    DivisionError(int num, int den, const std::string& msg)
        : std::runtime_error(msg), numerator_(num), denominator_(den) {}
    int getNumerator() const { return numerator_; }
    int getDenominator() const { return denominator_; }
};

int safeDivide(int a, int b) {
    if (b == 0)
        throw DivisionError(a, b, "Division by zero");
    if (a == INT_MIN && b == -1)
        throw std::overflow_error("Integer overflow in division");
    return a / b;
}

int main() {
    std::string line;
    while (true) {
        std::cout << "Enter numerator and denominator (or 'quit'): ";
        std::getline(std::cin, line);
        if (line == "quit") break;

        try {
            std::istringstream iss(line);
            std::string sA, sB;
            if (!(iss >> sA >> sB))
                throw std::invalid_argument("Need two values");

            int a = std::stoi(sA);
            int b = std::stoi(sB);
            int result = safeDivide(a, b);
            std::cout << "Result: " << result << std::endl;
        }
        catch (const DivisionError& e) {
            std::cerr << "Error: " << e.what()
                      << " (" << e.getNumerator() << " / "
                      << e.getDenominator() << ")" << std::endl;
        }
        catch (const std::overflow_error& e) {
            std::cerr << "Error: " << e.what() << std::endl;
        }
        catch (const std::invalid_argument&) {
            std::cerr << "Error: Invalid input — expected integers" << std::endl;
        }
    }
    return 0;
}
```

**Complexity Analysis**

- **Time:** O(1) per division operation
- **Space:** O(1)

---

## Practice Resources

- [C++ Templates — cppreference.com](https://en.cppreference.com/w/cpp/language/templates)
- [Exception Handling in C++ — GeeksforGeeks](https://www.geeksforgeeks.org/exception-handling-c/)
- [C++ Type Casting — learncpp.com](https://www.learncpp.com/cpp-tutorial/explicit-type-conversion-casting-and-static-cast/)
- [Templates in C++ — HackerRank Tutorial](https://www.hackerrank.com/challenges/c-class-templates/problem)
- [Namespaces and Scoped Enums — cppreference.com](https://en.cppreference.com/w/cpp/language/enum)

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: Practical STL →](/docs/CodingTestPreparation/Standard/02_practical_stl)
