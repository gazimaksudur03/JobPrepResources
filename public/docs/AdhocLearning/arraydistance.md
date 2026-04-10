### The Algorithmic Execution Pipeline

#### Phase 1: Exploration (The "Brainstorming" Phase)
*Do not start typing code yet. Use a scratchpad.*

1.  **Constraint Analysis:**
    *   **Look at $N$:** If $N \le 100$, $O(N^3)$ is fine. If $N \le 10^5$, you need $O(N \log N)$ or $O(N)$.
    *   **Range of Values:** Are the values negative? Can they be used as array indices (frequency array)?
2.  **Simplify the Math:**
    *   Write the objective function out. 
    *   **Algebraic Reduction:** Use algebra to cancel out terms (like you did with the distance formula). Can you simplify the requirement to a single variable or a pair?
3.  **Brute Force (The "Baseline"):**
    *   Always identify the simplest possible $O(N^2)$ or $O(N^3)$ solution. This provides a "ground truth" to check your optimized logic against.

#### Phase 2: Pattern Identification (The "Strategy" Phase)
*Ask yourself these three questions:*

1.  **Do I need the history?**
    *   If the current state only depends on the *previous* state, you can use a variable.
    *   If it depends on *all* previous occurrences, use a `map`, `unordered_map`, or `frequency array`.
2.  **Is there a greedy property?**
    *   Can I make a local optimal choice (like picking the three most recent indices) that leads to a global optimum?
3.  **Is it a sliding window or a two-pointer problem?**
    *   Do I need to maintain a subset of the array that satisfies a condition?

#### Phase 3: The Documented Code Structure
When you write your code, use this template to make it maintainable and clear to interviewers:

```cpp
/**
 * PROBLEM ANALYSIS:
 * 1. Complexity Goal: O(N) time, O(N) space.
 * 2. Key Insight: Formula abs(i-j) + abs(j-k) + abs(k-i) simplifies to 2*(k-i).
 *    To minimize this, we only need to track the two most recent indices.
 */
class Solution {
public:
    int solve(vector<int>& nums) {
        // Step 1: Initialize data structures
        // [Use descriptive names]
        
        // Step 2: Edge Case Handling
        if (nums.size() < 3) return -1;
        
        // Step 3: Core Logic Loop
        for (int i = 0; i < nums.size(); ++i) {
            // Logic here
        }
        
        // Step 4: Final Return
        return result;
    }
};
```

#### Phase 4: Refinement (The "Optimization" Phase)
*Before finishing, review these three things:*

1.  **Space Trade-offs:** Can you replace a `map<int, vector<int>>` with an `unordered_map<int, pair<int, int>>`? (This is usually faster and uses less memory).
2.  **Readability vs. Conciseness:** Do not use `a`, `b`, `c` for variables. Use `current_index`, `last_occurrence`, `min_distance`.
3.  **The "Dry Run":** Take a small example (like `[1, 2, 1, 1, 3]`) and trace it line-by-line with the values. If your logic breaks here, it will break in production.

---

### How to Practice This Flow
To improve, follow the **"1-2-3 Method"** for every problem you solve:

1.  **The 1st Pass:** Solve it however you can (brute force is fine).
2.  **The 2nd Pass (Optimization):** Look at the constraints. Can you optimize the space? Can you reduce the number of passes through the array? **Document the "Why" in your code comments.**
3.  **The 3rd Pass (Clean-up):** Rewrite the solution to be as clean as possible. Remove unnecessary variables. Ensure variable names are self-documenting.

### Summary Checklist for your next problem:
- [ ] **Did I write the formula down on paper?**
- [ ] **Did I verify the constraints ($N$)?**
- [ ] **Is the logic greedy? (Can I just track the last $X$ occurrences?)**
- [ ] **Are my variables descriptive?**
- [ ] **Did I handle the "no solution" case?**

By adopting this structure, you shift from "guessing" the code to "engineering" a solution, which is exactly what top-tier software engineers do.