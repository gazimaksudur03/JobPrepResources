# Combinatorics

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

Combinatorics is the mathematics of counting, and it appears in coding interviews and competitive programming whenever a problem asks "how many ways" or "count the number of." The challenge is rarely about understanding what needs to be counted — it is about counting it efficiently without enumerating every possibility. A brute-force approach that generates all permutations is O(N!) and fails instantly for N > 20; combinatorial formulas and identities reduce this to O(N) or O(N log N).

The foundational tools are permutations (nPr — ordered arrangements) and combinations (nCr — unordered selections). Pascal's triangle provides a way to compute nCr using only addition, while Fermat's little theorem enables O(log p) computation of nCr mod p using precomputed factorials. Beyond the basics, the inclusion-exclusion principle lets you count unions of overlapping sets, and generating functions provide an algebraic framework for solving complex counting problems.

Several named sequences appear repeatedly in competitive programming: Catalan numbers count valid parentheses sequences, binary trees, non-crossing partitions, and many other structures. Stirling numbers count partitions of sets into non-empty subsets. Derangements count permutations with no fixed points. The pigeonhole principle, while conceptually simple, provides powerful existence proofs. Mastering these concepts transforms seemingly impossible counting problems into straightforward formula applications.

## Key Concepts

### Permutations and Combinations

**Permutation (nPr):** The number of ways to arrange `r` items from `n` distinct items where order matters:

```
nPr = n! / (n - r)!
```

**Combination (nCr):** The number of ways to choose `r` items from `n` where order doesn't matter:

```
nCr = n! / (r! × (n - r)!)
```

Key identities:
- `nCr = nC(n-r)` — symmetry
- `nCr = (n-1)C(r-1) + (n-1)Cr` — Pascal's rule
- `sum of nCr for r=0..n = 2^n`
- `nCr × r! = nPr`

### Pascal's Triangle

Each entry is the sum of the two entries above it. Row `n` contains `nC0, nC1, ..., nCn`.

```cpp
vector<vector<long long>> pascal(int n, long long mod) {
    vector<vector<long long>> C(n + 1, vector<long long>(n + 1, 0));
    for (int i = 0; i <= n; i++) {
        C[i][0] = 1;
        for (int j = 1; j <= i; j++)
            C[i][j] = (C[i - 1][j - 1] + C[i - 1][j]) % mod;
    }
    return C;
}
```

This is O(N²) in time and space and works for any modulus (no inverse needed).

### Fast nCr with Factorial Precomputation

When the modulus `p` is prime, precompute factorials and their modular inverses:

```cpp
const int MAXN = 2000001;
const long long MOD = 1e9 + 7;
long long fact[MAXN], inv_fact[MAXN];

long long power(long long base, long long exp, long long mod) {
    long long result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) result = result * base % mod;
        base = base * base % mod;
        exp >>= 1;
    }
    return result;
}

void precompute() {
    fact[0] = 1;
    for (int i = 1; i < MAXN; i++)
        fact[i] = fact[i - 1] * i % MOD;
    inv_fact[MAXN - 1] = power(fact[MAXN - 1], MOD - 2, MOD);
    for (int i = MAXN - 2; i >= 0; i--)
        inv_fact[i] = inv_fact[i + 1] * (i + 1) % MOD;
}

long long nCr(int n, int r) {
    if (r < 0 || r > n) return 0;
    return fact[n] % MOD * inv_fact[r] % MOD * inv_fact[n - r] % MOD;
}
```

### Inclusion-Exclusion Principle

To count elements in the union of sets A₁, A₂, ..., Aₖ:

```
|A₁ ∪ A₂ ∪ ... ∪ Aₖ| = Σ|Aᵢ| - Σ|Aᵢ ∩ Aⱼ| + Σ|Aᵢ ∩ Aⱼ ∩ Aₖ| - ...
```

In code, iterate over all 2^k subsets using bitmasks. Add if the subset has odd size, subtract if even.

