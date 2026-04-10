# Concurrency Basics in C++

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

Concurrency is the ability of a program to execute multiple tasks simultaneously, and it is increasingly tested in senior-level interviews and system design rounds. C++11 introduced a standardized threading library that provides portable primitives for creating threads, synchronizing shared data, and coordinating between threads. Understanding these primitives is essential not only for interview problems but for writing correct, high-performance production code.

The fundamental challenge of concurrent programming is managing shared mutable state. When multiple threads read and write the same data without coordination, race conditions arise — bugs that depend on the unpredictable timing of thread execution. These bugs are notoriously difficult to reproduce and debug. The tools to prevent them include mutexes (mutual exclusion locks), condition variables (for signaling between threads), and atomic operations (lock-free access to individual variables).

Beyond correctness, concurrency introduces the risk of deadlocks (two threads each waiting for a lock the other holds), livelocks (threads repeatedly changing state without progress), and starvation (a thread never gets access to a resource). Understanding these failure modes and the patterns that prevent them — such as lock ordering, RAII-based lock management, and the producer-consumer pattern — is what separates a developer who can "use threads" from one who can write correct concurrent code.

## Key Concepts

### std::thread

A `std::thread` object represents a single thread of execution. You create it by passing a callable (function, lambda, or functor) and its arguments.

```cpp
#include <thread>
#include <iostream>

void worker(int id) {
    std::cout << "Thread " << id << " running\n";
}

int main() {
    std::thread t1(worker, 1);
    std::thread t2(worker, 2);

    t1.join();
    t2.join();
    return 0;
}
```

**join()** blocks the calling thread until the target thread finishes. **detach()** separates the thread from the `std::thread` object, allowing it to run independently (but you lose the ability to join it). A `std::thread` must be either joined or detached before destruction; otherwise the destructor calls `std::terminate`.

### Mutexes and Locks

A **mutex** (mutual exclusion) ensures only one thread accesses a critical section at a time.

```cpp
#include <mutex>

std::mutex mtx;
int shared_counter = 0;

void increment(int times) {
    for (int i = 0; i < times; i++) {
        std::lock_guard<std::mutex> lock(mtx);
        shared_counter++;
    }
}
```

**`std::lock_guard`** is an RAII wrapper that acquires the mutex on construction and releases it on destruction, guaranteeing exception-safe unlocking.

**`std::unique_lock`** provides the same RAII behavior but with additional flexibility: deferred locking, manual lock/unlock, and use with condition variables.

```cpp
std::unique_lock<std::mutex> lock(mtx, std::defer_lock);
// ... do some work ...
lock.lock();   // manually acquire
// ... critical section ...
lock.unlock(); // manually release
```

**`std::scoped_lock`** (C++17) can lock multiple mutexes simultaneously without deadlock risk:

```cpp
std::scoped_lock lock(mtx1, mtx2);
```

### Condition Variables

A **condition variable** allows threads to wait for a condition to become true, avoiding busy-waiting.

```cpp
#include <condition_variable>

std::mutex mtx;
std::condition_variable cv;
bool ready = false;

void consumer() {
    std::unique_lock<std::mutex> lock(mtx);
    cv.wait(lock, [] { return ready; });
    // proceed — 'ready' is true and lock is held
}

void producer() {
    {
        std::lock_guard<std::mutex> lock(mtx);
        ready = true;
    }
    cv.notify_one();
}
```

`cv.wait(lock, predicate)` atomically releases the lock and suspends the thread. When notified, it reacquires the lock and checks the predicate. The predicate guards against **spurious wakeups** — the thread may be woken even without a notification.

- `notify_one()` wakes one waiting thread.
- `notify_all()` wakes all waiting threads.

### Atomic Operations

**`std::atomic<T>`** provides lock-free operations on a single variable. The hardware guarantees that reads and writes are indivisible.

```cpp
#include <atomic>

std::atomic<int> counter(0);

void increment(int times) {
    for (int i = 0; i < times; i++)
        counter.fetch_add(1, std::memory_order_relaxed);
}
```

Common atomic operations: `load()`, `store()`, `fetch_add()`, `fetch_sub()`, `compare_exchange_weak()`, `compare_exchange_strong()`.

Atomics are faster than mutexes for simple operations on single variables but cannot protect multi-variable invariants.

### Race Conditions

A race condition occurs when the program's correctness depends on the relative timing of thread execution. Classic example:

