# Two Pointers

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

The two-pointer technique is a strategy for solving array and string problems by maintaining two indices that move through the data in a coordinated way. It transforms brute-force O(n²) solutions into elegant O(n) solutions by exploiting the structure of the input — usually that it is sorted, or that the pointers can only move in one direction.

The beauty of two pointers lies in its simplicity: by carefully choosing when to advance which pointer, you systematically eliminate portions of the search space. For a sorted array, if the sum of elements at the two pointers is too small, you know everything involving the left pointer with a smaller right pointer is also too small — so you advance the left pointer. This kind of reasoning, where a single comparison eliminates many possibilities, is what makes two pointers so powerful.

There are three main variants of two pointers. **Opposite-end pointers** start at both ends and move inward — used for pair-sum problems and container problems. **Same-direction pointers** (also called the fast-slow technique) start at the same end and move in the same direction at different speeds — used for removing elements, deduplication, and linked list problems. **Partitioning pointers** rearrange elements in-place based on some criterion, like the Dutch National Flag problem.

## Key Concepts

### Opposite-End Pointers

Two pointers start at the beginning and end of a sorted array and move toward each other. The key insight is that moving the left pointer right increases the value, while moving the right pointer left decreases it.

```cpp
// Two Sum on sorted array — O(n) instead of O(n²)
std::vector<int> twoSum(std::vector<int>& nums, int target) {
    int left = 0, right = (int)nums.size() - 1;

    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target)
            return {left, right};
        else if (sum < target)
            ++left;    // need a larger sum
        else
            --right;   // need a smaller sum
    }
    return {}; // no solution
}
```

Why this works with correctness: Consider the n × n matrix of all pairs. The sorted property means each row increases left-to-right and each column increases top-to-bottom. The two pointers trace a path from the top-right corner, eliminating an entire row or column at each step.

### Same-Direction Pointers

Both pointers start at the beginning. The "slow" pointer marks the position where the next valid element should go, while the "fast" pointer scans through the array.

```cpp
// Remove all occurrences of val in-place
int removeElement(std::vector<int>& nums, int val) {
    int slow = 0;
    for (int fast = 0; fast < (int)nums.size(); ++fast) {
        if (nums[fast] != val) {
            nums[slow] = nums[fast];
            ++slow;
        }
    }
    return slow; // new length
}
```

The slow pointer always points to the next "write" position. The fast pointer reads every element. When the fast pointer finds a valid element, it copies it to the slow position and both advance. When it finds an invalid element, only the fast pointer advances.

### Fast-Slow Pointers (Linked Lists)

A special case of same-direction pointers used primarily in linked lists for cycle detection, finding the middle node, and finding the kth-from-end node.

```cpp
// Find middle of linked list
ListNode* findMiddle(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow; // middle node (or second middle if even length)
}
```

### Partitioning

Rearrange elements so that all elements satisfying a condition come before those that don't. This is the core of quicksort's partition step.

```cpp
// Partition around pivot (Lomuto scheme)
int partition(std::vector<int>& arr, int lo, int hi) {
    int pivot = arr[hi];
    int i = lo;
    for (int j = lo; j < hi; ++j) {
        if (arr[j] < pivot) {
            std::swap(arr[i], arr[j]);
            ++i;
        }
    }
    std::swap(arr[i], arr[hi]);
    return i;
}
```

### Merging Sorted Arrays

Two pointers, one in each array, merge two sorted sequences into one sorted sequence. This is the merge step in merge sort.

```cpp
std::vector<int> merge(const std::vector<int>& a, const std::vector<int>& b) {
    std::vector<int> result;
    int i = 0, j = 0;
    while (i < (int)a.size() && j < (int)b.size()) {
        if (a[i] <= b[j]) result.push_back(a[i++]);
        else result.push_back(b[j++]);
    }
    while (i < (int)a.size()) result.push_back(a[i++]);
    while (j < (int)b.size()) result.push_back(b[j++]);
    return result;
}
```

