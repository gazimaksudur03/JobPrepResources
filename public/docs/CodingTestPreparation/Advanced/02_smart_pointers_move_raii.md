# Smart Pointers, Move Semantics, RAII

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

Manual memory management with raw `new` and `delete` is the single largest source of bugs in classical C++ code — memory leaks, double frees, dangling pointers, and exception-safety holes. Modern C++ solves this through **RAII (Resource Acquisition Is Initialization)**: tie the lifetime of a resource (heap memory, file handles, mutex locks) to the lifetime of a stack object whose destructor releases it automatically. Smart pointers — `std::unique_ptr`, `std::shared_ptr`, and `std::weak_ptr` — are the standard library's embodiment of RAII for heap memory.

**Move semantics** (C++11) underpin the efficiency of smart pointers and modern containers. When an object is about to be destroyed anyway (an rvalue), instead of expensively copying its internals, we can "steal" them. Rvalue references (`T&&`), `std::move`, move constructors, and move assignment operators give you fine control over this transfer. Together with the **Rule of Five** (destructor, copy constructor, copy assignment, move constructor, move assignment), they form the backbone of resource-safe class design.

Understanding these concepts is essential for interviews at companies that care about C++ quality. You will be asked to implement smart pointers from scratch, design RAII wrappers, and reason about ownership transfer in concurrent or exception-prone code.

## Key Concepts

### RAII — Resource Acquisition Is Initialization

The core idea: acquire a resource in a constructor, release it in the destructor. Because C++ guarantees destructor calls when objects go out of scope (even during stack unwinding from exceptions), this pattern provides deterministic, exception-safe cleanup.

```cpp
class FileGuard {
    FILE* fp_;
public:
    explicit FileGuard(const char* path, const char* mode)
        : fp_(std::fopen(path, mode)) {
        if (!fp_) throw std::runtime_error("Cannot open file");
    }
    ~FileGuard() { if (fp_) std::fclose(fp_); }

    FileGuard(const FileGuard&) = delete;
    FileGuard& operator=(const FileGuard&) = delete;

    FILE* get() const { return fp_; }
};
```

### std::unique_ptr — Exclusive Ownership

`unique_ptr` is a zero-overhead wrapper that owns a heap object exclusively. It cannot be copied, only moved. When it goes out of scope, the managed object is deleted.

```cpp
#include <memory>

auto p = std::make_unique<int>(42);
std::cout << *p; // 42

// Transfer ownership
auto q = std::move(p);
// p is now nullptr, q owns the int

// Custom deleter
auto filePtr = std::unique_ptr<FILE, decltype(&std::fclose)>(
    std::fopen("data.txt", "r"), &std::fclose
);
```

**Key properties:**
- Size is the same as a raw pointer (zero overhead) when using the default deleter.
- Use `std::make_unique<T>(args...)` — it is exception-safe and concise.
- Pass by value to transfer ownership, by `const unique_ptr&` only if ownership is not transferred.

### std::shared_ptr — Shared Ownership

`shared_ptr` uses reference counting. Multiple `shared_ptr` instances can own the same object; the object is deleted when the last one is destroyed.

```cpp
auto sp1 = std::make_shared<std::vector<int>>(10, 0);
auto sp2 = sp1; // reference count = 2
sp1.reset();    // reference count = 1
// Object destroyed when sp2 goes out of scope
```

**Internals:** `make_shared` allocates the control block (reference counts) and the object in a single allocation. This is more cache-friendly and reduces allocation overhead compared to `shared_ptr<T>(new T(...))`.

### std::weak_ptr — Breaking Cycles

`weak_ptr` observes a `shared_ptr`-managed object without incrementing the reference count. It solves the circular reference problem.

```cpp
struct Node {
    std::shared_ptr<Node> next;
    std::weak_ptr<Node> prev;  // weak to break cycle
};

auto a = std::make_shared<Node>();
auto b = std::make_shared<Node>();
a->next = b;
b->prev = a; // weak — won't prevent a's destruction
```

To use the observed object, call `lock()` which returns a `shared_ptr` (empty if the object was already deleted).