```cpp
// UNSAFE: both threads may read the same value of counter
void increment() {
    int temp = counter;  // read
    counter = temp + 1;  // write — another thread may have incremented in between
}
```

Fix: use a mutex or an atomic variable.

### Deadlocks

A deadlock occurs when two or more threads are each waiting for the other to release a resource. The four necessary conditions (Coffman conditions):

1. **Mutual exclusion** — resources cannot be shared
2. **Hold and wait** — a thread holds one resource while waiting for another
3. **No preemption** — resources cannot be forcibly taken
4. **Circular wait** — a circular chain of threads, each waiting for the next

**Prevention strategies:**
- Always acquire locks in a consistent global order
- Use `std::scoped_lock` to lock multiple mutexes atomically
- Use `std::lock()` with `std::adopt_lock`
- Use timeouts with `try_lock_for()`

### Producer-Consumer Pattern

A bounded buffer shared between producer threads (which add items) and consumer threads (which remove items). Uses a mutex and two condition variables (one for "not full," one for "not empty").

```cpp
#include <queue>
#include <mutex>
#include <condition_variable>

template <typename T>
class BoundedQueue {
    std::queue<T> queue_;
    int capacity_;
    std::mutex mtx_;
    std::condition_variable not_full_, not_empty_;

public:
    BoundedQueue(int cap) : capacity_(cap) {}

    void produce(T item) {
        std::unique_lock<std::mutex> lock(mtx_);
        not_full_.wait(lock, [this] { return (int)queue_.size() < capacity_; });
        queue_.push(std::move(item));
        not_empty_.notify_one();
    }

    T consume() {
        std::unique_lock<std::mutex> lock(mtx_);
        not_empty_.wait(lock, [this] { return !queue_.empty(); });
        T item = std::move(queue_.front());
        queue_.pop();
        not_full_.notify_one();
        return item;
    }
};
```

### Thread Pool Concept

A thread pool maintains a fixed number of worker threads that pull tasks from a shared queue. This avoids the overhead of repeatedly creating and destroying threads. The pool is initialized once; tasks are submitted as callables and distributed among workers.

Key components: a task queue (thread-safe), a set of worker threads, a condition variable to wake idle workers, and a shutdown mechanism.

## Common Patterns

### Pattern 1: RAII Locking

Always use `std::lock_guard` or `std::unique_lock` instead of raw `mutex.lock()` / `mutex.unlock()`. RAII guarantees the lock is released even if an exception is thrown, preventing deadlocks from exceptions in critical sections.

### Pattern 2: Double-Checked Locking (for Singletons)

Check the condition without the lock, then acquire the lock and check again. This avoids the overhead of locking on every access after initialization:

```cpp
std::atomic<Singleton*> instance{nullptr};
std::mutex mtx;

Singleton* getInstance() {
    Singleton* p = instance.load(std::memory_order_acquire);
    if (!p) {
        std::lock_guard<std::mutex> lock(mtx);
        p = instance.load(std::memory_order_relaxed);
        if (!p) {
            p = new Singleton();
            instance.store(p, std::memory_order_release);
        }
    }
    return p;
}
```

### Pattern 3: Fork-Join Parallelism

Split work among threads, let each process its portion, then join all threads and combine results. This is the natural pattern for parallel algorithms like parallel merge sort or parallel map/reduce.

### Pattern 4: Condition Variable Wait Loop

Always wait on a condition variable inside a predicate loop (or use the predicate overload of `wait`) to handle spurious wakeups:

```cpp
cv.wait(lock, [&] { return condition; });
```

---

## Practice Problems

### Problem 1: Producer-Consumer with Mutex and Condition Variable

**Problem Statement**

Implement a bounded buffer with a maximum capacity of `K`. Multiple producer threads insert integers into the buffer, and multiple consumer threads remove them. Producers must block when the buffer is full; consumers must block when it is empty. The program should terminate gracefully after all items have been produced and consumed.

```
Input:  K = 5, producers = 2, consumers = 2, items per producer = 10
Output: All 20 items produced and consumed (order may vary due to concurrency)
```

**Approach**

Use a `std::queue` protected by a `std::mutex`. Two condition variables coordinate: `not_full` (producers wait on this when the buffer is at capacity) and `not_empty` (consumers wait on this when the buffer is empty). Each producer pushes items and notifies `not_empty`; each consumer pops items and notifies `not_full`. Use a sentinel value or a separate flag to signal termination to consumers.

**Pseudo-code**

