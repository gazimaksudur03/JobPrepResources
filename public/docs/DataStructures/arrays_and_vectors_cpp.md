# Complete Guide to Array/Vector Methods in C++

## 1. C-Style Arrays

C-style arrays have **no built-in methods**, but you can use functions from `<algorithm>` and `<cstring>`:

```cpp
int arr[5] = {5, 3, 1, 4, 2};
int n = sizeof(arr) / sizeof(arr[0]); // Size: 5

// Sorting
sort(arr, arr + n);                    // Ascending
sort(arr, arr + n, greater<int>());    // Descending

// Searching
find(arr, arr + n, 3);                // Linear search
binary_search(arr, arr + n, 3);       // Binary search (sorted array)

// Min/Max
*min_element(arr, arr + n);           // Minimum element
*max_element(arr, arr + n);           // Maximum element

// Fill
fill(arr, arr + n, 0);               // Fill all with 0
memset(arr, 0, sizeof(arr));          // Fill with 0 (bytes)

// Reverse
reverse(arr, arr + n);

// Count
count(arr, arr + n, 3);              // Count occurrences of 3

// Accumulate (sum)
accumulate(arr, arr + n, 0);         // Sum of all elements

// Copy
int brr[5];
copy(arr, arr + n, brr);

// Swap
swap(arr[0], arr[1]);
```

---

## 2. `std::array` (Fixed Size - `<array>`)

```cpp
#include <array>
array<int, 5> arr = {5, 3, 1, 4, 2};
```

### Size & Capacity

```cpp
arr.size();          // Number of elements (always 5)
arr.max_size();      // Same as size() for std::array
arr.empty();         // Returns true if size == 0
```

### Element Access

```cpp
arr[0];              // Access without bounds checking
arr.at(0);           // Access WITH bounds checking (throws out_of_range)
arr.front();         // First element
arr.back();          // Last element
arr.data();          // Pointer to underlying array
```

### Modifiers

```cpp
arr.fill(0);         // Fill all elements with 0
arr.swap(arr2);      // Swap with another array
```

### Iterators

```cpp
arr.begin();         // Iterator to first element
arr.end();           // Iterator past last element
arr.rbegin();        // Reverse iterator to last element
arr.rend();          // Reverse iterator before first element
arr.cbegin();        // Const iterator to first element
arr.cend();          // Const iterator past last element
arr.crbegin();       // Const reverse iterator
arr.crend();         // Const reverse iterator
```

---

## 3. `std::vector` (Dynamic Size - `<vector>`)

```cpp
#include <vector>
vector<int> v = {5, 3, 1, 4, 2};
```

### Initialization

```cpp
vector<int> v1;                     // Empty
vector<int> v2(5);                  // 5 elements, all 0
vector<int> v3(5, 10);             // 5 elements, all 10
vector<int> v4 = {1, 2, 3};       // Initializer list
vector<int> v5(v4);                // Copy of v4
vector<int> v6(v4.begin(), v4.end()); // Range constructor
vector<vector<int>> v7(3, vector<int>(4, 0)); // 2D: 3x4, all 0
```

### Size & Capacity

```cpp
v.size();            // Number of elements
v.max_size();        // Maximum possible elements
v.capacity();        // Current allocated capacity
v.empty();           // Returns true if size == 0
v.resize(10);        // Resize to 10 elements
v.resize(10, 5);     // Resize to 10, fill new elements with 5
v.reserve(100);      // Reserve capacity for 100 elements
v.shrink_to_fit();   // Reduce capacity to fit size
```

### Element Access

```cpp
v[0];                // Access without bounds checking
v.at(0);             // Access WITH bounds checking
v.front();           // First element
v.back();            // Last element
v.data();            // Pointer to underlying array
```

### Adding Elements

```cpp
v.push_back(10);             // Add to end
v.emplace_back(10);          // Construct in-place at end (faster)
v.insert(v.begin(), 10);     // Insert at beginning
v.insert(v.begin() + 2, 10); // Insert at index 2
v.insert(v.begin(), 3, 10);  // Insert 3 copies of 10 at beginning
v.insert(v.end(), {1,2,3});  // Insert multiple elements at end
v.emplace(v.begin() + 1, 10);// Construct in-place at position
```

### Removing Elements

```cpp
v.pop_back();                          // Remove last element
v.erase(v.begin());                    // Remove first element
v.erase(v.begin() + 2);               // Remove element at index 2
v.erase(v.begin(), v.begin() + 3);    // Remove first 3 elements
v.clear();                             // Remove ALL elements
```

### Modifiers

```cpp
v.assign(5, 10);            // Replace with 5 copies of 10
v.assign({1, 2, 3});        // Replace with initializer list
v.swap(v2);                 // Swap with another vector
```

### Iterators

