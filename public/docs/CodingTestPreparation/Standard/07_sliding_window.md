# Sliding Window

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

The sliding window technique maintains a "window" — a contiguous subarray or substring — that slides over the data. Instead of recalculating everything from scratch for each possible window position, you incrementally update the window by adding one element on the right and potentially removing one or more on the left. This converts O(n × k) or O(n²) brute-force approaches into O(n) solutions.

There are two primary variants. **Fixed-size windows** have a predetermined width k: you slide the window one position at a time, adding the new element and removing the expired one. This is straightforward and typically used for problems like "maximum sum of subarray of size k" or "moving average." **Variable-size windows** grow and shrink dynamically: the right boundary expands to include more elements, and the left boundary contracts when a constraint is violated. These are more challenging and appear in problems like "longest substring without repeating characters" and "minimum window substring."

The key insight behind sliding window is that if the current window satisfies or violates a condition, you often don't need to re-examine elements that are already part of the window. By maintaining auxiliary data structures (counters, hash maps, deques) that track the window's state, you process each element at most twice — once when it enters the window and once when it leaves.

## Key Concepts

### Fixed-Size Window

Maintain a window of exactly `k` elements. When the window slides right by one position, add the new element and remove the leftmost element.

```cpp
// Maximum sum of subarray of size k
int maxSumFixedWindow(const std::vector<int>& arr, int k) {
    int n = arr.size();
    if (n < k) return -1;

    int windowSum = 0;
    for (int i = 0; i < k; ++i)
        windowSum += arr[i];

    int maxSum = windowSum;
    for (int i = k; i < n; ++i) {
        windowSum += arr[i] - arr[i - k]; // add new, remove old
        maxSum = std::max(maxSum, windowSum);
    }
    return maxSum;
}
```

### Variable-Size Window

Use two pointers (`left` and `right`) that define the current window `[left, right]`. Expand `right` to grow the window, and shrink by advancing `left` when a constraint is violated.

General template:

```cpp
int left = 0;
// state variables (e.g., hash map, count)

for (int right = 0; right < n; ++right) {
    // Add arr[right] to the window state

    while (/* window violates constraint */) {
        // Remove arr[left] from the window state
        ++left;
    }

    // Update answer based on current valid window [left, right]
}
```

The outer loop processes each element once (as it enters), and the inner while loop processes each element at most once (as it leaves). Total work: O(n).

### Window with Constraints

Many problems define constraints on the window content: no repeated characters, at most k distinct elements, sum ≤ target, etc. The pattern is always the same:

1. Expand the window by including the right element
2. Check if the constraint is violated
3. Shrink from the left until the constraint is restored
4. Record the answer (either during expansion or after shrinking)

### Sliding Window with Hash Map

Hash maps are the most common auxiliary data structure for sliding windows. They track character frequencies, element counts, or last-seen positions.

```cpp
#include <unordered_map>

// Track character frequencies in the current window
std::unordered_map<char, int> freq;

// Add character
freq[c]++;

// Remove character
freq[c]--;
if (freq[c] == 0) freq.erase(c);
```

### Maximum/Minimum in Sliding Window

Finding the max or min within a sliding window efficiently requires a **monotonic deque** — a deque that maintains elements in sorted order. This gives O(1) per query and O(n) total time.

```cpp
#include <deque>

// Maximum in each window of size k
std::vector<int> maxSlidingWindow(const std::vector<int>& nums, int k) {
    std::deque<int> dq; // stores indices, front is always the max
    std::vector<int> result;

    for (int i = 0; i < (int)nums.size(); ++i) {
        // Remove indices outside the window
        while (!dq.empty() && dq.front() <= i - k)
            dq.pop_front();

        // Remove elements smaller than current (they can never be the max)
        while (!dq.empty() && nums[dq.back()] <= nums[i])
            dq.pop_back();

        dq.push_back(i);

        if (i >= k - 1)
            result.push_back(nums[dq.front()]);
    }
    return result;
}
```

## Common Patterns

### Fixed Window for Aggregate Queries
When the window size is given, compute the initial window, then slide by adding/removing one element. Works for sum, product, count, average.

### Shrinkable Window for "Longest" Problems
"Longest substring/subarray with constraint X" → expand right freely, shrink left when constraint breaks, track max window size.

### Expandable Window for "Shortest" Problems
"Shortest/minimum window with property Y" → expand until property is satisfied, then shrink from left while still valid, track min window size.

