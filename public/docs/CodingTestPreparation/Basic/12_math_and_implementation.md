# Simple Math and Implementation Problems

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

Math and implementation problems test your ability to translate a well-defined procedure into clean code. Unlike problems that require a clever data-structure insight, these problems give you a clear algorithm — your job is to implement it correctly, handle edge cases, and manage number-theoretic subtleties like integer overflow and modular arithmetic.

The topics in this section — GCD/LCM, primality testing, the Sieve of Eratosthenes, digit extraction, and modular arithmetic — appear frequently in coding interviews and competitive programming. They are building blocks that show up inside larger problems: checking coprimality in number theory tasks, generating primes for factorization, or using modular arithmetic to keep large results within bounds.

Implementation and simulation problems are also common. These are problems where the algorithm is described in the problem statement itself — you just need to faithfully code it up. They test attention to detail: off-by-one errors, overflow, boundary conditions, and clean loop logic. Practicing these problems builds the discipline needed for harder algorithmic challenges.

## Key Concepts

### GCD — Greatest Common Divisor (Euclidean Algorithm)

The GCD of two integers a and b is the largest integer that divides both. The **Euclidean algorithm** computes it efficiently by repeatedly replacing the larger number with the remainder.

```cpp
int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Recursive version (concise)
int gcdRec(int a, int b) {
    return b == 0 ? a : gcdRec(b, a % b);
}
```

**Time complexity:** O(log(min(a, b))) — the remainder shrinks by at least half every two steps.

### LCM — Least Common Multiple

The LCM of two numbers can be computed from the GCD:

```cpp
long long lcm(int a, int b) {
    return (long long)a / gcd(a, b) * b; // divide first to avoid overflow
}
```

**Key identity:** `a × b = GCD(a, b) × LCM(a, b)`

### Prime Checking

A number n is prime if its only divisors are 1 and n. Check divisors only up to √n.

```cpp
bool isPrime(int n) {
    if (n < 2) return false;
    if (n < 4) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    for (int i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0)
            return false;
    }
    return true;
}
```

The `i += 6` optimization skips multiples of 2 and 3 — all primes > 3 are of the form 6k ± 1.

**Time complexity:** O(√n)

### Sieve of Eratosthenes

Finds all primes up to a limit N. Mark multiples of each prime as composite.

```cpp
std::vector<bool> sieve(int n) {
    std::vector<bool> is_prime(n + 1, true);
    is_prime[0] = is_prime[1] = false;
    for (int i = 2; i * i <= n; i++) {
        if (is_prime[i]) {
            for (int j = i * i; j <= n; j += i)
                is_prime[j] = false;
        }
    }
    return is_prime;
}

// Usage: collect primes
std::vector<int> getPrimes(int n) {
    auto is_prime = sieve(n);
    std::vector<int> primes;
    for (int i = 2; i <= n; i++)
        if (is_prime[i])
            primes.push_back(i);
    return primes;
}
```

**Time complexity:** O(n log log n)  
**Space complexity:** O(n)

### Digit Extraction

Extract digits from a number by repeatedly taking the last digit (`n % 10`) and removing it (`n / 10`).

```cpp
void printDigits(int n) {
    if (n == 0) { std::cout << 0; return; }
    while (n > 0) {
        int digit = n % 10;
        std::cout << digit << " "; // prints digits in reverse order
        n /= 10;
    }
}

int sumOfDigits(int n) {
    int sum = 0;
    n = std::abs(n);
    while (n > 0) {
        sum += n % 10;
        n /= 10;
    }
    return sum;
}

int countDigits(int n) {
    if (n == 0) return 1;
    int count = 0;
    n = std::abs(n);
    while (n > 0) {
        count++;
        n /= 10;
    }
    return count;
}
```

### Modular Arithmetic

When results can be astronomically large, problems ask you to return the answer modulo some prime (often 10⁹ + 7).

**Key rules:**

