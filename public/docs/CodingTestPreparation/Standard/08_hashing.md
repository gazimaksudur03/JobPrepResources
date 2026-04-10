# Hashing

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

Hashing is one of the most powerful tools in a programmer's arsenal for coding interviews. At its core, hashing transforms a key (such as an integer, string, or any comparable object) into an index in an array through a **hash function**, enabling near-constant-time lookups, insertions, and deletions. The C++ Standard Library provides `std::unordered_map` and `std::unordered_set` as hash-table-based containers, and understanding when and how to use them is critical for solving interview problems efficiently.

The magic of hashing lies in amortized O(1) average-case performance for fundamental operations. Compare this to balanced BST-based `std::map` and `std::set`, which guarantee O(log n) per operation. In interview settings, the difference between an O(n log n) solution and an O(n) solution often comes down to reaching for a hash map instead of a tree-based map. However, hashing is not without trade-offs: worst-case performance degrades to O(n) if many keys collide, and hash tables do not maintain sorted order.

This topic covers how hash functions work, how collisions are handled, and the most common hashing patterns you'll encounter in interviews — frequency counting, group-by-key, and the classic two-sum lookup pattern. Mastering these patterns will let you recognize when hashing is the right tool and apply it confidently.

## Key Concepts

### Hash Functions

A hash function maps a key to an integer (the hash code), which is then reduced to an array index via modulo: `index = hash(key) % table_size`. A good hash function distributes keys uniformly across the table to minimize collisions.

For built-in types, C++ provides `std::hash<T>` specializations:

```cpp
#include <functional>

std::hash<int> intHash;
std::hash<std::string> strHash;

size_t h1 = intHash(42);            // hash of integer
size_t h2 = strHash("hello");       // hash of string
```

For custom types, you must define your own hash by specializing `std::hash` or providing a functor:

```cpp
struct PairHash {
    size_t operator()(const std::pair<int,int>& p) const {
        auto h1 = std::hash<int>{}(p.first);
        auto h2 = std::hash<int>{}(p.second);
        return h1 ^ (h2 << 1);
    }
};

std::unordered_set<std::pair<int,int>, PairHash> seen;
```

### Collision Handling

When two different keys produce the same index, a **collision** occurs. The two primary strategies are:

**Chaining (Separate Chaining):** Each bucket holds a linked list (or another container) of all entries that hash to that index. This is what `std::unordered_map` uses internally. Lookups walk the chain at the target bucket, so performance degrades if chains grow long.

**Open Addressing:** All entries live directly in the array. On collision, the algorithm probes for the next open slot using a probing sequence (linear probing, quadratic probing, or double hashing). Open addressing has better cache performance but is more complex to implement and degrades under high load factors.

```
Chaining example (table size = 4):

  Index 0: [("apple", 3)] -> [("grape", 7)]
  Index 1: [("banana", 5)]
  Index 2: (empty)
  Index 3: [("cherry", 2)]

Open Addressing (linear probing):

  Index 0: ("apple", 3)
  Index 1: ("grape", 7)   ← originally hashed to 0, probed to 1
  Index 2: ("banana", 5)
  Index 3: ("cherry", 2)
```

### std::unordered_map and std::unordered_set

```cpp
#include <unordered_map>
#include <unordered_set>

// Hash map: key-value pairs
std::unordered_map<std::string, int> freq;
freq["apple"] = 3;
freq["banana"]++;            // auto-initializes to 0, then increments to 1
if (freq.count("apple"))     // check existence: returns 0 or 1
    std::cout << freq["apple"];

// Hash set: unique keys only
std::unordered_set<int> seen;
seen.insert(5);
seen.insert(5);              // no effect, already present
if (seen.count(5))           // returns 1
    std::cout << "found";

// Iteration (order is NOT guaranteed)
for (auto& [key, val] : freq) {
    std::cout << key << ": " << val << "\n";
}
```

**Performance characteristics:**
| Operation | Average | Worst Case |
|-----------|---------|------------|
| Insert    | O(1)    | O(n)       |
| Lookup    | O(1)    | O(n)       |
| Delete    | O(1)    | O(n)       |

