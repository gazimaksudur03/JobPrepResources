# Pointers and References

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

Pointers and references are what make C++ both powerful and challenging. A pointer is a variable that stores the memory address of another variable, giving you direct access to memory locations. A reference is an alias — another name for an existing variable. Together, they enable efficient data manipulation, dynamic memory management, and the kind of low-level control that distinguishes C++ from higher-level languages.

In coding interviews, pointers appear in linked list problems, tree traversals, and any question involving dynamic memory allocation. Even when you use `std::vector` or `std::string`, understanding that they are built on top of pointers helps you reason about performance and behavior. References are the cleaner, safer cousin of pointers and are the preferred way to pass large objects to functions or to allow functions to modify their arguments.

The critical distinction to internalize: a pointer is a variable with its own memory address that *holds* another address (and can be reassigned or set to null), while a reference is a permanent alias that *must* be initialized and can never be null or rebound. Knowing when to use each is a core C++ skill that interviewers frequently test.

## Key Concepts

### Pointer Declaration and Dereferencing

A pointer variable holds a memory address. The `*` operator (dereference) accesses the value at that address. The `&` operator (address-of) gets the address of a variable.

```cpp
int x = 42;
int* ptr = &x;   // ptr holds the address of x

cout << ptr;     // prints the memory address (e.g., 0x7ffe...)
cout << *ptr;    // prints 42 (the value at that address)

*ptr = 100;      // changes x to 100 through the pointer
cout << x;       // prints 100
```

**Reading pointer declarations:** Read right-to-left. `int* ptr` means "ptr is a pointer to int."

### Null Pointers

A pointer that doesn't point to any valid memory should be set to `nullptr` (C++11 and later):

```cpp
int* ptr = nullptr;

if (ptr == nullptr) {
    cout << "Pointer is null" << endl;
}

// Dereferencing a null pointer is UNDEFINED BEHAVIOR
// *ptr = 5;  // CRASH or unpredictable behavior
```

Always check for `nullptr` before dereferencing, especially when dealing with linked lists and trees.

### Pointer Arithmetic

Pointers support arithmetic operations. Adding 1 to a pointer advances it by `sizeof(type)` bytes:

```cpp
int arr[] = {10, 20, 30, 40, 50};
int* p = arr;       // points to arr[0]

cout << *p;         // 10
cout << *(p + 1);   // 20 (moves forward by sizeof(int) = 4 bytes)
cout << *(p + 4);   // 50

p++;                // p now points to arr[1]
cout << *p;         // 20
```

This is how array indexing works under the hood: `arr[i]` is equivalent to `*(arr + i)`.

### References

A reference is an alias for another variable. Once bound, it cannot be rebound:

```cpp
int x = 10;
int& ref = x;   // ref IS x (same memory location)

ref = 20;
cout << x;       // 20 — modifying ref modifies x

// int& ref2;    // ERROR: references must be initialized
// int& ref3 = nullptr;  // ERROR: references cannot be null
```

### Pointers vs. References

| Feature | Pointer | Reference |
|---------|---------|-----------|
| Can be null | Yes (`nullptr`) | No |
| Can be reassigned | Yes | No (bound at initialization) |
| Syntax to access value | `*ptr` | Just use the name |
| Has its own address | Yes | No (shares address with target) |
| Can do arithmetic | Yes | No |
| Use case | Dynamic structures, optional params | Function parameters, aliases |

### Pass-by-Pointer vs. Pass-by-Reference

Both allow a function to modify the caller's variable, but the syntax differs:

```cpp
// Pass by pointer
void doubleValue(int* ptr) {
    *ptr = (*ptr) * 2;
}

int x = 5;
doubleValue(&x);   // must pass address explicitly
// x is now 10

// Pass by reference
void doubleValue(int& ref) {
    ref = ref * 2;
}

int y = 5;
doubleValue(y);    // cleaner syntax
// y is now 10
```

**In interviews, prefer references** unless you need nullability or pointer arithmetic. References produce cleaner code and eliminate null-pointer bugs.

### Dynamic Memory: new and delete

`new` allocates memory on the heap (persists until explicitly freed). `delete` frees it:

```cpp
// Single variable
int* p = new int(42);
cout << *p;   // 42
delete p;     // free the memory
p = nullptr;  // good practice: avoid dangling pointer

// Array
int* arr = new int[5];
for (int i = 0; i < 5; i++) {
    arr[i] = i * 10;
}
delete[] arr;  // use delete[] for arrays
arr = nullptr;
```

**Critical rules:**
- Every `new` must have a matching `delete`
- Every `new[]` must have a matching `delete[]`
- Never use a pointer after `delete` (dangling pointer)
- In modern C++, prefer `std::vector` and smart pointers over raw `new/delete`

### Common Pointer Pitfalls

1. **Dangling pointer**: Using a pointer after the memory it points to has been freed
2. **Memory leak**: Forgetting to `delete` allocated memory
3. **Wild pointer**: Using an uninitialized pointer
4. **Double free**: Calling `delete` twice on the same pointer