### Rvalue References and std::move

An **lvalue** is an expression with an identifiable memory location; an **rvalue** is a temporary. Rvalue references (`T&&`) bind to temporaries and enable "stealing" resources.

```cpp
std::string a = "hello";
std::string b = std::move(a); // a is now in a valid-but-unspecified state
                               // b owns "hello" — no copy, just pointer swap
```

`std::move` does not move anything — it is a cast to `T&&` that signals the caller that the object may be moved from.

### Move Constructor and Move Assignment

```cpp
class Buffer {
    int* data_;
    size_t size_;
public:
    // Move constructor
    Buffer(Buffer&& other) noexcept
        : data_(other.data_), size_(other.size_) {
        other.data_ = nullptr;
        other.size_ = 0;
    }

    // Move assignment
    Buffer& operator=(Buffer&& other) noexcept {
        if (this != &other) {
            delete[] data_;
            data_ = other.data_;
            size_ = other.size_;
            other.data_ = nullptr;
            other.size_ = 0;
        }
        return *this;
    }
};
```

Mark move operations `noexcept` — the STL (e.g., `std::vector` during reallocation) will only use move if it is `noexcept`.

### The Rule of Five

If your class manages a resource, you typically need all five:

1. **Destructor** — releases the resource.
2. **Copy constructor** — deep copies the resource.
3. **Copy assignment** — deep copies (handles self-assignment).
4. **Move constructor** — steals the resource.
5. **Move assignment** — steals the resource (handles self-assignment).

If you can use smart pointers internally, you can often follow the **Rule of Zero** — let compiler-generated defaults handle everything.

### Perfect Forwarding (Introduction)

`std::forward` preserves the value category (lvalue/rvalue) of a function argument inside a template. Combined with universal references (`T&&` in a template context), this lets you write wrapper functions with zero overhead:

```cpp
template <typename T, typename... Args>
std::unique_ptr<T> makeUnique(Args&&... args) {
    return std::unique_ptr<T>(new T(std::forward<Args>(args)...));
}
```

## Common Patterns

### Pattern 1: Factory Functions Returning unique_ptr

```cpp
std::unique_ptr<Shape> createShape(const std::string& type) {
    if (type == "circle") return std::make_unique<Circle>(5.0);
    if (type == "rect")   return std::make_unique<Rectangle>(3.0, 4.0);
    return nullptr;
}
```

This is the standard ownership-transfer pattern. The caller receives exclusive ownership.

### Pattern 2: Shared Ownership in Graphs / Trees

When multiple parents can reference the same child (e.g., in a DAG), use `shared_ptr` for children and `weak_ptr` for back-edges to prevent cycles.

### Pattern 3: RAII Lock Guards

```cpp
std::mutex mtx;
{
    std::lock_guard<std::mutex> lock(mtx); // acquired
    // critical section
} // released here — even if an exception is thrown
```

### Pattern 4: Sink Parameters

When a function takes ownership, accept by value and move:

```cpp
class Registry {
    std::vector<std::unique_ptr<Widget>> widgets_;
public:
    void add(std::unique_ptr<Widget> w) {
        widgets_.push_back(std::move(w));
    }
};
```

---

## Practice Problems

### Problem 1: Implement a Simple unique_ptr from Scratch

**Problem Statement**

Implement a class template `UniquePtr<T>` that mimics `std::unique_ptr` with the following features:
- Constructor taking a raw pointer
- Destructor that deletes the managed object
- Move constructor and move assignment (no copy)
- `get()`, `release()`, `reset()`, `operator*`, `operator->`

*Example:*
```
UniquePtr<int> p(new int(42));
std::cout << *p; // 42
auto q = std::move(p);
assert(p.get() == nullptr);
assert(*q == 42);
```

**Approach**

Store a raw pointer. Delete it in the destructor. Delete copy operations. In the move constructor, steal the pointer and null out the source. `release()` gives up ownership without deleting; `reset()` deletes the current object and optionally takes a new one.

**Pseudo-code**