The worst case occurs when all keys collide into a single bucket. In practice with good hash functions, the average case dominates.

### Frequency Counting Pattern

The most common hashing pattern in interviews is counting occurrences:

```cpp
std::unordered_map<char, int> freq;
for (char c : s) {
    freq[c]++;
}
```

This runs in O(n) and gives you instant access to any character's count. Common uses: checking anagrams, finding the first non-repeating character, validating character constraints.

### Group-by-Key Pattern

Group elements that share a common derived key:

```cpp
std::unordered_map<std::string, std::vector<std::string>> groups;
for (const auto& word : words) {
    std::string key = computeKey(word);  // e.g., sorted version of the word
    groups[key].push_back(word);
}
```

### Two-Sum Lookup Pattern

Store complements in a hash map so that for each element you can check in O(1) whether the needed counterpart exists:

```cpp
std::unordered_map<int, int> seen;  // value -> index
for (int i = 0; i < nums.size(); i++) {
    int complement = target - nums[i];
    if (seen.count(complement)) {
        return {seen[complement], i};
    }
    seen[nums[i]] = i;
}
```

## Common Patterns

1. **Frequency Map → Constraint Check:** Build a frequency map, then iterate it to check conditions (e.g., all characters appear exactly twice, at most k distinct characters).

2. **Hash Set for O(1) Membership:** When you need to repeatedly ask "is X in the collection?", convert a list to an `unordered_set` first.

3. **Complement Lookup:** For pair-sum problems, store values (or their indices) in a map and look up `target - current` for each element.

4. **Canonical Key Grouping:** Map each element to a canonical form (sorted string, frequency signature, remainder class) and group into buckets.

5. **Sliding Window + Hash Map:** Combine a hash map tracking window contents with two-pointer sliding to answer substring or subarray questions in O(n).

6. **Index Tracking:** Store the index of each element's most recent occurrence to compute distances, detect duplicates within range k, etc.

---

## Practice Problems

### Problem 1: Two Sum

**Problem Statement**

Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`. You may assume that each input has exactly one solution, and you may not use the same element twice.

```
Input:  nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Explanation: nums[0] + nums[1] = 2 + 7 = 9

Input:  nums = [3, 2, 4], target = 6
Output: [1, 2]
```

**Approach**

The brute-force solution checks every pair in O(n²). We can do better by observing that for each number `nums[i]`, we need to find whether `target - nums[i]` already exists in the array. A hash map mapping value → index lets us answer this query in O(1). We iterate once, and for each element we first check whether its complement is in the map; if so, we return both indices. Otherwise, we store the current element and its index in the map. This gives us a single-pass O(n) algorithm.

**Pseudo-code**

```
function twoSum(nums, target):
    map = empty hash map  // value -> index
    for i = 0 to nums.length - 1:
        complement = target - nums[i]
        if complement in map:
            return [map[complement], i]
        map[nums[i]] = i
    return []  // no solution found (shouldn't happen per constraints)
```

**C++ Solution**

```cpp
#include <vector>
#include <unordered_map>

std::vector<int> twoSum(std::vector<int>& nums, int target) {
    std::unordered_map<int, int> seen;
    for (int i = 0; i < (int)nums.size(); i++) {
        int complement = target - nums[i];
        auto it = seen.find(complement);
        if (it != seen.end()) {
            return {it->second, i};
        }
        seen[nums[i]] = i;
    }
    return {};
}
```

**Complexity Analysis**

- **Time:** O(n) — single pass through the array, each hash map operation is O(1) amortized.
- **Space:** O(n) — in the worst case every element is stored in the map before finding the pair.

---

### Problem 2: Group Anagrams

**Problem Statement**

Given an array of strings `strs`, group the anagrams together. An anagram is a word formed by rearranging the letters of another word. You can return the answer in any order.

```
Input:  strs = ["eat","tea","tan","ate","nat","bat"]
Output: [["eat","tea","ate"],["tan","nat"],["bat"]]