```cpp
long long inclusionExclusion(vector<long long>& sets, long long total) {
    int k = sets.size();
    long long result = 0;
    for (int mask = 1; mask < (1 << k); mask++) {
        long long inter = total;
        int bits = 0;
        for (int i = 0; i < k; i++) {
            if (mask & (1 << i)) {
                inter = inter / sets[i];  // problem-specific intersection
                bits++;
            }
        }
        if (bits % 2 == 1)
            result += inter;
        else
            result -= inter;
    }
    return result;
}
```

### Catalan Numbers

The n-th Catalan number counts:
- Valid parentheses sequences of length 2n
- Number of distinct binary search trees with n nodes
- Number of ways to triangulate a convex polygon with n+2 sides
- Number of non-crossing partitions of {1, ..., n}

```
C(n) = nCr(2n, n) / (n + 1) = nCr(2n, n) - nCr(2n, n + 1)
```

First few values: 1, 1, 2, 5, 14, 42, 132, 429, ...

Recurrence: `C(n) = Σ C(i) × C(n-1-i) for i = 0..n-1`, with `C(0) = 1`.

```cpp
long long catalan(int n) {
    return nCr(2 * n, n) % MOD * power(n + 1, MOD - 2, MOD) % MOD;
}
```

### Stirling Numbers

**Stirling numbers of the second kind** `S(n, k)` count the number of ways to partition a set of `n` elements into exactly `k` non-empty subsets.

```
S(n, k) = k × S(n-1, k) + S(n-1, k-1)
```

Base cases: `S(0, 0) = 1`, `S(n, 0) = 0` for n > 0, `S(n, n) = 1`.

### Derangements

A derangement is a permutation where no element appears in its original position. The number of derangements of n elements is:

```
D(n) = (n - 1) × (D(n-1) + D(n-2))
```

Base cases: `D(0) = 1`, `D(1) = 0`.

Closed form: `D(n) = n! × Σ (-1)^k / k! for k = 0..n`

Approximation: `D(n) ≈ n! / e` (rounded to the nearest integer).

```cpp
long long derangements(int n, long long mod) {
    if (n == 0) return 1;
    if (n == 1) return 0;
    long long prev2 = 1, prev1 = 0;
    for (int i = 2; i <= n; i++) {
        long long curr = (long long)(i - 1) % mod * ((prev1 + prev2) % mod) % mod;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
```

### Pigeonhole Principle

If `n` items are placed into `m` containers and `n > m`, at least one container holds more than one item. While simple, this principle proves existence results that no constructive algorithm can match:

- In any sequence of n²+1 distinct numbers, there exists a monotone subsequence of length n+1.
- Among any 5 points in a unit square, at least two are within distance √2/2.

### Generating Functions (Concept)

A generating function encodes a sequence `a₀, a₁, a₂, ...` as coefficients of a formal power series: `G(x) = a₀ + a₁x + a₂x² + ...`. Operations on generating functions (addition, multiplication, differentiation) correspond to operations on sequences (sum, convolution, shifting). For example, the number of ways to make change using coins of value 1, 5, 10 is the coefficient of x^n in the product of geometric series `1/(1-x) × 1/(1-x⁵) × 1/(1-x¹⁰)`.

## Common Patterns

### Pattern 1: "Count Modulo a Prime"

When the answer involves nCr and the modulus is prime, precompute factorials and inverse factorials. This gives O(1) per nCr query after O(N) preprocessing. Use Fermat's theorem for the inverse.

### Pattern 2: Inclusion-Exclusion for "At Least / At Most" Problems

Problems asking "count arrangements with no element in its forbidden position" or "count integers in [1, N] divisible by none of the given primes" are classic inclusion-exclusion. The key is defining the sets correctly and computing their intersections.

### Pattern 3: Catalan Number Recognition