```
class UniquePtr<T>:
    ptr = null

    constructor(raw): ptr = raw
    destructor: delete ptr

    move_constructor(other):
        ptr = other.ptr
        other.ptr = null

    move_assign(other):
        if this != other:
            delete ptr
            ptr = other.ptr
            other.ptr = null
        return this

    get(): return ptr
    release(): tmp = ptr; ptr = null; return tmp
    reset(new_ptr): delete ptr; ptr = new_ptr
    operator*: return *ptr
    operator->: return ptr
```

**C++ Solution**

```cpp
#include <iostream>
#include <cassert>
#include <utility>

template <typename T>
class UniquePtr {
    T* ptr_;

public:
    explicit UniquePtr(T* p = nullptr) noexcept : ptr_(p) {}

    ~UniquePtr() { delete ptr_; }

    UniquePtr(const UniquePtr&) = delete;
    UniquePtr& operator=(const UniquePtr&) = delete;

    UniquePtr(UniquePtr&& other) noexcept : ptr_(other.ptr_) {
        other.ptr_ = nullptr;
    }

    UniquePtr& operator=(UniquePtr&& other) noexcept {
        if (this != &other) {
            delete ptr_;
            ptr_ = other.ptr_;
            other.ptr_ = nullptr;
        }
        return *this;
    }

    T* get() const noexcept { return ptr_; }

    T* release() noexcept {
        T* tmp = ptr_;
        ptr_ = nullptr;
        return tmp;
    }

    void reset(T* p = nullptr) noexcept {
        if (ptr_ != p) {
            delete ptr_;
            ptr_ = p;
        }
    }

    T& operator*() const { return *ptr_; }
    T* operator->() const noexcept { return ptr_; }

    explicit operator bool() const noexcept { return ptr_ != nullptr; }
};

int main() {
    UniquePtr<int> a(new int(42));
    assert(*a == 42);

    UniquePtr<int> b = std::move(a);
    assert(!a);           // a is null
    assert(*b == 42);

    b.reset(new int(99));
    assert(*b == 99);

    int* raw = b.release();
    assert(!b);
    assert(*raw == 99);
    delete raw;

    std::cout << "All tests passed.\n";
    return 0;
}
```

**Complexity Analysis**

- **Time:** All operations are O(1). Destruction calls `delete` which is O(1) amortised.
- **Space:** O(1) — stores a single pointer, same overhead as a raw pointer.

---

### Problem 2: Resource-Safe File Handler Using RAII

**Problem Statement**

Create a `SafeFile` class that wraps C-style `FILE*` operations with RAII. It should:
- Open a file in the constructor, throw on failure
- Support `read()` and `write()` operations
- Automatically close in the destructor
- Be moveable but not copyable

*Example:*
```
{
    SafeFile f("output.txt", "w");
    f.write("Hello, RAII!");
} // file automatically closed here
```

**Approach**

Store a `FILE*`. Open in the constructor, close in the destructor. Delete copy operations. Implement move by transferring the pointer and nulling the source. Provide `read`/`write` wrappers around `std::fread`/`std::fwrite`.

**Pseudo-code**

```
class SafeFile:
    fp = null

    constructor(path, mode):
        fp = fopen(path, mode)
        if fp is null: throw error

    destructor: if fp: fclose(fp)

    move_constructor(other): fp = other.fp; other.fp = null
    move_assign(other): close current; fp = other.fp; other.fp = null

    write(data): fwrite(data, fp)
    read(buffer, size): return fread(buffer, size, fp)
```

**C++ Solution**