## Common Patterns

### Sorted Array + Pair Target
When you need to find pairs in a sorted array with a specific sum/difference, opposite-end pointers give O(n) time.

### In-Place Array Modification
Same-direction pointers (read/write) handle removing duplicates, removing specific values, and compacting arrays without extra space.

### Three Pointers / Dutch National Flag
For problems with three categories (like sorting 0s, 1s, 2s), use three pointers: `lo` for next 0 position, `hi` for next 2 position, `mid` scans through.

### Palindrome Check
Use opposite-end pointers comparing characters from both ends moving inward. Skip non-alphanumeric characters for "valid palindrome" problems.

### Trapping Rain Water
Use left and right pointers with left_max and right_max tracking. Move the pointer with the smaller max inward.

---

## Practice Problems

### Problem 1: Two Sum II — Input Array Is Sorted

**Problem Statement**

Given a 1-indexed array of integers `numbers` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific `target` number. Return the indices of the two numbers (1-indexed) as an array `[index1, index2]` where `index1 < index2`. There is exactly one solution, and you may not use the same element twice.

Input: `numbers = [2,7,11,15]`, `target = 9`
Output: `[1, 2]`

Input: `numbers = [2,3,4]`, `target = 6`
Output: `[1, 3]`

Input: `numbers = [-1,0]`, `target = -1`
Output: `[1, 2]`

**Approach**

Place one pointer at the start and one at the end. Calculate the sum:
- If the sum equals the target, return both indices (adjusted to 1-indexed).
- If the sum is too small, the left pointer moves right to increase the sum.
- If the sum is too large, the right pointer moves left to decrease the sum.

Each step eliminates either the current left value or the current right value from consideration, guaranteeing termination in at most n steps.

**Pseudo-code**

```
function twoSum(numbers, target):
    left = 0
    right = numbers.size - 1

    while left < right:
        sum = numbers[left] + numbers[right]
        if sum == target:
            return [left + 1, right + 1]
        else if sum < target:
            left++
        else:
            right--

    return [] // unreachable if solution guaranteed
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>

std::vector<int> twoSum(std::vector<int>& numbers, int target) {
    int left = 0, right = (int)numbers.size() - 1;

    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target)
            return {left + 1, right + 1};
        else if (sum < target)
            ++left;
        else
            --right;
    }

    return {};
}

int main() {
    std::vector<int> nums1 = {2, 7, 11, 15};
    auto res1 = twoSum(nums1, 9);
    std::cout << "[" << res1[0] << ", " << res1[1] << "]" << std::endl;  // [1, 2]

    std::vector<int> nums2 = {2, 3, 4};
    auto res2 = twoSum(nums2, 6);
    std::cout << "[" << res2[0] << ", " << res2[1] << "]" << std::endl;  // [1, 3]

    std::vector<int> nums3 = {-1, 0};
    auto res3 = twoSum(nums3, -1);
    std::cout << "[" << res3[0] << ", " << res3[1] << "]" << std::endl;  // [1, 2]

    return 0;
}
```

**Complexity Analysis**

- **Time:** O(n) — each pointer moves at most n times total
- **Space:** O(1)

---

### Problem 2: Container With Most Water

**Problem Statement**

Given `n` non-negative integers `height[0], height[1], ..., height[n-1]` where each represents a point at coordinate `(i, height[i])`, find two lines that together with the x-axis form a container that holds the most water.

Input: `height = [1,8,6,2,5,4,8,3,7]`
Output: `49` (between index 1 and index 8: min(8,7) × (8-1) = 49)

Input: `height = [1,1]`
Output: `1`

**Approach**

Start with the widest container (left = 0, right = n-1). The area is `min(height[left], height[right]) × (right - left)`. To potentially find a larger container, we must increase the height — so move the pointer with the smaller height inward.