If a problem involves balanced structures (parentheses, trees, paths that don't cross a diagonal), suspect Catalan numbers. The ballot problem, Dyck paths, and non-crossing partitions are all Catalan in disguise.

### Pattern 4: Stars and Bars

The number of ways to place `n` identical items into `k` distinct bins is `nCr(n+k-1, k-1)`. With the constraint that each bin has at least 1 item, it becomes `nCr(n-1, k-1)`.

---

## Practice Problems

### Problem 1: Compute nCr mod p Using Fermat's Theorem

**Problem Statement**

Given integers `n`, `r`, and a prime `p`, compute `nCr mod p` efficiently. Constraints: 0 ≤ r ≤ n ≤ 10⁶, p = 10⁹ + 7.

```
Input:  n = 10, r = 3, p = 1000000007
Output: 120
```

```
Input:  n = 1000000, r = 500000, p = 1000000007
Output: 149033233
```

**Approach**

Precompute `fact[i] = i! mod p` for i from 0 to n, and `inv_fact[i] = (i!)⁻¹ mod p` using Fermat's little theorem. Since p is prime, `(i!)⁻¹ = (i!)^(p-2) mod p`. For efficiency, compute `inv_fact[n]` directly, then derive `inv_fact[i] = inv_fact[i+1] × (i+1) mod p` backwards. Then `nCr = fact[n] × inv_fact[r] × inv_fact[n-r] mod p`.

**Pseudo-code**

```
precompute:
    fact[0] = 1
    for i from 1 to MAXN:
        fact[i] = fact[i-1] * i mod p
    inv_fact[MAXN] = power(fact[MAXN], p - 2, p)
    for i from MAXN-1 down to 0:
        inv_fact[i] = inv_fact[i+1] * (i+1) mod p

function nCr(n, r):
    if r < 0 or r > n: return 0
    return fact[n] * inv_fact[r] * inv_fact[n-r] mod p
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
using namespace std;

const long long MOD = 1e9 + 7;

long long power(long long base, long long exp, long long mod) {
    long long result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1)
            result = result * base % mod;
        base = base * base % mod;
        exp >>= 1;
    }
    return result;
}

int main() {
    int n, r;
    cin >> n >> r;

    vector<long long> fact(n + 1), inv_fact(n + 1);
    fact[0] = 1;
    for (int i = 1; i <= n; i++)
        fact[i] = fact[i - 1] * i % MOD;

    inv_fact[n] = power(fact[n], MOD - 2, MOD);
    for (int i = n - 1; i >= 0; i--)
        inv_fact[i] = inv_fact[i + 1] * (i + 1) % MOD;

    auto nCr = [&](int a, int b) -> long long {
        if (b < 0 || b > a) return 0;
        return fact[a] % MOD * inv_fact[b] % MOD * inv_fact[a - b] % MOD;
    };

    cout << nCr(n, r) << endl;
    return 0;
}
```

**Complexity Analysis**
- **Time:** O(N + log p) — O(N) for factorial precomputation, O(log p) for one modular exponentiation, O(N) for inverse factorial propagation. Each query is O(1).
- **Space:** O(N) — for the factorial and inverse factorial arrays.

---

### Problem 2: Count Valid Parentheses Sequences (Catalan Numbers)

**Problem Statement**

Given an integer `n`, count the number of distinct valid (balanced) parentheses sequences of length `2n`. Output the result modulo 10⁹ + 7.

```
Input:  n = 3
Output: 5
// The 5 sequences: ((())), (()()), (())(), ()(()), ()()()
```

```
Input:  n = 1
Output: 1
// The only sequence: ()
```

**Approach**

The number of valid parentheses sequences of length `2n` is the n-th Catalan number: `C(n) = nCr(2n, n) / (n+1)`. Since we are working modulo a prime, division by `(n+1)` becomes multiplication by the modular inverse of `(n+1)`. Alternatively, use the equivalent formula `C(n) = nCr(2n, n) - nCr(2n, n+1)`, which avoids the division entirely.

**Pseudo-code**

```
precompute factorials and inverse factorials up to 2n

function catalan(n):
    return nCr(2*n, n) * modInverse(n + 1) mod p

// alternatively:
    return (nCr(2*n, n) - nCr(2*n, n+1) + MOD) mod MOD
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
using namespace std;

const long long MOD = 1e9 + 7;

long long power(long long base, long long exp, long long mod) {
    long long result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1)
            result = result * base % mod;
        base = base * base % mod;
        exp >>= 1;
    }
    return result;
}

int main() {
    int n;
    cin >> n;

    int sz = 2 * n;
    vector<long long> fact(sz + 1), inv_fact(sz + 1);
    fact[0] = 1;
    for (int i = 1; i <= sz; i++)
        fact[i] = fact[i - 1] * i % MOD;
    inv_fact[sz] = power(fact[sz], MOD - 2, MOD);
    for (int i = sz - 1; i >= 0; i--)
        inv_fact[i] = inv_fact[i + 1] * (i + 1) % MOD;

    auto nCr = [&](int a, int b) -> long long {
        if (b < 0 || b > a) return 0;
        return fact[a] % MOD * inv_fact[b] % MOD * inv_fact[a - b] % MOD;
    };

    long long catalan = nCr(2 * n, n) % MOD * power(n + 1, MOD - 2, MOD) % MOD;
    cout << catalan << endl;

    return 0;
}
```

**Complexity Analysis**
- **Time:** O(N) — dominated by factorial precomputation. The Catalan number itself is computed in O(1) after preprocessing.
- **Space:** O(N) — for the factorial and inverse factorial arrays.

---

### Problem 3: Count Derangements of N Elements

**Problem Statement**

Given an integer `N`, count the number of derangements — permutations of `{1, 2, ..., N}` where no element appears in its original position. Output the result modulo 10⁹ + 7. Constraints: 1 ≤ N ≤ 10⁶.

```
Input:  N = 3
Output: 2
// Derangements of {1,2,3}: {2,3,1} and {3,1,2}
```

```
Input:  N = 4
Output: 9
// Derangements: {2,1,4,3}, {2,3,4,1}, {2,4,1,3}, {3,1,4,2}, {3,4,1,2}, {3,4,2,1}, {4,1,2,3}, {4,3,1,2}, {4,3,2,1}
```

**Approach**

Use the recurrence `D(n) = (n-1) × (D(n-1) + D(n-2))`. The intuition: consider element 1. It must go to some position `k` (n-1 choices). Then either element `k` goes to position 1 (reducing to a derangement of the remaining n-2 elements), or element `k` does not go to position 1 (equivalent to a derangement of n-1 elements where `k` plays the role of 1).

**Pseudo-code**

```
function countDerangements(N):
    if N == 0: return 1
    if N == 1: return 0
    dp_prev2 = 1  // D(0)
    dp_prev1 = 0  // D(1)
    for i from 2 to N:
        dp_curr = (i - 1) * (dp_prev1 + dp_prev2) mod MOD
        dp_prev2 = dp_prev1
        dp_prev1 = dp_curr
    return dp_prev1
```

**C++ Solution**

```cpp
#include <iostream>
using namespace std;

const long long MOD = 1e9 + 7;

int main() {
    int n;
    cin >> n;

    if (n == 0) { cout << 1 << endl; return 0; }
    if (n == 1) { cout << 0 << endl; return 0; }

    long long prev2 = 1, prev1 = 0;
    for (int i = 2; i <= n; i++) {
        long long curr = (long long)(i - 1) % MOD * ((prev1 + prev2) % MOD) % MOD;
        prev2 = prev1;
        prev1 = curr;
    }

    cout << prev1 << endl;
    return 0;
}
```

**Complexity Analysis**
- **Time:** O(N) — a single linear pass using the recurrence relation.
- **Space:** O(1) — only three variables are maintained (current, previous, and two-back).

---

## Practice Resources

- [LeetCode — Unique Binary Search Trees (#96)](https://leetcode.com/problems/unique-binary-search-trees/) — Catalan numbers
- [LeetCode — Generate Parentheses (#22)](https://leetcode.com/problems/generate-parentheses/)
- [Codeforces — Combinatorics Problems](https://codeforces.com/problemset?tags=combinatorics)
- [cp-algorithms — Catalan Numbers](https://cp-algorithms.com/combinatorics/catalan-numbers.html)
- [GeeksforGeeks — Inclusion-Exclusion Principle](https://www.geeksforgeeks.org/inclusion-exclusion-principle/)

---

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: Concurrency Basics →](/docs/CodingTestPreparation/Advanced/10_concurrency_basics)