```cpp
v.begin();           // Iterator to first element
v.end();             // Iterator past last element
v.rbegin();          // Reverse iterator to last element
v.rend();            // Reverse iterator before first element
v.cbegin();          // Const iterator
v.cend();            // Const iterator
v.crbegin();         // Const reverse iterator
v.crend();           // Const reverse iterator
```

---

## 4. STL Algorithms (Work with All Array Types)

### Sorting

```cpp
sort(v.begin(), v.end());                    // Ascending
sort(v.begin(), v.end(), greater<int>());    // Descending
stable_sort(v.begin(), v.end());             // Stable sort
partial_sort(v.begin(), v.begin()+3, v.end()); // Sort first 3
nth_element(v.begin(), v.begin()+2, v.end());  // nth element in place
is_sorted(v.begin(), v.end());               // Check if sorted
```

### Searching

```cpp
find(v.begin(), v.end(), 3);                          // Linear search
binary_search(v.begin(), v.end(), 3);                 // Binary search (bool)
lower_bound(v.begin(), v.end(), 3);                   // First >= 3
upper_bound(v.begin(), v.end(), 3);                   // First > 3
equal_range(v.begin(), v.end(), 3);                   // Range of 3s
find_if(v.begin(), v.end(), [](int x){return x>3;});  // Find with condition
```

### Min / Max

```cpp
*min_element(v.begin(), v.end());    // Minimum element
*max_element(v.begin(), v.end());    // Maximum element
minmax_element(v.begin(), v.end());  // Both min and max (pair of iterators)
```

### Counting

```cpp
count(v.begin(), v.end(), 3);                           // Count value
count_if(v.begin(), v.end(), [](int x){return x>3;});   // Count with condition
```

### Accumulation / Reduction

```cpp
#include <numeric>
accumulate(v.begin(), v.end(), 0);        // Sum
accumulate(v.begin(), v.end(), 1, multiplies<int>()); // Product
partial_sum(v.begin(), v.end(), result.begin());       // Prefix sums
adjacent_difference(v.begin(), v.end(), result.begin()); // Differences
iota(v.begin(), v.end(), 1);              // Fill with 1, 2, 3, ...
```

### Transformation

```cpp
reverse(v.begin(), v.end());                              // Reverse
rotate(v.begin(), v.begin() + 2, v.end());                // Rotate left by 2
transform(v.begin(), v.end(), v.begin(), [](int x){return x*2;}); // Double all
replace(v.begin(), v.end(), 3, 10);                       // Replace 3 with 10
replace_if(v.begin(), v.end(), [](int x){return x<0;}, 0);// Replace negatives
```

### Removing

```cpp
// Erase-remove idiom
v.erase(remove(v.begin(), v.end(), 3), v.end());          // Remove all 3s
v.erase(remove_if(v.begin(), v.end(), [](int x){return x<0;}), v.end()); // Remove negatives
v.erase(unique(v.begin(), v.end()), v.end());              // Remove consecutive duplicates
```

### Copying

```cpp
copy(v.begin(), v.end(), v2.begin());                  // Copy
copy_if(v.begin(), v.end(), v2.begin(), [](int x){return x>0;}); // Conditional copy
copy_n(v.begin(), 3, v2.begin());                      // Copy first 3
```

### Permutations

```cpp
next_permutation(v.begin(), v.end());     // Next permutation
prev_permutation(v.begin(), v.end());     // Previous permutation
```

### Set Operations (on sorted arrays)

```cpp
set_union(a.begin(), a.end(), b.begin(), b.end(), result.begin());
set_intersection(a.begin(), a.end(), b.begin(), b.end(), result.begin());
set_difference(a.begin(), a.end(), b.begin(), b.end(), result.begin());
merge(a.begin(), a.end(), b.begin(), b.end(), result.begin());
```

### Other Useful Algorithms

```cpp
for_each(v.begin(), v.end(), [](int x){ cout << x; });  // Apply function
all_of(v.begin(), v.end(), [](int x){return x>0;});     // All positive?
any_of(v.begin(), v.end(), [](int x){return x>0;});     // Any positive?
none_of(v.begin(), v.end(), [](int x){return x<0;});    // None negative?
fill(v.begin(), v.end(), 0);                             // Fill with value
generate(v.begin(), v.end(), rand);                      // Fill with generator
shuffle(v.begin(), v.end(), default_random_engine());    // Random shuffle
```

---

## Quick Reference Table

| Operation | C-Array | std::array | std::vector |
|-----------|---------|------------|-------------|
| Fixed size | ✅ | ✅ | ❌ |
| Dynamic size | ❌ | ❌ | ✅ |
| Bounds checking | ❌ | `.at()` | `.at()` |
| Size method | ❌ (manual) | `.size()` | `.size()` |
| Push/Pop | ❌ | ❌ | ✅ |
| Insert/Erase | ❌ | ❌ | ✅ |
| STL compatible | ✅ | ✅ | ✅ |
| Memory overhead | None | None | Slight |

> **Tip:** In competitive programming, `vector` is the most commonly used due to its flexibility and full STL support.