```cpp
#include <cstdio>
#include <string>
#include <stdexcept>
#include <vector>
#include <iostream>
#include <utility>

class SafeFile {
    FILE* fp_ = nullptr;

public:
    SafeFile(const std::string& path, const std::string& mode) {
        fp_ = std::fopen(path.c_str(), mode.c_str());
        if (!fp_)
            throw std::runtime_error("Failed to open: " + path);
    }

    ~SafeFile() {
        if (fp_) std::fclose(fp_);
    }

    SafeFile(const SafeFile&) = delete;
    SafeFile& operator=(const SafeFile&) = delete;

    SafeFile(SafeFile&& other) noexcept : fp_(other.fp_) {
        other.fp_ = nullptr;
    }

    SafeFile& operator=(SafeFile&& other) noexcept {
        if (this != &other) {
            if (fp_) std::fclose(fp_);
            fp_ = other.fp_;
            other.fp_ = nullptr;
        }
        return *this;
    }

    void write(const std::string& data) {
        if (!fp_) throw std::runtime_error("File not open");
        std::size_t written = std::fwrite(data.data(), 1, data.size(), fp_);
        if (written != data.size())
            throw std::runtime_error("Write failed");
    }

    std::string read(std::size_t maxBytes = 4096) {
        if (!fp_) throw std::runtime_error("File not open");
        std::vector<char> buf(maxBytes);
        std::size_t bytesRead = std::fread(buf.data(), 1, maxBytes, fp_);
        return std::string(buf.data(), bytesRead);
    }

    void flush() {
        if (fp_) std::fflush(fp_);
    }

    FILE* get() const { return fp_; }
};

int main() {
    {
        SafeFile out("raii_test.txt", "w");
        out.write("Hello, RAII!\nLine 2\n");
    } // file closed here

    {
        SafeFile in("raii_test.txt", "r");
        std::string content = in.read();
        std::cout << content;
    } // file closed here

    // Move semantics
    SafeFile f1("raii_test.txt", "r");
    SafeFile f2 = std::move(f1);
    // f1 is now empty, f2 owns the file
    std::cout << f2.read();

    std::cout << "RAII file handler works correctly.\n";
    return 0;
}
```

**Complexity Analysis**

- **Time:** Constructor O(1), `write` O(N) where N is data size, `read` O(N) where N is bytes read.
- **Space:** O(N) for the read buffer; the class itself is O(1) (single pointer).

---

### Problem 3: Move-Aware Dynamic Array Class

**Problem Statement**

Implement a `DynArray<T>` class that manages a dynamically allocated array with:
- `push_back(const T&)` and `push_back(T&&)` (move overload)
- Automatic capacity doubling
- Full Rule of Five: copy constructor, copy assignment, move constructor, move assignment, destructor
- Iterator support via `begin()` / `end()` (raw pointers are valid iterators)

*Example:*
```
DynArray<std::string> arr;
arr.push_back("hello");
std::string s = "world";
arr.push_back(std::move(s)); // s is moved, not copied
assert(arr.size() == 2);
```

**Approach**

Store a raw pointer, a size, and a capacity. Double capacity when full. Implement the copy operations as deep copies with `std::copy` or element-wise copy-construction. Implement the move operations as pointer theft. Provide two `push_back` overloads — one for lvalue references (copies), one for rvalue references (moves the element into storage).

**Pseudo-code**

```
class DynArray<T>:
    data, sz, cap

    push_back(const T& val):
        if sz == cap: grow()
        construct data[sz] with val
        sz++

    push_back(T&& val):
        if sz == cap: grow()
        construct data[sz] with move(val)
        sz++

    grow():
        new_cap = max(1, cap * 2)
        new_data = allocate(new_cap)
        move all elements from data to new_data
        deallocate data
        data = new_data, cap = new_cap

    move_constructor(other):
        steal data, sz, cap from other
        null out other

    copy_constructor(other):
        allocate cap = other.cap
        copy all elements
        sz = other.sz
```

**C++ Solution**