```
(a + b) mod m = ((a mod m) + (b mod m)) mod m
(a × b) mod m = ((a mod m) × (b mod m)) mod m
(a - b) mod m = ((a mod m) - (b mod m) + m) mod m   // +m to keep positive
```

```cpp
const int MOD = 1e9 + 7;

long long modAdd(long long a, long long b) {
    return ((a % MOD) + (b % MOD)) % MOD;
}

long long modMul(long long a, long long b) {
    return ((a % MOD) * (b % MOD)) % MOD;
}

// Modular exponentiation: compute base^exp mod m in O(log exp)
long long modPow(long long base, long long exp, long long m) {
    long long result = 1;
    base %= m;
    while (exp > 0) {
        if (exp & 1) result = result * base % m;
        base = base * base % m;
        exp >>= 1;
    }
    return result;
}
```

### Simulation Problems

These problems describe a process step by step — your job is to implement it faithfully. Examples include simulating a robot's movements, a clock, or a game. The key is careful loop logic and boundary handling.

## Common Patterns

### Pattern 1 — GCD/LCM as a Building Block

Many problems reduce to computing GCD or LCM: simplifying fractions, finding the smallest common cycle, or checking coprimality. The Euclidean algorithm is so fast it's essentially free.

### Pattern 2 — Trial Division up to √n

Checking divisibility only up to √n reduces primality testing from O(n) to O(√n). The same idea applies to finding all divisors of n.

### Pattern 3 — Precompute with Sieve

When you need to answer many primality queries, precompute a sieve once in O(n log log n) rather than checking each number individually in O(√n).

### Pattern 4 — Watch for Integer Overflow

Multiplying two 32-bit integers can overflow. Use `long long` for intermediate results, and apply modular arithmetic before values grow too large. When reversing an integer, check against `INT_MAX / 10` before multiplying by 10.

---

## Practice Problems

### Problem 1: Check if a Number is Prime

**Problem Statement**

Given an integer n, determine if it is a prime number. Handle edge cases: n ≤ 1 is not prime, n = 2 and n = 3 are prime.

```
Input:  29
Output: true

Input:  15
Output: false (divisible by 3 and 5)

Input:  1
Output: false
```

**Approach**

Use trial division up to √n. Skip even numbers after checking for 2. Use the 6k ± 1 optimization to skip multiples of 2 and 3.

**Pseudo-code**

```
function isPrime(n):
    if n < 2: return false
    if n < 4: return true
    if n % 2 == 0 or n % 3 == 0: return false
    for i = 5 to √n step 6:
        if n % i == 0 or n % (i+2) == 0: return false
    return true
```

**C++ Solution**

```cpp
#include <iostream>

bool isPrime(int n) {
    if (n < 2) return false;
    if (n < 4) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    for (int i = 5; (long long)i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0)
            return false;
    }
    return true;
}

int main() {
    std::cout << std::boolalpha;
    std::cout << isPrime(29) << "\n";  // true
    std::cout << isPrime(15) << "\n";  // false
    std::cout << isPrime(1) << "\n";   // false
    std::cout << isPrime(2) << "\n";   // true
    std::cout << isPrime(97) << "\n";  // true
    std::cout << isPrime(100) << "\n"; // false

    return 0;
}
```

**Complexity Analysis**

- **Time:** O(√n) — we check divisors up to √n, skipping multiples of 2 and 3.
- **Space:** O(1) — only a loop variable.

---

### Problem 2: GCD of Two Numbers

**Problem Statement**

Given two non-negative integers a and b, compute their greatest common divisor using the Euclidean algorithm. Handle the case where one or both are zero: GCD(a, 0) = a.

```
Input:  a = 48, b = 18
Output: 6

Input:  a = 0, b = 5
Output: 5
```

**Approach**

Apply the Euclidean algorithm: replace (a, b) with (b, a % b) until b becomes 0. At that point, a holds the GCD.

**Pseudo-code**

```
function gcd(a, b):
    while b != 0:
        temp = b
        b = a % b
        a = temp
    return a
```

**C++ Solution**

