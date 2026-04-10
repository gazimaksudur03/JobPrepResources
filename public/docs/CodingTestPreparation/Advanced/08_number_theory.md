# Number Theory

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

Number theory is the branch of mathematics dealing with properties of integers, and it underpins a large class of competitive programming and interview problems. When a problem says "output the answer modulo 10⁹ + 7," it is signaling that number-theoretic techniques — modular arithmetic, fast exponentiation, and modular inverses — are required. Without these tools, even correctly computed answers will overflow 64-bit integers.

The core techniques revolve around modular arithmetic (performing addition, subtraction, multiplication, and division under a modulus), binary exponentiation (computing a^b mod m in O(log b) time), and the Sieve of Eratosthenes (finding all primes up to N in O(N log log N)). These are not just theoretical curiosities: they appear directly in problems involving combinatorics, cryptography, hashing, and large-number computation.

More advanced concepts include Euler's totient function (counting integers coprime to N), Fermat's little theorem (which provides modular inverses when the modulus is prime), the Chinese Remainder Theorem (solving systems of modular equations), and the Extended Euclidean Algorithm (finding integer solutions to ax + by = gcd(a, b)). Mastering these gives you a powerful toolkit for problems that seem algebraically intractable at first glance.

## Key Concepts

### Modular Arithmetic

Modular arithmetic obeys these fundamental properties:

```
(a + b) mod m = ((a mod m) + (b mod m)) mod m
(a - b) mod m = ((a mod m) - (b mod m) + m) mod m
(a * b) mod m = ((a mod m) * (b mod m)) mod m
```

Division is **not** straightforward: `(a / b) mod m ≠ (a mod m) / (b mod m)`. Instead, you must compute the **modular multiplicative inverse** of `b` and multiply: `(a / b) mod m = (a * b⁻¹) mod m`.

```cpp
long long mod(long long a, long long m) {
    return ((a % m) + m) % m;
}

long long modAdd(long long a, long long b, long long m) {
    return ((a % m) + (b % m)) % m;
}

long long modMul(long long a, long long b, long long m) {
    return ((__int128)a * b) % m;  // prevents overflow for 64-bit operands
}
```

### Binary Exponentiation (Fast Power)

Computing a^b mod m naively takes O(b) multiplications. Binary exponentiation reduces this to O(log b) by exploiting:

```
a^b = (a^(b/2))^2           if b is even
a^b = a * (a^((b-1)/2))^2   if b is odd
```

```cpp
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
```

### Sieve of Eratosthenes

The classic sieve marks all composite numbers up to N, leaving primes unmarked. The optimized version starts marking from `i*i` (since smaller multiples are already handled) and skips even numbers.

```cpp
vector<bool> sieve(int n) {
    vector<bool> is_prime(n + 1, true);
    is_prime[0] = is_prime[1] = false;
    for (int i = 2; (long long)i * i <= n; i++) {
        if (is_prime[i]) {
            for (int j = i * i; j <= n; j += i)
                is_prime[j] = false;
        }
    }
    return is_prime;
}
```

**Linear Sieve (O(N)):** Each composite is marked exactly once by its smallest prime factor. This also yields the smallest prime factor (SPF) array, useful for fast factorization.

```cpp
vector<int> linearSieve(int n) {
    vector<int> spf(n + 1, 0);
    vector<int> primes;
    for (int i = 2; i <= n; i++) {
        if (spf[i] == 0) {
            spf[i] = i;
            primes.push_back(i);
        }
        for (int p : primes) {
            if (p > spf[i] || (long long)i * p > n) break;
            spf[i * p] = p;
        }
    }
    return spf;
}
```

### Euler's Totient Function

φ(n) counts integers in [1, n] that are coprime to n. The formula uses the prime factorization of n:

```
φ(n) = n × ∏(1 - 1/p) for each prime factor p of n
```

```cpp
int eulerTotient(int n) {
    int result = n;
    for (int p = 2; (long long)p * p <= n; p++) {
        if (n % p == 0) {
            while (n % p == 0) n /= p;
            result -= result / p;
        }
    }
    if (n > 1) result -= result / n;
    return result;
}
```

### Fermat's Little Theorem

If `p` is prime and `gcd(a, p) = 1`, then:

```
a^(p-1) ≡ 1 (mod p)
```

This gives us the modular inverse: `a⁻¹ ≡ a^(p-2) (mod p)`, computed via binary exponentiation.

### Extended Euclidean Algorithm

Finds integers `x, y` such that `ax + by = gcd(a, b)`. This is essential for computing modular inverses when the modulus is not prime.