```
shared: queue, mutex, cv_not_full, cv_not_empty, done flag

producer(id, count):
    for i from 1 to count:
        lock mutex
        wait on cv_not_full until queue.size < K
        queue.push(item)
        notify cv_not_empty
        unlock mutex

consumer():
    loop:
        lock mutex
        wait on cv_not_empty until queue is not empty OR done
        if queue empty and done: break
        item = queue.pop()
        notify cv_not_full
        unlock mutex
        process(item)
```

**C++ Solution**

```cpp
#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <queue>
#include <vector>
#include <atomic>
using namespace std;

class BoundedBuffer {
    queue<int> buf_;
    int capacity_;
    mutex mtx_;
    condition_variable not_full_, not_empty_;
    bool finished_ = false;

public:
    BoundedBuffer(int cap) : capacity_(cap) {}

    void produce(int item) {
        unique_lock<mutex> lock(mtx_);
        not_full_.wait(lock, [this] { return (int)buf_.size() < capacity_; });
        buf_.push(item);
        not_empty_.notify_one();
    }

    bool consume(int& item) {
        unique_lock<mutex> lock(mtx_);
        not_empty_.wait(lock, [this] { return !buf_.empty() || finished_; });
        if (buf_.empty() && finished_) return false;
        item = buf_.front();
        buf_.pop();
        not_full_.notify_one();
        return true;
    }

    void setFinished() {
        lock_guard<mutex> lock(mtx_);
        finished_ = true;
        not_empty_.notify_all();
    }
};

int main() {
    const int K = 5, NUM_PRODUCERS = 2, ITEMS_PER_PRODUCER = 10;
    BoundedBuffer buffer(K);
    atomic<int> consumed_count(0);

    auto producerFn = [&](int id) {
        for (int i = 0; i < ITEMS_PER_PRODUCER; i++)
            buffer.produce(id * 1000 + i);
    };

    auto consumerFn = [&]() {
        int item;
        while (buffer.consume(item))
            consumed_count.fetch_add(1);
    };

    vector<thread> producers, consumers;
    for (int i = 0; i < NUM_PRODUCERS; i++)
        producers.emplace_back(producerFn, i);
    for (int i = 0; i < 2; i++)
        consumers.emplace_back(consumerFn);

    for (auto& t : producers) t.join();
    buffer.setFinished();
    for (auto& t : consumers) t.join();

    cout << "Total consumed: " << consumed_count.load() << endl;
    return 0;
}
```

**Complexity Analysis**
- **Time:** O(N) where N is the total number of items — each item is enqueued and dequeued exactly once. Condition variable operations are O(1) amortized.
- **Space:** O(K) — the bounded buffer holds at most K items at any time.

---

### Problem 2: Thread-Safe Counter Using Atomic

**Problem Statement**

Implement a thread-safe counter that supports `increment()`, `decrement()`, and `get()` operations. Launch multiple threads that concurrently increment and decrement the counter, and verify the final value is correct.

```
Input:  10 threads each incrementing 100,000 times, 5 threads each decrementing 100,000 times
Output: Final counter value = (10 - 5) × 100,000 = 500,000
```

**Approach**

Use `std::atomic<int>` for the counter. Atomic operations guarantee indivisibility without the overhead of a mutex. Use `fetch_add(1)` for increment and `fetch_sub(1)` for decrement. The `memory_order_relaxed` ordering suffices here since we only need atomicity, not ordering with respect to other variables.

**Pseudo-code**

```
counter = atomic(0)

increment_thread(times):
    for i from 1 to times:
        counter.fetch_add(1)

decrement_thread(times):
    for i from 1 to times:
        counter.fetch_sub(1)

launch threads, join all, print counter.load()
```

**C++ Solution**

```cpp
#include <iostream>
#include <thread>
#include <atomic>
#include <vector>
using namespace std;

class AtomicCounter {
    atomic<long long> value_;
public:
    AtomicCounter() : value_(0) {}
    void increment() { value_.fetch_add(1, memory_order_relaxed); }
    void decrement() { value_.fetch_sub(1, memory_order_relaxed); }
    long long get() const { return value_.load(memory_order_relaxed); }
};

int main() {
    AtomicCounter counter;
    const int INC_THREADS = 10, DEC_THREADS = 5, OPS = 100000;

    auto incFn = [&]() {
        for (int i = 0; i < OPS; i++)
            counter.increment();
    };
    auto decFn = [&]() {
        for (int i = 0; i < OPS; i++)
            counter.decrement();
    };

    vector<thread> threads;
    for (int i = 0; i < INC_THREADS; i++)
        threads.emplace_back(incFn);
    for (int i = 0; i < DEC_THREADS; i++)
        threads.emplace_back(decFn);

    for (auto& t : threads) t.join();

    cout << "Final counter value: " << counter.get() << endl;
    cout << "Expected: " << (long long)(INC_THREADS - DEC_THREADS) * OPS << endl;
    return 0;
}
```