## Common Patterns

### Pattern 1: Swap Using Pointers

The classic demonstration of pointer-based modification:

```cpp
void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}
```

### Pattern 2: Traversing Arrays with Pointers

Using a pointer instead of an index to walk through an array:

```cpp
void printArray(int* arr, int n) {
    int* end = arr + n;
    while (arr < end) {
        cout << *arr << " ";
        arr++;
    }
}
```

### Pattern 3: Dynamic Structures

Building data structures where size isn't known at compile time:

```cpp
int n;
cin >> n;
int* arr = new int[n];
// ... use arr ...
delete[] arr;
```

---

## Practice Problems

### Problem 1: Swap Two Numbers Using Pointers

**Problem Statement**

Write a function that swaps two integers using pointers. The function should take two pointer parameters and swap the values they point to.

```
Input: a = 5, b = 10
Output: a = 10, b = 5
```

**Approach**

Accept two integer pointers as parameters. Dereference them to access the values, use a temporary variable to perform the swap. This demonstrates that you understand how pointers can modify variables across function boundaries.

**Pseudo-code**

```
function swap(ptr_a, ptr_b):
    temp = value at ptr_a
    value at ptr_a = value at ptr_b
    value at ptr_b = temp
```

**C++ Solution**

```cpp
#include <iostream>
using namespace std;

void swapValues(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int a, b;
    cin >> a >> b;

    cout << "Before swap: a = " << a << ", b = " << b << endl;

    swapValues(&a, &b);

    cout << "After swap:  a = " << a << ", b = " << b << endl;

    return 0;
}
```

**Complexity Analysis**
- **Time:** O(1) — three assignments
- **Space:** O(1) — one temporary variable

---

### Problem 2: Find Length of a String Using a Pointer

**Problem Statement**

Given a C-style string (null-terminated character array), find its length using pointer traversal. Do not use `strlen` or any library function.

```
Input: "Hello"
Output: 5

Input: ""
Output: 0
```

**Approach**

Start a pointer at the beginning of the string. Advance the pointer one position at a time until it reaches the null terminator `'\0'`. Count the number of steps taken. This mirrors exactly how `strlen` works internally.

**Pseudo-code**

```
function stringLength(str):
    ptr = str    // pointer to first character
    count = 0
    while value at ptr is not '\0':
        count++
        advance ptr by 1
    return count
```

**C++ Solution**

```cpp
#include <iostream>
using namespace std;

int stringLength(const char* str) {
    const char* ptr = str;
    int length = 0;

    while (*ptr != '\0') {
        length++;
        ptr++;
    }

    return length;
}

int main() {
    char str[100];
    cin.getline(str, 100);

    cout << "Length: " << stringLength(str) << endl;

    return 0;
}
```

**Complexity Analysis**
- **Time:** O(N) — traverses each character exactly once until the null terminator
- **Space:** O(1) — only a pointer and a counter

---

### Problem 3: Dynamic Array Creation and Sum

**Problem Statement**

Read N integers from input into a dynamically allocated array, compute and print their sum, then properly free the memory.

```
Input: N = 4, elements = [3, 7, 2, 8]
Output: Sum = 20

Input: N = 3, elements = [10, -5, 15]
Output: Sum = 20
```

**Approach**

Use `new` to allocate an integer array of size N on the heap. Read the elements into this array, compute the sum with a loop, then free the memory with `delete[]`. This problem tests your understanding of dynamic memory allocation and the responsibility to clean up.

**Pseudo-code**

```
read N
allocate array of size N using new
for i from 0 to N-1:
    read array[i]
sum = 0
for i from 0 to N-1:
    sum += array[i]
print sum
free the array using delete[]
```

**C++ Solution**

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int* arr = new int[n];

    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }

    long long sum = 0;
    for (int i = 0; i < n; i++) {
        sum += arr[i];
    }

    cout << "Sum = " << sum << endl;

    delete[] arr;
    arr = nullptr;

    return 0;
}
```

**Complexity Analysis**
- **Time:** O(N) — one pass to read, one pass to sum
- **Space:** O(N) — the dynamically allocated array of N integers

---

## Practice Resources

- [GeeksforGeeks — Pointers in C++](https://www.geeksforgeeks.org/pointers-in-cpp/)
- [GeeksforGeeks — References in C++](https://www.geeksforgeeks.org/references-in-cpp/)
- [GeeksforGeeks — new and delete Operators](https://www.geeksforgeeks.org/new-and-delete-operators-in-cpp-for-dynamic-memory/)
- [HackerRank — Pointer Challenge](https://www.hackerrank.com/challenges/c-tutorial-pointer/problem)
- [cppreference.com — Pointer Declaration](https://en.cppreference.com/w/cpp/language/pointer)

---

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: Recursion Basics →](/docs/CodingTestPreparation/Basic/06_recursion_basics)