```cpp
#include <iostream>

int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

long long lcm(int a, int b) {
    if (a == 0 || b == 0) return 0;
    return (long long)a / gcd(a, b) * b;
}

int main() {
    std::cout << "GCD(48, 18) = " << gcd(48, 18) << "\n";   // 6
    std::cout << "GCD(0, 5)   = " << gcd(0, 5) << "\n";     // 5
    std::cout << "GCD(7, 13)  = " << gcd(7, 13) << "\n";    // 1 (coprime)
    std::cout << "GCD(100, 75)= " << gcd(100, 75) << "\n";  // 25

    std::cout << "LCM(4, 6)   = " << lcm(4, 6) << "\n";     // 12
    std::cout << "LCM(12, 18) = " << lcm(12, 18) << "\n";   // 36

    return 0;
}
```

**Complexity Analysis**

- **Time:** O(log(min(a, b))) — the Euclidean algorithm converges in logarithmic steps. In the worst case (consecutive Fibonacci numbers), it takes about 1.44 × log₂(min(a, b)) steps.
- **Space:** O(1) for the iterative version. The recursive version uses O(log(min(a, b))) stack space.

---

### Problem 3: Reverse an Integer (Handle Overflow)

**Problem Statement**

Given a signed 32-bit integer, reverse its digits. If the reversed integer overflows the 32-bit signed integer range [−2³¹, 2³¹ − 1], return 0.

```
Input:  123
Output: 321

Input:  -456
Output: -654

Input:  1534236469
Output: 0 (reversed value overflows)
```

**Approach**

Extract digits from the end using `% 10` and build the reversed number. Before multiplying `result` by 10, check whether doing so would cause overflow: if `result > INT_MAX / 10` (or `result < INT_MIN / 10`), return 0. Also handle the edge case where `result == INT_MAX / 10` and the next digit would push past the limit.

**Pseudo-code**

```
function reverse(x):
    result = 0
    while x != 0:
        digit = x % 10
        x = x / 10  (truncate toward zero)
        if result > INT_MAX / 10 or (result == INT_MAX / 10 and digit > 7):
            return 0
        if result < INT_MIN / 10 or (result == INT_MIN / 10 and digit < -8):
            return 0
        result = result * 10 + digit
    return result
```

**C++ Solution**

```cpp
#include <iostream>
#include <climits>

int reverseInteger(int x) {
    int result = 0;
    while (x != 0) {
        int digit = x % 10;
        x /= 10;

        if (result > INT_MAX / 10 || (result == INT_MAX / 10 && digit > 7))
            return 0;
        if (result < INT_MIN / 10 || (result == INT_MIN / 10 && digit < -8))
            return 0;

        result = result * 10 + digit;
    }
    return result;
}

int main() {
    std::cout << reverseInteger(123) << "\n";         // 321
    std::cout << reverseInteger(-456) << "\n";        // -654
    std::cout << reverseInteger(1534236469) << "\n";  // 0 (overflow)
    std::cout << reverseInteger(0) << "\n";           // 0
    std::cout << reverseInteger(120) << "\n";         // 21

    return 0;
}
```

**Complexity Analysis**

- **Time:** O(log₁₀(|x|)) — we process each digit once, and the number of digits is log₁₀(|x|) + 1.
- **Space:** O(1) — only a few integer variables.

---

## Practice Resources

- [LeetCode — Reverse Integer](https://leetcode.com/problems/reverse-integer/)
- [LeetCode — Palindrome Number](https://leetcode.com/problems/palindrome-number/)
- [LeetCode — Count Primes](https://leetcode.com/problems/count-primes/)
- [GeeksforGeeks — GCD and LCM](https://www.geeksforgeeks.org/c-program-find-gcd-hcf-two-numbers/)
- [GeeksforGeeks — Sieve of Eratosthenes](https://www.geeksforgeeks.org/sieve-of-eratosthenes/)

---

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [→ Continue to Standard Stage](/docs/CodingTestPreparation/Standard/01_intermediate_cpp)