```cpp
long long extGCD(long long a, long long b, long long& x, long long& y) {
    if (b == 0) {
        x = 1; y = 0;
        return a;
    }
    long long x1, y1;
    long long g = extGCD(b, a % b, x1, y1);
    x = y1;
    y = x1 - (a / b) * y1;
    return g;
}

long long modInverse(long long a, long long m) {
    long long x, y;
    long long g = extGCD(a, m, x, y);
    if (g != 1) return -1;  // inverse doesn't exist
    return (x % m + m) % m;
}
```

### Chinese Remainder Theorem (CRT)

Given a system of congruences `x ≡ r₁ (mod m₁)`, `x ≡ r₂ (mod m₂)`, ..., where all moduli are pairwise coprime, CRT guarantees a unique solution modulo M = m₁ × m₂ × ... × mₖ.

```cpp
pair<long long, long long> crt(vector<long long>& r, vector<long long>& m) {
    long long curR = r[0], curM = m[0];
    for (int i = 1; i < (int)r.size(); i++) {
        long long x, y;
        long long g = extGCD(curM, m[i], x, y);
        if ((r[i] - curR) % g != 0) return {-1, -1};  // no solution
        long long lcm = curM / g * m[i];
        curR = (curR + curM * ((r[i] - curR) / g % (m[i] / g) * x % (m[i] / g))) % lcm;
        curR = (curR + lcm) % lcm;
        curM = lcm;
    }
    return {curR, curM};
}
```

## Common Patterns

### Pattern 1: "Answer Modulo 10⁹+7"

Whenever a problem says to output `answer mod 10⁹+7`, it means the true answer is astronomically large. Use modular arithmetic throughout the computation — add `% MOD` after every addition and multiplication. For division, compute the modular inverse using Fermat's little theorem (since 10⁹+7 is prime).

### Pattern 2: Precompute Factorials and Inverses

For combinatorics problems, precompute `fact[i] = i! mod p` and `inv_fact[i] = (i!)⁻¹ mod p` up to the maximum N. Then nCr = `fact[n] * inv_fact[r] * inv_fact[n-r] mod p`, computed in O(1) per query after O(N) preprocessing.

### Pattern 3: Sieve + SPF for Factorization Queries

When you need to factorize many numbers, precompute the smallest prime factor for all numbers up to N using a linear sieve. Then factorize any number in O(log N) by repeatedly dividing by its SPF.

### Pattern 4: Binary Exponentiation for Matrix Power

For linear recurrence problems (Fibonacci, etc.), represent the recurrence as a matrix multiplication and use binary exponentiation on matrices to compute the N-th term in O(k³ log N) where k is the matrix dimension.

---

## Practice Problems

### Problem 1: Modular Exponentiation

**Problem Statement**

Given three integers `a`, `b`, and `m`, compute `a^b mod m` efficiently. Constraints: 1 ≤ a, m ≤ 10⁹, 0 ≤ b ≤ 10¹⁸.

```
Input:  a = 2, b = 10, m = 1000
Output: 24
```

```
Input:  a = 3, b = 100000000000000000, m = 1000000007
Output: 194572813
```

**Approach**

Use binary exponentiation. Represent `b` in binary and square the base at each step, multiplying into the result when the corresponding bit is set. This reduces O(b) multiplications to O(log b). Care must be taken to avoid overflow: since `a` and `m` can be up to 10⁹, the product of two values can exceed 64-bit range, so reduce `base %= mod` before any multiplication.

**Pseudo-code**

```
function power(a, b, m):
    result = 1
    a = a mod m
    while b > 0:
        if b is odd:
            result = (result * a) mod m
        a = (a * a) mod m
        b = b / 2
    return result
```

**C++ Solution**

```cpp
#include <iostream>
using namespace std;

long long power(long long base, long long exp, long long mod) {
    long long result = 1;
    base %= mod;
    if (base == 0) return 0;
    while (exp > 0) {
        if (exp & 1)
            result = (__int128)result * base % mod;
        base = (__int128)base * base % mod;
        exp >>= 1;
    }
    return result;
}

int main() {
    long long a, b, m;
    cin >> a >> b >> m;
    cout << power(a, b, m) << endl;
    return 0;
}
```

**Complexity Analysis**
- **Time:** O(log b) — the exponent is halved at each step, so the loop runs at most 60 iterations for b ≤ 10¹⁸.
- **Space:** O(1) — only a constant number of variables.

---

### Problem 2: Count Primes Up to N (Optimized Sieve)

**Problem Statement**

Given an integer N, count the number of prime numbers less than or equal to N. Constraints: 1 ≤ N ≤ 10⁷.

```
Input:  N = 10
Output: 4  (primes: 2, 3, 5, 7)
```

```
Input:  N = 100
Output: 25
```

**Approach**