**Complexity Analysis**
- **Time:** O(T × N) total across all threads, where T is the number of threads and N is operations per thread. Each atomic operation is O(1).
- **Space:** O(1) — only the atomic counter variable, independent of the number of threads.

---

### Problem 3: Parallel Merge Sort Using Threads

**Problem Statement**

Implement merge sort that parallelizes the recursive calls using threads. When the subarray size falls below a threshold, fall back to sequential sort to avoid the overhead of thread creation for small subarrays.

```
Input:  arr = [38, 27, 43, 3, 9, 82, 10], threshold = 4
Output: [3, 9, 10, 27, 38, 43, 82]
```

**Approach**

Merge sort naturally decomposes into two independent subproblems (sort left half, sort right half) that can run in parallel. Spawn a new thread for the left half, sort the right half in the current thread, then join the left thread and merge. To prevent exponential thread creation, use a threshold: if the subarray size is below the threshold, sort sequentially. This limits the total number of threads to roughly `N / threshold`.

**Pseudo-code**

```
function parallelMergeSort(arr, left, right, threshold):
    if right - left <= 1: return
    mid = (left + right) / 2
    if right - left > threshold:
        spawn thread for parallelMergeSort(arr, left, mid, threshold)
        parallelMergeSort(arr, mid, right, threshold)
        join thread
    else:
        parallelMergeSort(arr, left, mid, threshold)
        parallelMergeSort(arr, mid, right, threshold)
    merge(arr, left, mid, right)
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
#include <thread>
#include <algorithm>
using namespace std;

void merge(vector<int>& arr, int left, int mid, int right) {
    vector<int> temp;
    int i = left, j = mid;
    while (i < mid && j < right) {
        if (arr[i] <= arr[j])
            temp.push_back(arr[i++]);
        else
            temp.push_back(arr[j++]);
    }
    while (i < mid) temp.push_back(arr[i++]);
    while (j < right) temp.push_back(arr[j++]);
    copy(temp.begin(), temp.end(), arr.begin() + left);
}

void parallelMergeSort(vector<int>& arr, int left, int right, int threshold) {
    if (right - left <= 1) return;
    int mid = left + (right - left) / 2;

    if (right - left > threshold) {
        thread leftThread(parallelMergeSort, ref(arr), left, mid, threshold);
        parallelMergeSort(arr, mid, right, threshold);
        leftThread.join();
    } else {
        parallelMergeSort(arr, left, mid, threshold);
        parallelMergeSort(arr, mid, right, threshold);
    }

    merge(arr, left, mid, right);
}

int main() {
    vector<int> arr = {38, 27, 43, 3, 9, 82, 10, 55, 1, 96, 47, 12, 66, 8, 23, 74};
    int threshold = 4;

    parallelMergeSort(arr, 0, arr.size(), threshold);

    for (int x : arr)
        cout << x << " ";
    cout << endl;
    return 0;
}
```

**Complexity Analysis**
- **Time:** O(N log N) work total. With P processors and ideal scheduling, the span (critical path) is O(N + (N/threshold) × log(N/threshold)) due to merge operations. In practice, the parallel version is faster on multi-core systems for large arrays.
- **Space:** O(N log N) — each merge creates a temporary array of size proportional to the subarray, and there are O(log N) levels. Thread stacks add O(N/threshold) overhead.

---

## Practice Resources

- [LeetCode — Print in Order (#1114)](https://leetcode.com/problems/print-in-order/)
- [LeetCode — Print FooBar Alternately (#1115)](https://leetcode.com/problems/print-foobar-alternately/)
- [LeetCode — Building H2O (#1117)](https://leetcode.com/problems/building-h2o/)
- [cppreference.com — Thread Support Library](https://en.cppreference.com/w/cpp/thread)
- [GeeksforGeeks — Multithreading in C++](https://www.geeksforgeeks.org/multithreading-in-cpp/)

---

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: Low-Level Design →](/docs/CodingTestPreparation/Advanced/11_low_level_design)
