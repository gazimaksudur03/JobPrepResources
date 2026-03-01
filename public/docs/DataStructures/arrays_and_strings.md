# Arrays and Strings

Arrays and strings are the most fundamental data structures used in programming and are commonly tested in technical interviews.

## **Arrays**

An array is a collection of elements stored in contiguous memory locations, accessed by index.

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| Access by index | O(1) | Direct access using index |
| Search (unsorted) | O(n) | Linear scan through elements |
| Search (sorted) | O(log n) | Binary search |
| Insert at end | O(1) amortized | Append to dynamic array |
| Insert at index | O(n) | Shift elements to make space |
| Delete at index | O(n) | Shift elements to fill gap |
| Delete at end | O(1) | Remove last element |

### Common Array Techniques

| Technique | Description | Use Case |
|-----------|-------------|----------|
| Two Pointers | Use two indices to traverse | Sorted arrays, pair finding |
| Sliding Window | Maintain a window over elements | Subarray problems, max/min in range |
| Prefix Sum | Precompute cumulative sums | Range sum queries |
| Kadane's Algorithm | Track max subarray sum | Maximum subarray problem |
| Dutch National Flag | Three-way partitioning | Sorting with 3 categories |

### Two Pointers Example

```python
# Find if a sorted array has a pair that sums to target
def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        current_sum = arr[left] + arr[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return []
```

### Sliding Window Example

```python
# Find maximum sum subarray of size k
def max_sum_subarray(arr, k):
    window_sum = sum(arr[:k])
    max_sum = window_sum
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum
```

## **Strings**

Strings are sequences of characters, often treated as arrays of characters.

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| Access character | O(1) | By index |
| Concatenation | O(n + m) | Joining two strings |
| Substring | O(k) | Extracting k characters |
| Search (naive) | O(n × m) | Finding pattern in text |
| Search (KMP) | O(n + m) | Optimized pattern matching |
| Compare | O(min(n, m)) | Lexicographic comparison |

### Common String Techniques

| Technique | Description | Use Case |
|-----------|-------------|----------|
| Character frequency map | Count occurrences of each character | Anagrams, duplicates |
| StringBuilder | Efficient string building | Avoiding repeated concatenation |
| Reverse | Reverse characters in place | Palindrome check |
| KMP Algorithm | Efficient pattern matching | Substring search |
| Rabin-Karp | Hash-based pattern matching | Multiple pattern search |

### Palindrome Check

```python
def is_palindrome(s):
    s = s.lower()
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True
```

### Anagram Check

```python
from collections import Counter

def is_anagram(s1, s2):
    return Counter(s1) == Counter(s2)
```

## **Key Interview Problems**

| Problem | Approach | Complexity |
|---------|----------|------------|
| Two Sum | Hash map | O(n) |
| Best Time to Buy/Sell Stock | Single pass, track min | O(n) |
| Maximum Subarray | Kadane's algorithm | O(n) |
| Contains Duplicate | Hash set | O(n) |
| Valid Anagram | Character count | O(n) |
| Longest Substring Without Repeating Chars | Sliding window + set | O(n) |
| Reverse String | Two pointers | O(n) |
| String to Integer (atoi) | Parse character by character | O(n) |