Use the Sieve of Eratosthenes with optimizations: start crossing out at `i*i`, use a `vector<bool>` for memory efficiency (bit-packed), and optionally treat 2 separately to halve memory. For N = 10⁷, the sieve completes in milliseconds. Count the number of entries still marked as prime.

**Pseudo-code**

```
function countPrimes(N):
    is_prime = array of size N+1, all true
    is_prime[0] = is_prime[1] = false
    for i from 2 to sqrt(N):
        if is_prime[i]:
            for j from i*i to N step i:
                is_prime[j] = false
    return count of true values in is_prime
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
using namespace std;

int countPrimes(int n) {
    if (n < 2) return 0;
    vector<bool> is_prime(n + 1, true);
    is_prime[0] = is_prime[1] = false;

    for (int i = 2; (long long)i * i <= n; i++) {
        if (is_prime[i]) {
            for (int j = i * i; j <= n; j += i)
                is_prime[j] = false;
        }
    }

    int count = 0;
    for (int i = 2; i <= n; i++)
        if (is_prime[i]) count++;
    return count;
}

int main() {
    int n;
    cin >> n;
    cout << countPrimes(n) << endl;
    return 0;
}
```

**Complexity Analysis**
- **Time:** O(N log log N) — the harmonic sum of prime reciprocals converges to log log N, making the sieve nearly linear in practice.
- **Space:** O(N) — the boolean array. Using `vector<bool>` bit-packs to N/8 bytes (~1.25 MB for N = 10⁷).

---

### Problem 3: Modular Multiplicative Inverse

**Problem Statement**

Given two integers `a` and `m`, find `a⁻¹ mod m` — the integer `x` such that `(a * x) mod m = 1`. If no inverse exists (i.e., `gcd(a, m) ≠ 1`), output -1. Constraints: 1 ≤ a, m ≤ 10⁹.

```
Input:  a = 3, m = 7
Output: 5  (because 3 * 5 = 15 ≡ 1 mod 7)
```

```
Input:  a = 4, m = 6
Output: -1  (gcd(4, 6) = 2 ≠ 1, no inverse exists)
```

**Approach**

Two methods exist:

1. **Fermat's little theorem** (only when `m` is prime): `a⁻¹ = a^(m-2) mod m`. Use binary exponentiation.
2. **Extended Euclidean Algorithm** (works for any `m`): Find `x, y` such that `a*x + m*y = gcd(a, m)`. If `gcd = 1`, then `x mod m` is the inverse.

The extended GCD approach is more general and handles composite moduli.

**Pseudo-code**

```
function extGCD(a, b):
    if b == 0:
        return (a, 1, 0)
    (g, x1, y1) = extGCD(b, a mod b)
    x = y1
    y = x1 - (a / b) * y1
    return (g, x, y)

function modInverse(a, m):
    (g, x, y) = extGCD(a, m)
    if g != 1: return -1
    return (x mod m + m) mod m
```

**C++ Solution**

```cpp
#include <iostream>
using namespace std;

long long extGCD(long long a, long long b, long long& x, long long& y) {
    if (b == 0) {
        x = 1;
        y = 0;
        return a;
    }
    long long x1, y1;
    long long g = extGCD(b, a % b, x1, y1);
    x = y1;
    y = x1 - (a / b) * y1;
    return g;
}

long long modInverse(long long a, long long m) {
    long long x, y;
    long long g = extGCD(a, m, x, y);
    if (g != 1) return -1;
    return (x % m + m) % m;
}

int main() {
    long long a, m;
    cin >> a >> m;
    long long inv = modInverse(a, m);
    if (inv == -1)
        cout << -1 << endl;
    else
        cout << inv << endl;
    return 0;
}
```

**Complexity Analysis**
- **Time:** O(log(min(a, m))) — the Extended Euclidean Algorithm has the same complexity as the standard GCD algorithm, which is bounded by the number of steps in the Euclidean algorithm.
- **Space:** O(log(min(a, m))) — recursion depth. Can be made O(1) with an iterative implementation.

---

## Practice Resources

- [LeetCode — Count Primes (#204)](https://leetcode.com/problems/count-primes/)
- [LeetCode — Pow(x, n) (#50)](https://leetcode.com/problems/powx-n/)
- [cp-algorithms — Binary Exponentiation](https://cp-algorithms.com/algebra/binary-exp.html)
- [cp-algorithms — Sieve of Eratosthenes](https://cp-algorithms.com/algebra/sieve-of-eratosthenes.html)
- [GeeksforGeeks — Modular Multiplicative Inverse](https://www.geeksforgeeks.org/multiplicative-inverse-under-modulo-m/)

---

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: Combinatorics →](/docs/CodingTestPreparation/Advanced/09_combinatorics)
