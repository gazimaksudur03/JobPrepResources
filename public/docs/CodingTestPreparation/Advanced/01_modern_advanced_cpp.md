# Modern and Advanced C++

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

Modern C++ (C++11 and beyond) is not merely an incremental upgrade over "classic" C++ — it is practically a different language in how it encourages you to write code. Features like `auto`, range-based `for`, move semantics, smart pointers, and `constexpr` remove entire categories of bugs and boilerplate while giving the compiler vastly more room to optimise. Interviewers at top-tier companies increasingly expect candidates to write idiomatic modern C++, not the C-with-classes style of decades past.

C++17 and C++20 push the boundaries further. Structured bindings let you destructure tuples and structs directly, `std::optional` eliminates the need for sentinel values, `std::variant` offers type-safe unions, and fold expressions simplify variadic template code. C++20 introduces **concepts**, which constrain template parameters in a readable, self-documenting way — replacing the infamous SFINAE hacks. Understanding these features is critical not only for interviews but for writing production-grade, maintainable C++ in any modern codebase.

This guide walks through the most impactful features across C++11 through C++20 with clear examples, highlights the patterns that appear in coding interviews, and provides three practice problems that exercise templates, `constexpr`, and `std::variant`.

## Key Concepts

### auto and Type Deduction (C++11)

The `auto` keyword tells the compiler to deduce the type from the initialiser. It reduces verbosity and shields code from refactoring-induced type mismatches.

```cpp
auto x = 42;                     // int
auto pi = 3.14;                  // double
auto name = std::string("C++");  // std::string

std::map<std::string, std::vector<int>> m;
for (auto& [key, val] : m) {     // structured binding (C++17)
    // key is const std::string&, val is std::vector<int>&
}
```

**Interview tip:** Use `auto` for iterator types and lambda captures to avoid noise, but be explicit when the deduced type is non-obvious to the reader.

### Range-Based For Loops (C++11)

```cpp
std::vector<int> v = {1, 2, 3, 4, 5};
for (const auto& elem : v) {
    std::cout << elem << ' ';
}
```

Under the hood this expands to an iterator pair. Prefer `const auto&` to avoid copies, or `auto&` when you need to mutate.

### nullptr (C++11)

`nullptr` is a type-safe null pointer literal of type `std::nullptr_t`. It eliminates the ambiguity of `NULL` (which is `0`, an `int`) in overload resolution:

```cpp
void f(int);
void f(int*);
f(NULL);    // ambiguous — calls f(int) on many compilers
f(nullptr); // unambiguously calls f(int*)
```

### constexpr (C++11/14/17/20)

`constexpr` requests evaluation at compile time. In C++11 only simple expressions were allowed; C++14 permitted loops and local variables; C++20 allows `constexpr` `std::vector` and `std::string`.

```cpp
constexpr int factorial(int n) {
    int result = 1;
    for (int i = 2; i <= n; ++i)
        result *= i;
    return result;
}
static_assert(factorial(5) == 120);
```

### Structured Bindings (C++17)

```cpp
std::map<std::string, int> scores = {{"Alice", 95}, {"Bob", 87}};
for (const auto& [name, score] : scores) {
    std::cout << name << ": " << score << '\n';
}

auto [x, y, z] = std::make_tuple(1, 2.5, "hello");
```

### if with Initialiser (C++17)

```cpp
if (auto it = m.find(key); it != m.end()) {
    // use *it — 'it' is scoped to this if/else
}
```

### std::optional (C++17)

Represents an optional value — superior to returning `-1` or throwing for "no result":

```cpp
#include <optional>

std::optional<int> findIndex(const std::vector<int>& v, int target) {
    for (int i = 0; i < (int)v.size(); ++i)
        if (v[i] == target) return i;
    return std::nullopt;
}

auto idx = findIndex(v, 42);
if (idx.has_value()) {
    std::cout << "Found at " << *idx << '\n';
}
```

### std::variant (C++17)

A type-safe union. At any time it holds exactly one of its alternative types:

```cpp
#include <variant>
#include <string>

std::variant<int, double, std::string> data;
data = 3.14;
std::cout << std::get<double>(data); // 3.14

// visit pattern
std::visit([](auto&& arg) {
    std::cout << arg << '\n';
}, data);
```

### std::any (C++17)

Holds a single value of any copyable type, with type-safe extraction via `std::any_cast`:

```cpp
#include <any>
std::any a = 42;
a = std::string("hello");
std::cout << std::any_cast<std::string>(a); // "hello"
```

### Fold Expressions (C++17)

Simplify variadic template expansions:

```cpp
template <typename... Args>
auto sum(Args... args) {
    return (args + ...); // right fold
}
// sum(1, 2, 3, 4) == 10
```

Four forms: `(args op ...)`, `(... op args)`, `(args op ... op init)`, `(init op ... op args)`.

### Concepts (C++20)

Concepts constrain template parameters with readable predicates, replacing `enable_if` / SFINAE:

```cpp
#include <concepts>

template <std::integral T>
T gcd(T a, T b) {
    while (b) { a %= b; std::swap(a, b); }
    return a;
}

// Custom concept
template <typename T>
concept Addable = requires(T a, T b) {
    { a + b } -> std::convertible_to<T>;
};

template <Addable T>
T add(T a, T b) { return a + b; }
```

## Common Patterns

### Pattern 1: Using `auto` with STL Algorithms

```cpp
auto it = std::find_if(v.begin(), v.end(), [](int x) { return x > 10; });
if (it != v.end()) { /* found */ }
```

Interviewers expect you to combine `auto`, lambdas, and algorithms fluently.

### Pattern 2: constexpr Lookup Tables

Pre-computing results at compile time for O(1) runtime lookup:

```cpp
constexpr auto buildTable() {
    std::array<int, 256> table{};
    for (int i = 0; i < 256; ++i)
        table[i] = __builtin_popcount(i);
    return table;
}
constexpr auto popcount_table = buildTable();
```

### Pattern 3: Visitor on std::variant

The visitor pattern with `std::variant` is a modern replacement for inheritance-based polymorphism in many interview settings:

```cpp
using Expr = std::variant<int, double, std::string>;

struct PrintVisitor {
    void operator()(int i)    const { std::cout << "int: "    << i << '\n'; }
    void operator()(double d) const { std::cout << "double: " << d << '\n'; }
    void operator()(const std::string& s) const { std::cout << "string: " << s << '\n'; }
};

Expr e = 3.14;
std::visit(PrintVisitor{}, e);
```

### Pattern 4: Fold Expressions for Logging / Printing

```cpp
template <typename... Args>
void print(Args&&... args) {
    ((std::cout << args << ' '), ...);
    std::cout << '\n';
}
print("Hello", 42, 3.14); // Hello 42 3.14
```

---

## Practice Problems

### Problem 1: Flatten a Nested Vector Using Templates and auto

**Problem Statement**

Given a nested `std::vector<std::vector<int>>`, write a generic `flatten` function template that returns a single `std::vector<T>` containing all elements in order.

*Input:* `{{1, 2, 3}, {4, 5}, {6}}`
*Output:* `{1, 2, 3, 4, 5, 6}`

**Approach**

Use a function template parameterised on the element type. Iterate over the outer vector, and for each inner vector use `insert` or range-based for to append elements. Leverage `auto` to keep iterator and size types clean. For a more advanced variant, support arbitrary nesting depth via recursive template specialisation.

**Pseudo-code**

```
function flatten(nested):
    result = empty vector
    for each inner in nested:
        for each elem in inner:
            result.append(elem)
    return result
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
#include <type_traits>

// Base case: T is not a vector — already flat
template <typename T>
std::vector<T> flatten(const std::vector<T>& v) {
    return v;
}

// Recursive case: T is itself a vector
template <typename T>
auto flatten(const std::vector<std::vector<T>>& nested) {
    using Flat = decltype(flatten(std::declval<std::vector<T>>()));
    Flat result;
    for (const auto& inner : nested) {
        auto flat = flatten(inner);
        result.insert(result.end(), flat.begin(), flat.end());
    }
    return result;
}

int main() {
    std::vector<std::vector<int>> nested = {{1, 2, 3}, {4, 5}, {6}};
    auto flat = flatten(nested);
    for (const auto& x : flat)
        std::cout << x << ' ';
    // Output: 1 2 3 4 5 6

    // Works with deeper nesting too
    std::vector<std::vector<std::vector<int>>> deep = {{{1, 2}, {3}}, {{4, 5, 6}}};
    auto deepFlat = flatten(deep);
    for (const auto& x : deepFlat)
        std::cout << x << ' ';
    // Output: 1 2 3 4 5 6
    return 0;
}
```

**Complexity Analysis**

- **Time:** O(N) where N is the total number of leaf elements across all nesting levels.
- **Space:** O(N) for the result vector, plus O(D) stack depth for recursion where D is the nesting depth.

---

### Problem 2: Compile-Time Fibonacci Using constexpr

**Problem Statement**

Implement a `constexpr` function that computes the Nth Fibonacci number entirely at compile time. Verify correctness with `static_assert`.

*Input:* `fib(10)`
*Output:* `55`

**Approach**

Write an iterative `constexpr` function (C++14 style) that uses a simple loop. The iterative approach avoids the exponential blowup of naive recursion and works within compiler recursion-depth limits. Use `static_assert` to prove evaluation happens at compile time.

**Pseudo-code**

```
constexpr function fib(n):
    if n <= 1: return n
    a = 0, b = 1
    for i from 2 to n:
        c = a + b
        a = b
        b = c
    return b
```

**C++ Solution**