### Two Hash Maps for Substring Matching
For "minimum window substring" type problems, use one map for the target pattern and one for the current window. Track how many characters are "satisfied" to avoid comparing maps on every step.

### Sliding Window + Binary Search
Some problems combine a sliding window with binary search on the answer (e.g., "longest subarray with max-min ≤ k").

---

## Practice Problems

### Problem 1: Maximum Sum Subarray of Size K

**Problem Statement**

Given an array of integers `nums` and a positive integer `k`, find the maximum sum of any contiguous subarray of size `k`.

Input: `nums = [2, 1, 5, 1, 3, 2]`, `k = 3`
Output: `9` (subarray [5, 1, 3])

Input: `nums = [2, 3, 4, 1, 5]`, `k = 2`
Output: `7` (subarray [2, 5]... actually [4, 1] = 5, [1, 5] = 6... wait: [3, 4] = 7)

Input: `nums = [1, 1, 1, 1, 1]`, `k = 3`
Output: `3`

**Approach**

This is the purest form of the fixed-size sliding window. Compute the sum of the first `k` elements. Then, for each subsequent position, add the new element entering the window and subtract the element leaving the window. Track the maximum sum seen.

No inner loop is needed — each element is processed exactly once, making this O(n) regardless of the window size.

**Pseudo-code**

```
function maxSumSubarray(nums, k):
    windowSum = sum of nums[0..k-1]
    maxSum = windowSum

    for i from k to nums.size - 1:
        windowSum += nums[i] - nums[i - k]
        maxSum = max(maxSum, windowSum)

    return maxSum
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int maxSumSubarray(const std::vector<int>& nums, int k) {
    int n = nums.size();
    if (n < k) return -1;

    int windowSum = 0;
    for (int i = 0; i < k; ++i)
        windowSum += nums[i];

    int maxSum = windowSum;

    for (int i = k; i < n; ++i) {
        windowSum += nums[i] - nums[i - k];
        maxSum = std::max(maxSum, windowSum);
    }

    return maxSum;
}

int main() {
    std::vector<int> nums1 = {2, 1, 5, 1, 3, 2};
    std::cout << maxSumSubarray(nums1, 3) << std::endl;  // 9

    std::vector<int> nums2 = {2, 3, 4, 1, 5};
    std::cout << maxSumSubarray(nums2, 2) << std::endl;  // 7

    std::vector<int> nums3 = {1, 1, 1, 1, 1};
    std::cout << maxSumSubarray(nums3, 3) << std::endl;  // 3
    return 0;
}
```

**Complexity Analysis**

- **Time:** O(n) — single pass after the initial window setup
- **Space:** O(1) — only tracking the current sum and max

---

### Problem 2: Longest Substring Without Repeating Characters

**Problem Statement**

Given a string `s`, find the length of the longest substring without repeating characters.

Input: `s = "abcabcbb"`
Output: `3` ("abc")

Input: `s = "bbbbb"`
Output: `1` ("b")

Input: `s = "pwwkew"`
Output: `3` ("wke")

**Approach**

Use a variable-size sliding window with a hash map that tracks the last seen index of each character. Expand the window by moving `right`. If the character at `right` was seen before and its last position is within the current window (≥ `left`), shrink the window by moving `left` to one past the last occurrence. At each step, update the maximum length.

This avoids the need for an inner while loop — by jumping `left` directly to the correct position, we skip over characters that we would otherwise remove one by one.

**Pseudo-code**

```
function lengthOfLongestSubstring(s):
    lastSeen = hash map (char → index)
    left = 0
    maxLen = 0

    for right from 0 to s.length - 1:
        if s[right] in lastSeen and lastSeen[s[right]] >= left:
            left = lastSeen[s[right]] + 1

        lastSeen[s[right]] = right
        maxLen = max(maxLen, right - left + 1)

    return maxLen
```

**C++ Solution**

```cpp
#include <iostream>
#include <string>
#include <unordered_map>
#include <algorithm>

int lengthOfLongestSubstring(const std::string& s) {
    std::unordered_map<char, int> lastSeen;
    int left = 0;
    int maxLen = 0;

    for (int right = 0; right < (int)s.size(); ++right) {
        char c = s[right];
        if (lastSeen.count(c) && lastSeen[c] >= left)
            left = lastSeen[c] + 1;

        lastSeen[c] = right;
        maxLen = std::max(maxLen, right - left + 1);
    }

    return maxLen;
}

int main() {
    std::cout << lengthOfLongestSubstring("abcabcbb") << std::endl;  // 3
    std::cout << lengthOfLongestSubstring("bbbbb") << std::endl;     // 1
    std::cout << lengthOfLongestSubstring("pwwkew") << std::endl;    // 3
    std::cout << lengthOfLongestSubstring("") << std::endl;          // 0
    return 0;
}
```