Why move the shorter line? The area is limited by the shorter line. Moving the taller line inward can only decrease the width without any guarantee of increasing the height that matters (the minimum). Moving the shorter line has a chance of finding a taller line that increases the limiting height.

**Pseudo-code**

```
function maxArea(height):
    left = 0, right = height.size - 1
    maxWater = 0

    while left < right:
        width = right - left
        h = min(height[left], height[right])
        maxWater = max(maxWater, width * h)

        if height[left] < height[right]:
            left++
        else:
            right--

    return maxWater
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int maxArea(std::vector<int>& height) {
    int left = 0, right = (int)height.size() - 1;
    int maxWater = 0;

    while (left < right) {
        int width = right - left;
        int h = std::min(height[left], height[right]);
        maxWater = std::max(maxWater, width * h);

        if (height[left] < height[right])
            ++left;
        else
            --right;
    }

    return maxWater;
}

int main() {
    std::vector<int> h1 = {1, 8, 6, 2, 5, 4, 8, 3, 7};
    std::cout << maxArea(h1) << std::endl;  // 49

    std::vector<int> h2 = {1, 1};
    std::cout << maxArea(h2) << std::endl;  // 1
    return 0;
}
```

**Complexity Analysis**

- **Time:** O(n) — each step moves one pointer inward, so at most n-1 steps
- **Space:** O(1)

---

### Problem 3: Move Zeroes to End

**Problem Statement**

Given an integer array `nums`, move all `0`s to the end while maintaining the relative order of the non-zero elements. You must do this in-place without making a copy of the array.

Input: `nums = [0,1,0,3,12]`
Output: `[1,3,12,0,0]`

Input: `nums = [0]`
Output: `[0]`

**Approach**

Use same-direction two pointers (read/write pattern). The "write" pointer (`slow`) tracks where the next non-zero element should be placed. The "read" pointer (`fast`) scans the array. When a non-zero element is found, swap it with the element at the write position.

Swapping (instead of just overwriting) ensures that zeros accumulate at the end. After the fast pointer finishes, all elements from `slow` to the end are zeros.

**Pseudo-code**

```
function moveZeroes(nums):
    slow = 0

    for fast from 0 to nums.size - 1:
        if nums[fast] != 0:
            swap(nums[slow], nums[fast])
            slow++
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

void moveZeroes(std::vector<int>& nums) {
    int slow = 0;
    for (int fast = 0; fast < (int)nums.size(); ++fast) {
        if (nums[fast] != 0) {
            std::swap(nums[slow], nums[fast]);
            ++slow;
        }
    }
}

int main() {
    std::vector<int> nums1 = {0, 1, 0, 3, 12};
    moveZeroes(nums1);
    for (int x : nums1) std::cout << x << " ";  // 1 3 12 0 0
    std::cout << std::endl;

    std::vector<int> nums2 = {0};
    moveZeroes(nums2);
    for (int x : nums2) std::cout << x << " ";  // 0
    std::cout << std::endl;

    std::vector<int> nums3 = {1, 0, 0, 0, 2, 3};
    moveZeroes(nums3);
    for (int x : nums3) std::cout << x << " ";  // 1 2 3 0 0 0
    std::cout << std::endl;

    return 0;
}
```

**Complexity Analysis**

- **Time:** O(n) — single pass through the array
- **Space:** O(1) — in-place with only pointer variables

---

## Practice Resources

- [Two Sum II — LeetCode #167](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)
- [Container With Most Water — LeetCode #11](https://leetcode.com/problems/container-with-most-water/)
- [Move Zeroes — LeetCode #283](https://leetcode.com/problems/move-zeroes/)
- [Two Pointer Technique — GeeksforGeeks](https://www.geeksforgeeks.org/two-pointers-technique/)
- [3Sum — LeetCode #15](https://leetcode.com/problems/3sum/) (extends two pointers to three)

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: Sliding Window →](/docs/CodingTestPreparation/Standard/07_sliding_window)