```cpp
#include <iostream>
#include <cstdint>
#include <array>

constexpr uint64_t fib(int n) {
    if (n <= 1) return static_cast<uint64_t>(n);
    uint64_t a = 0, b = 1;
    for (int i = 2; i <= n; ++i) {
        uint64_t c = a + b;
        a = b;
        b = c;
    }
    return b;
}

// Compile-time verification
static_assert(fib(0)  == 0);
static_assert(fib(1)  == 1);
static_assert(fib(10) == 55);
static_assert(fib(20) == 6765);
static_assert(fib(50) == 12586269025ULL);

// Bonus: build an entire lookup table at compile time
template <std::size_t N>
constexpr auto buildFibTable() {
    std::array<uint64_t, N> table{};
    for (std::size_t i = 0; i < N; ++i)
        table[i] = fib(static_cast<int>(i));
    return table;
}

constexpr auto fibTable = buildFibTable<51>();

int main() {
    // All lookups are O(1) at runtime
    for (int i = 0; i <= 10; ++i)
        std::cout << "fib(" << i << ") = " << fibTable[i] << '\n';
    return 0;
}
```

**Complexity Analysis**

- **Time (compile):** O(N) per call; O(N²) for building the table of size N (can be O(N) if building incrementally).
- **Time (runtime):** O(1) table lookup.
- **Space:** O(N) for the lookup table (stored in the binary's read-only data segment).

---

### Problem 3: Type-Safe Variant Visitor Pattern

**Problem Statement**

Design a simple expression evaluator using `std::variant`. Support three node types: `Literal(double)`, `Add(left, right)`, and `Multiply(left, right)`. Use `std::visit` to evaluate the expression tree.

*Input (conceptual):* `Add(Literal(2), Multiply(Literal(3), Literal(4)))`
*Output:* `14`

**Approach**

Define node types where compound nodes hold `std::shared_ptr` to child nodes (since `std::variant` cannot hold itself by value). Define the variant `Expr` over these types. Write an `evaluate` function using `std::visit` with an overloaded lambda set. The visitor recursively evaluates children.

**Pseudo-code**

```
types:
    Literal { value: double }
    Add     { left: Expr*, right: Expr* }
    Multiply{ left: Expr*, right: Expr* }

function evaluate(expr):
    visit expr:
        Literal  -> return value
        Add      -> return evaluate(left) + evaluate(right)
        Multiply -> return evaluate(left) * evaluate(right)
```

**C++ Solution**

```cpp
#include <iostream>
#include <variant>
#include <memory>

struct Literal;
struct Add;
struct Multiply;

using Expr = std::variant<Literal, Add, Multiply>;
using ExprPtr = std::shared_ptr<Expr>;

struct Literal  { double value; };
struct Add      { ExprPtr left, right; };
struct Multiply { ExprPtr left, right; };

// Helper to create expression nodes
ExprPtr lit(double v) {
    return std::make_shared<Expr>(Literal{v});
}
ExprPtr add(ExprPtr l, ExprPtr r) {
    return std::make_shared<Expr>(Add{std::move(l), std::move(r)});
}
ExprPtr mul(ExprPtr l, ExprPtr r) {
    return std::make_shared<Expr>(Multiply{std::move(l), std::move(r)});
}

// Overload helper for visitor lambdas
template <class... Ts>
struct overloaded : Ts... { using Ts::operator()...; };
template <class... Ts>
overloaded(Ts...) -> overloaded<Ts...>;

double evaluate(const Expr& expr) {
    return std::visit(overloaded{
        [](const Literal& l) -> double {
            return l.value;
        },
        [](const Add& a) -> double {
            return evaluate(*a.left) + evaluate(*a.right);
        },
        [](const Multiply& m) -> double {
            return evaluate(*m.left) * evaluate(*m.right);
        }
    }, expr);
}

int main() {
    // Add(Literal(2), Multiply(Literal(3), Literal(4))) = 2 + 3*4 = 14
    auto expr = add(lit(2), mul(lit(3), lit(4)));
    std::cout << "Result: " << evaluate(*expr) << '\n'; // 14

    // Nested: (1 + 2) * (3 + 4) = 21
    auto expr2 = mul(add(lit(1), lit(2)), add(lit(3), lit(4)));
    std::cout << "Result: " << evaluate(*expr2) << '\n'; // 21

    return 0;
}
```

**Complexity Analysis**

- **Time:** O(N) where N is the number of nodes in the expression tree — each node is visited exactly once.
- **Space:** O(H) stack space for recursion where H is the tree height, plus O(N) heap allocation for shared_ptr nodes.

---

## Practice Resources

- [C++ Reference — C++17 features](https://en.cppreference.com/w/cpp/17) — authoritative reference for all C++17 additions
- [C++ Reference — C++20 features](https://en.cppreference.com/w/cpp/20) — comprehensive C++20 reference including concepts
- [Fluent C++ — Modern C++ articles](https://www.fluentcpp.com/) — practical articles on modern C++ idioms
- [Jason Turner's C++ Weekly (YouTube)](https://www.youtube.com/c/lefticus) — short focused videos on individual C++ features
- [Compiler Explorer (Godbolt)](https://godbolt.org/) — instantly test constexpr, concepts, and template code online

---

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: Smart Pointers, Move Semantics, RAII →](/docs/CodingTestPreparation/Advanced/02_smart_pointers_move_raii)