**Complexity Analysis**

- **Time:** O(n) — each character is visited once by the right pointer; the left pointer only moves forward
- **Space:** O(min(n, m)) where m is the character set size (at most 128 for ASCII)

---

### Problem 3: Minimum Window Substring

**Problem Statement**

Given two strings `s` and `t`, return the minimum window substring of `s` that contains all characters of `t` (including duplicates). If no such substring exists, return an empty string. If there are multiple minimum-length windows, return the one that appears first.

Input: `s = "ADOBECODEBANC"`, `t = "ABC"`
Output: `"BANC"`

Input: `s = "a"`, `t = "a"`
Output: `"a"`

Input: `s = "a"`, `t = "aa"`
Output: `""` (not enough 'a's)

**Approach**

Use two hash maps: one for the target character counts (`need`) and one for the current window's character counts (`have`). Maintain a counter `formed` that tracks how many unique characters in `t` have their required frequency met in the current window.

Expand the window by moving `right`. When all characters are satisfied (`formed == required`), try to shrink from the left to find the minimum valid window. This is the "expand then contract" pattern — the most important variable-size window pattern.

**Pseudo-code**

```
function minWindow(s, t):
    need = frequency map of t
    required = number of unique chars in t
    have = empty frequency map
    formed = 0
    left = 0
    bestLen = infinity, bestLeft = 0

    for right from 0 to s.length - 1:
        c = s[right]
        have[c]++
        if c in need and have[c] == need[c]:
            formed++

        while formed == required:
            // update best if current window is smaller
            if right - left + 1 < bestLen:
                bestLen = right - left + 1
                bestLeft = left

            // shrink from left
            leftChar = s[left]
            have[leftChar]--
            if leftChar in need and have[leftChar] < need[leftChar]:
                formed--
            left++

    return bestLen == infinity ? "" : s.substr(bestLeft, bestLen)
```

**C++ Solution**

```cpp
#include <iostream>
#include <string>
#include <unordered_map>
#include <climits>

std::string minWindow(const std::string& s, const std::string& t) {
    if (s.empty() || t.empty() || s.size() < t.size()) return "";

    std::unordered_map<char, int> need, have;
    for (char c : t) need[c]++;

    int required = need.size(); // unique chars that must be satisfied
    int formed = 0;
    int left = 0;
    int bestLen = INT_MAX, bestLeft = 0;

    for (int right = 0; right < (int)s.size(); ++right) {
        char c = s[right];
        have[c]++;

        if (need.count(c) && have[c] == need[c])
            ++formed;

        while (formed == required) {
            int windowLen = right - left + 1;
            if (windowLen < bestLen) {
                bestLen = windowLen;
                bestLeft = left;
            }

            char leftChar = s[left];
            have[leftChar]--;
            if (need.count(leftChar) && have[leftChar] < need[leftChar])
                --formed;
            ++left;
        }
    }

    return bestLen == INT_MAX ? "" : s.substr(bestLeft, bestLen);
}

int main() {
    std::cout << minWindow("ADOBECODEBANC", "ABC") << std::endl;  // BANC
    std::cout << minWindow("a", "a") << std::endl;                 // a
    std::cout << minWindow("a", "aa") << std::endl;                // (empty)
    return 0;
}
```

**Complexity Analysis**

- **Time:** O(|s| + |t|) — building the `need` map takes O(|t|); the sliding window processes each character of `s` at most twice (once by `right`, once by `left`)
- **Space:** O(|s| + |t|) in the worst case for the hash maps (bounded by the character set size in practice)

---

## Practice Resources

- [Maximum Sum Subarray of Size K — GeeksforGeeks](https://www.geeksforgeeks.org/find-maximum-minimum-sum-subarray-size-k/)
- [Longest Substring Without Repeating Characters — LeetCode #3](https://leetcode.com/problems/longest-substring-without-repeating-characters/)
- [Minimum Window Substring — LeetCode #76](https://leetcode.com/problems/minimum-window-substring/)
- [Sliding Window Maximum — LeetCode #239](https://leetcode.com/problems/sliding-window-maximum/)
- [Sliding Window Technique — GeeksforGeeks](https://www.geeksforgeeks.org/window-sliding-technique/)

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: Hashing →](/docs/CodingTestPreparation/Standard/08_hashing)