```cpp
#include <iostream>
#include <algorithm>
#include <cassert>
#include <string>
#include <memory>
#include <utility>

template <typename T>
class DynArray {
    T* data_ = nullptr;
    std::size_t size_ = 0;
    std::size_t cap_ = 0;

    void grow() {
        std::size_t newCap = cap_ == 0 ? 1 : cap_ * 2;
        T* newData = static_cast<T*>(::operator new(newCap * sizeof(T)));
        for (std::size_t i = 0; i < size_; ++i)
            new (newData + i) T(std::move(data_[i]));
        destroyAll();
        ::operator delete(data_);
        data_ = newData;
        cap_ = newCap;
    }

    void destroyAll() {
        for (std::size_t i = 0; i < size_; ++i)
            data_[i].~T();
    }

public:
    DynArray() = default;

    ~DynArray() {
        destroyAll();
        ::operator delete(data_);
    }

    // Copy constructor
    DynArray(const DynArray& other)
        : data_(static_cast<T*>(::operator new(other.cap_ * sizeof(T))))
        , size_(other.size_)
        , cap_(other.cap_) {
        for (std::size_t i = 0; i < size_; ++i)
            new (data_ + i) T(other.data_[i]);
    }

    // Copy assignment
    DynArray& operator=(const DynArray& other) {
        if (this != &other) {
            DynArray tmp(other);
            swap(tmp);
        }
        return *this;
    }

    // Move constructor
    DynArray(DynArray&& other) noexcept
        : data_(other.data_), size_(other.size_), cap_(other.cap_) {
        other.data_ = nullptr;
        other.size_ = 0;
        other.cap_ = 0;
    }

    // Move assignment
    DynArray& operator=(DynArray&& other) noexcept {
        if (this != &other) {
            destroyAll();
            ::operator delete(data_);
            data_ = other.data_;
            size_ = other.size_;
            cap_ = other.cap_;
            other.data_ = nullptr;
            other.size_ = 0;
            other.cap_ = 0;
        }
        return *this;
    }

    void swap(DynArray& other) noexcept {
        std::swap(data_, other.data_);
        std::swap(size_, other.size_);
        std::swap(cap_, other.cap_);
    }

    void push_back(const T& val) {
        if (size_ == cap_) grow();
        new (data_ + size_) T(val);
        ++size_;
    }

    void push_back(T&& val) {
        if (size_ == cap_) grow();
        new (data_ + size_) T(std::move(val));
        ++size_;
    }

    T& operator[](std::size_t i) { return data_[i]; }
    const T& operator[](std::size_t i) const { return data_[i]; }

    std::size_t size() const { return size_; }
    std::size_t capacity() const { return cap_; }

    T* begin() { return data_; }
    T* end()   { return data_ + size_; }
    const T* begin() const { return data_; }
    const T* end()   const { return data_ + size_; }
};

int main() {
    DynArray<std::string> arr;
    arr.push_back("hello");

    std::string s = "world";
    arr.push_back(std::move(s));
    assert(arr.size() == 2);
    assert(arr[0] == "hello");
    assert(arr[1] == "world");

    // Copy
    DynArray<std::string> arr2 = arr;
    assert(arr2.size() == 2);

    // Move
    DynArray<std::string> arr3 = std::move(arr);
    assert(arr.size() == 0);
    assert(arr3.size() == 2);

    // Range-based for
    for (const auto& elem : arr3)
        std::cout << elem << ' ';
    std::cout << '\n';

    std::cout << "All tests passed.\n";
    return 0;
}
```

**Complexity Analysis**

- **Time:** `push_back` is amortised O(1) (geometric growth doubles capacity). Copy constructor/assignment is O(N). Move constructor/assignment is O(1).
- **Space:** O(N) for storing N elements, with at most 2N capacity due to doubling.

---

## Practice Resources

- [cppreference — Smart Pointers](https://en.cppreference.com/w/cpp/memory) — definitive reference for unique_ptr, shared_ptr, weak_ptr
- [cppreference — Move Semantics](https://en.cppreference.com/w/cpp/language/move_constructor) — move constructors, move assignment
- [Herb Sutter's GotW — Smart Pointer Guidelines](https://herbsutter.com/2013/06/05/gotw-91-solution-smart-pointer-parameters/) — best practices for passing smart pointers
- [LeetCode — Design problems](https://leetcode.com/tag/design/) — practice implementing data structures
- [Back to Basics: Move Semantics (CppCon)](https://www.youtube.com/results?search_query=cppcon+move+semantics) — excellent video explanations

---

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: Advanced STL →](/docs/CodingTestPreparation/Advanced/03_advanced_stl)