Input:  strs = [""]
Output: [[""]]
```

**Approach**

Two strings are anagrams if and only if they produce the same string when their characters are sorted. We can use this sorted version as a canonical key. For each string, sort its characters and use the result as a key in a hash map whose values are vectors of the original strings. After processing all strings, the map's values are the anagram groups.

An alternative key (avoiding the O(k log k) sort per word) is a frequency-count string — count each character's frequency and encode it as `"#a_count#b_count#...#z_count"`. This makes key computation O(k) per word, where k is the word length, but the sorted approach is simpler and sufficient for interview purposes.

**Pseudo-code**

```
function groupAnagrams(strs):
    groups = empty hash map  // sorted_string -> list of strings
    for each word in strs:
        key = sort(word)
        groups[key].append(word)
    return all values in groups as a list of lists
```

**C++ Solution**

```cpp
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>

std::vector<std::vector<std::string>> groupAnagrams(std::vector<std::string>& strs) {
    std::unordered_map<std::string, std::vector<std::string>> groups;
    for (const auto& s : strs) {
        std::string key = s;
        std::sort(key.begin(), key.end());
        groups[key].push_back(s);
    }

    std::vector<std::vector<std::string>> result;
    result.reserve(groups.size());
    for (auto& [key, group] : groups) {
        result.push_back(std::move(group));
    }
    return result;
}
```

**Complexity Analysis**

- **Time:** O(n · k log k) where n is the number of strings and k is the maximum string length. Sorting each string costs O(k log k).
- **Space:** O(n · k) — storing all strings in the hash map.

---

### Problem 3: Longest Consecutive Sequence

**Problem Statement**

Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence. Your algorithm must run in O(n) time.

```
Input:  nums = [100, 4, 200, 1, 3, 2]
Output: 4
Explanation: The longest consecutive sequence is [1, 2, 3, 4].

Input:  nums = [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]
Output: 9
```

**Approach**

Sorting would give O(n log n), but we need O(n). The key insight is to use a hash set for O(1) lookups. First, insert all numbers into an `unordered_set`. Then, for each number, check if it is the **start** of a sequence — that is, `num - 1` is NOT in the set. If it is a start, extend forward (`num + 1`, `num + 2`, ...) counting how long the sequence goes. This ensures each number is visited at most twice (once when inserted, once when extended through), giving O(n) overall.

**Pseudo-code**

```
function longestConsecutive(nums):
    numSet = set(nums)
    longest = 0
    for num in numSet:
        if (num - 1) not in numSet:   // this is the start of a sequence
            current = num
            streak = 1
            while (current + 1) in numSet:
                current += 1
                streak += 1
            longest = max(longest, streak)
    return longest
```

**C++ Solution**

```cpp
#include <vector>
#include <unordered_set>
#include <algorithm>

int longestConsecutive(std::vector<int>& nums) {
    std::unordered_set<int> numSet(nums.begin(), nums.end());
    int longest = 0;

    for (int num : numSet) {
        if (numSet.count(num - 1) == 0) {
            int current = num;
            int streak = 1;
            while (numSet.count(current + 1)) {
                current++;
                streak++;
            }
            longest = std::max(longest, streak);
        }
    }
    return longest;
}
```

**Complexity Analysis**

- **Time:** O(n) — each element is visited at most twice: once in the outer loop and at most once as part of a streak extension. The "start of sequence" check guarantees we don't re-traverse elements that belong to a sequence we've already counted.
- **Space:** O(n) — for the hash set storing all elements.

---

## Practice Resources

- [LeetCode 1 — Two Sum](https://leetcode.com/problems/two-sum/) — The classic hash map warm-up
- [LeetCode 49 — Group Anagrams](https://leetcode.com/problems/group-anagrams/) — Canonical key grouping
- [LeetCode 128 — Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/) — Hash set with clever iteration
- [LeetCode 217 — Contains Duplicate](https://leetcode.com/problems/contains-duplicate/) — Hash set membership basics
- [GeeksforGeeks — Hashing Data Structure](https://www.geeksforgeeks.org/hashing-data-structure/) — Comprehensive theory reference

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: Greedy Basics →](/docs/CodingTestPreparation/Standard/09_greedy_basics)
