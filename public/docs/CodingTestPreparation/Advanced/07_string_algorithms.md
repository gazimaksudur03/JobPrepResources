# String Algorithms

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

String algorithms form one of the most important and technically demanding areas in competitive programming and coding interviews. Unlike simple string manipulation, advanced string algorithms focus on efficient pattern matching, substring searching, and structural analysis of text. Problems that appear trivial with brute-force O(N×M) approaches become solvable within tight time limits only when you apply algorithms like KMP, Rabin-Karp, or the Z-algorithm.

At their core, most string algorithms exploit the structure within the string itself to avoid redundant comparisons. The KMP algorithm preprocesses the pattern to build a failure function that tells you exactly where to resume matching after a mismatch. Rabin-Karp uses hashing to convert substring comparison from O(M) to O(1) amortized. The Z-algorithm computes, for every position, the length of the longest substring starting there that matches a prefix of the string — a surprisingly versatile primitive.

Beyond pattern matching, suffix arrays provide a sorted view of all suffixes of a string, enabling efficient solutions to problems like longest common substring, number of distinct substrings, and lexicographic queries. Manacher's algorithm solves the longest palindromic substring problem in linear time by exploiting the symmetric structure of palindromes. String hashing, when applied carefully with good modular parameters, turns many quadratic string problems into linear or near-linear solutions.

## Key Concepts

### KMP (Knuth-Morris-Pratt) Algorithm

KMP achieves O(N + M) pattern matching by precomputing a **failure function** (also called the prefix function or partial match table). For each position `i` in the pattern, `fail[i]` stores the length of the longest proper prefix of `pattern[0..i]` that is also a suffix.

When a mismatch occurs at position `j` in the pattern while comparing against the text, instead of restarting the comparison from scratch, KMP shifts the pattern so that `fail[j-1]` characters are already matched. This guarantees that each character in the text is visited at most twice.

```cpp
vector<int> computeKMPFailure(const string& pattern) {
    int m = pattern.size();
    vector<int> fail(m, 0);
    int k = 0;
    for (int i = 1; i < m; i++) {
        while (k > 0 && pattern[k] != pattern[i])
            k = fail[k - 1];
        if (pattern[k] == pattern[i])
            k++;
        fail[i] = k;
    }
    return fail;
}

vector<int> kmpSearch(const string& text, const string& pattern) {
    vector<int> fail = computeKMPFailure(pattern);
    vector<int> matches;
    int n = text.size(), m = pattern.size();
    int j = 0;
    for (int i = 0; i < n; i++) {
        while (j > 0 && pattern[j] != text[i])
            j = fail[j - 1];
        if (pattern[j] == text[i])
            j++;
        if (j == m) {
            matches.push_back(i - m + 1);
            j = fail[j - 1];
        }
    }
    return matches;
}
```

### Rabin-Karp (Rolling Hash)

Rabin-Karp computes a hash for the pattern and then slides a window across the text, maintaining a rolling hash. When hashes match, a character-by-character verification confirms the match (to handle collisions). The rolling hash update is O(1) using the formula:

```
hash(s[i+1..i+m]) = (hash(s[i..i+m-1]) - s[i] * base^(m-1)) * base + s[i+m]
```

All arithmetic is done modulo a large prime to keep values manageable.

```cpp
vector<int> rabinKarp(const string& text, const string& pattern) {
    int n = text.size(), m = pattern.size();
    if (m > n) return {};

    const long long MOD = 1e9 + 7, BASE = 31;
    vector<int> matches;

    long long patHash = 0, txtHash = 0, power = 1;
    for (int i = 0; i < m; i++) {
        patHash = (patHash * BASE + pattern[i]) % MOD;
        txtHash = (txtHash * BASE + text[i]) % MOD;
        if (i > 0) power = (power * BASE) % MOD;
    }

    for (int i = 0; i <= n - m; i++) {
        if (patHash == txtHash) {
            if (text.substr(i, m) == pattern)
                matches.push_back(i);
        }
        if (i < n - m) {
            txtHash = (txtHash - text[i] * power % MOD + MOD) % MOD;
            txtHash = (txtHash * BASE + text[i + m]) % MOD;
        }
    }
    return matches;
}
```

### Z-Algorithm

The Z-array for a string `s` is defined as: `z[i]` = length of the longest substring starting at `s[i]` that matches a prefix of `s`. By convention, `z[0]` is undefined (or set to `n`). The Z-algorithm computes this array in O(N) using a window `[l, r)` that tracks the rightmost Z-box found so far.

To use Z for pattern matching, concatenate `pattern + "$" + text` and compute the Z-array. Any position `i` where `z[i] == m` indicates a match.

```cpp
vector<int> zFunction(const string& s) {
    int n = s.size();
    vector<int> z(n, 0);
    int l = 0, r = 0;
    for (int i = 1; i < n; i++) {
        if (i < r)
            z[i] = min(r - i, z[i - l]);
        while (i + z[i] < n && s[z[i]] == s[i + z[i]])
            z[i]++;
        if (i + z[i] > r) {
            l = i;
            r = i + z[i];
        }
    }
    return z;
}
```

### Suffix Array

A suffix array is a sorted array of all suffixes of a string, represented by their starting indices. Construction in O(N log N) uses iterative doubling: first sort by single characters, then by pairs, quadruples, etc., using radix sort at each stage.

Suffix arrays enable efficient solutions for:
- **Longest Common Prefix (LCP):** With Kasai's algorithm in O(N)
- **Number of distinct substrings:** N*(N+1)/2 - sum(LCP)
- **Pattern searching:** Binary search on the suffix array in O(M log N)

```cpp
vector<int> buildSuffixArray(const string& s) {
    int n = s.size();
    vector<int> sa(n), rank_(n), tmp(n);
    iota(sa.begin(), sa.end(), 0);
    for (int i = 0; i < n; i++) rank_[i] = s[i];

    for (int gap = 1; gap < n; gap *= 2) {
        auto cmp = [&](int a, int b) {
            if (rank_[a] != rank_[b]) return rank_[a] < rank_[b];
            int ra = a + gap < n ? rank_[a + gap] : -1;
            int rb = b + gap < n ? rank_[b + gap] : -1;
            return ra < rb;
        };
        sort(sa.begin(), sa.end(), cmp);
        tmp[sa[0]] = 0;
        for (int i = 1; i < n; i++)
            tmp[sa[i]] = tmp[sa[i - 1]] + (cmp(sa[i - 1], sa[i]) ? 1 : 0);
        rank_ = tmp;
    }
    return sa;
}
```

### Manacher's Algorithm (Longest Palindromic Substring)

Manacher's algorithm finds the longest palindromic substring in O(N) by maintaining a center and right boundary of the rightmost palindrome found so far. It uses the symmetry of palindromes: if position `i` is within a known palindrome centered at `c`, then `i`'s mirror position `2*c - i` provides a lower bound for the palindrome radius at `i`.

To handle both odd and even-length palindromes uniformly, the standard trick is to insert a sentinel character (e.g., `#`) between every pair of characters.

```cpp
string longestPalindrome(const string& s) {
    string t = "#";
    for (char c : s) { t += c; t += '#'; }

    int n = t.size();
    vector<int> p(n, 0);
    int c = 0, r = 0;

    for (int i = 0; i < n; i++) {
        int mirror = 2 * c - i;
        if (i < r) p[i] = min(r - i, p[mirror]);
        while (i + p[i] + 1 < n && i - p[i] - 1 >= 0 &&
               t[i + p[i] + 1] == t[i - p[i] - 1])
            p[i]++;
        if (i + p[i] > r) {
            c = i;
            r = i + p[i];
        }
    }

    int maxLen = *max_element(p.begin(), p.end());
    int centerIdx = max_element(p.begin(), p.end()) - p.begin();
    int start = (centerIdx - maxLen) / 2;
    return s.substr(start, maxLen);
}
```

### String Hashing

String hashing maps strings to integers, enabling O(1) substring comparison after O(N) preprocessing. A polynomial hash is commonly used:

```
hash(s[0..n-1]) = s[0]*B^(n-1) + s[1]*B^(n-2) + ... + s[n-1]*B^0   (mod M)
```

To reduce collision probability, use **double hashing** — compute hashes with two different (base, mod) pairs and compare both.

```cpp
struct StringHash {
    vector<long long> h, pw;
    long long MOD = 1e9 + 7, BASE = 31;

    StringHash(const string& s) {
        int n = s.size();
        h.resize(n + 1, 0);
        pw.resize(n + 1, 1);
        for (int i = 0; i < n; i++) {
            h[i + 1] = (h[i] * BASE + s[i] - 'a' + 1) % MOD;
            pw[i + 1] = pw[i] * BASE % MOD;
        }
    }

    long long query(int l, int r) {
        return (h[r + 1] - h[l] * pw[r - l + 1] % MOD + MOD * MOD) % MOD;
    }
};
```

## Common Patterns

### Pattern 1: Concatenation Trick for Pattern Matching

Many string problems reduce to pattern matching by concatenating `pattern + separator + text` and running a linear-time algorithm (KMP prefix function or Z-algorithm) on the combined string. The separator must be a character not present in either string.

### Pattern 2: Rolling Hash for Multi-Pattern Search

When searching for multiple patterns of the same length, precompute their hashes into a set. Then slide a window over the text maintaining a rolling hash and check membership in O(1).

### Pattern 3: Suffix Array + LCP for Substring Queries

For problems involving distinct substrings, longest repeated substring, or longest common substring of two strings (concatenated with a separator), build a suffix array and its LCP array, then answer queries using properties of adjacent suffixes in sorted order.

### Pattern 4: Palindrome Expansion

For palindrome-related problems, either use Manacher's algorithm for the optimal solution or the expand-around-center technique as a simpler O(N²) approach. The expand technique checks both odd and even centers.

---

## Practice Problems

### Problem 1: Pattern Matching Using KMP

**Problem Statement**

Given a text string `T` and a pattern string `P`, find all starting indices where `P` occurs in `T`. Return the indices in increasing order.

```
Input:  T = "aabaabaabaab", P = "aab"
Output: [0, 3, 6, 9]
```

```
Input:  T = "abcdef", P = "gh"
Output: []
```

**Approach**

Build the KMP failure function for pattern `P` in O(M) time. Then scan through `T` maintaining a pointer `j` into the pattern. On a match, advance both pointers. On a mismatch, use the failure function to shift `j` backward without moving the text pointer back. When `j` reaches `M`, record the match and reset `j` using `fail[j-1]`.

**Pseudo-code**

```
function kmpSearch(T, P):
    fail = computeFailure(P)
    j = 0
    results = []
    for i from 0 to len(T) - 1:
        while j > 0 and P[j] != T[i]:
            j = fail[j - 1]
        if P[j] == T[i]:
            j += 1
        if j == len(P):
            results.append(i - len(P) + 1)
            j = fail[j - 1]
    return results
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

vector<int> computeFailure(const string& pattern) {
    int m = pattern.size();
    vector<int> fail(m, 0);
    int k = 0;
    for (int i = 1; i < m; i++) {
        while (k > 0 && pattern[k] != pattern[i])
            k = fail[k - 1];
        if (pattern[k] == pattern[i])
            k++;
        fail[i] = k;
    }
    return fail;
}

vector<int> kmpSearch(const string& text, const string& pattern) {
    vector<int> fail = computeFailure(pattern);
    vector<int> result;
    int n = text.size(), m = pattern.size();
    int j = 0;
    for (int i = 0; i < n; i++) {
        while (j > 0 && pattern[j] != text[i])
            j = fail[j - 1];
        if (pattern[j] == text[i])
            j++;
        if (j == m) {
            result.push_back(i - m + 1);
            j = fail[j - 1];
        }
    }
    return result;
}

int main() {
    string T, P;
    cin >> T >> P;
    vector<int> matches = kmpSearch(T, P);
    for (int idx : matches)
        cout << idx << " ";
    cout << endl;
    return 0;
}
```

**Complexity Analysis**
- **Time:** O(N + M) — failure function in O(M), search in O(N). Each character of T is processed at most twice (once advancing `i`, at most once through failure fallbacks amortized).
- **Space:** O(M) — for the failure function array.

---

### Problem 2: Find All Occurrences Using Rabin-Karp

**Problem Statement**

Given a text `T` and a pattern `P`, find all starting positions where `P` occurs in `T` using the Rabin-Karp rolling hash algorithm.

```
Input:  T = "abracadabra", P = "abra"
Output: [0, 7]
```

```
Input:  T = "aaaaaaa", P = "aaa"
Output: [0, 1, 2, 3, 4]
```

**Approach**

Compute the hash of the pattern. Then compute the hash of the first window of length M in the text. Slide the window one character at a time, updating the hash in O(1) by removing the contribution of the leftmost character and adding the new rightmost character. When hashes match, verify with a direct string comparison to handle hash collisions. Use a large prime modulus to minimize collisions.

**Pseudo-code**

```
function rabinKarp(T, P):
    n = len(T), m = len(P)
    BASE = 31, MOD = 1e9 + 7
    compute patHash = hash of P
    compute txtHash = hash of T[0..m-1]
    power = BASE^(m-1) mod MOD
    results = []
    for i from 0 to n - m:
        if patHash == txtHash:
            if T[i..i+m-1] == P:
                results.append(i)
        if i < n - m:
            remove T[i] from txtHash, add T[i + m]
    return results
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

vector<int> rabinKarp(const string& text, const string& pattern) {
    int n = text.size(), m = pattern.size();
    if (m > n) return {};

    const long long MOD = 1000000007LL, BASE = 31;
    vector<int> result;

    long long patHash = 0, txtHash = 0, power = 1;
    for (int i = 0; i < m; i++) {
        patHash = (patHash * BASE + (pattern[i] - 'a' + 1)) % MOD;
        txtHash = (txtHash * BASE + (text[i] - 'a' + 1)) % MOD;
        if (i > 0) power = power * BASE % MOD;
    }

    for (int i = 0; i <= n - m; i++) {
        if (patHash == txtHash && text.substr(i, m) == pattern)
            result.push_back(i);
        if (i < n - m) {
            txtHash = ((txtHash - (text[i] - 'a' + 1) * power % MOD + MOD) * BASE
                        + (text[i + m] - 'a' + 1)) % MOD;
        }
    }
    return result;
}

int main() {
    string T, P;
    cin >> T >> P;
    vector<int> matches = rabinKarp(T, P);
    for (int idx : matches)
        cout << idx << " ";
    cout << endl;
    return 0;
}
```

**Complexity Analysis**
- **Time:** O(N + M) average case. Hash computation is O(M), and each window slide is O(1). Worst case O(N×M) if every hash matches (many collisions), but this is extremely unlikely with a good prime.
- **Space:** O(1) extra (excluding output), since we only maintain a few hash variables.

---

### Problem 3: Longest Palindromic Substring

**Problem Statement**

Given a string `s`, find the longest substring that is a palindrome. If there are multiple answers of the same length, return any one.

```
Input:  s = "babad"
Output: "bab" (or "aba")
```

```
Input:  s = "cbbd"
Output: "bb"
```

**Approach**

Use Manacher's algorithm for an O(N) solution. Transform the string by inserting `#` between characters (and at both ends) to handle both odd and even length palindromes uniformly. Maintain a center `c` and right boundary `r` of the rightmost palindrome seen so far. For each position `i`, use the mirror property to initialize the palindrome radius, then attempt to expand. Update `c` and `r` when a palindrome extends past the current right boundary.

**Pseudo-code**

```
function manacher(s):
    t = transform s by inserting '#' between chars
    n = len(t)
    p = array of size n, all zeros
    c = 0, r = 0
    for i from 0 to n - 1:
        mirror = 2 * c - i
        if i < r:
            p[i] = min(r - i, p[mirror])
        while can expand at i:
            p[i] += 1
        if i + p[i] > r:
            c = i, r = i + p[i]
    find index of max p[i]
    extract original substring
```

**C++ Solution**

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

string longestPalindrome(const string& s) {
    if (s.empty()) return "";

    string t = "#";
    for (char c : s) {
        t += c;
        t += '#';
    }

    int n = t.size();
    vector<int> p(n, 0);
    int c = 0, r = 0;

    for (int i = 0; i < n; i++) {
        int mirror = 2 * c - i;
        if (i < r)
            p[i] = min(r - i, p[mirror]);
        while (i + p[i] + 1 < n && i - p[i] - 1 >= 0 &&
               t[i + p[i] + 1] == t[i - p[i] - 1])
            p[i]++;
        if (i + p[i] > r) {
            c = i;
            r = i + p[i];
        }
    }

    int maxLen = 0, center = 0;
    for (int i = 0; i < n; i++) {
        if (p[i] > maxLen) {
            maxLen = p[i];
            center = i;
        }
    }

    int start = (center - maxLen) / 2;
    return s.substr(start, maxLen);
}

int main() {
    string s;
    cin >> s;
    cout << longestPalindrome(s) << endl;
    return 0;
}
```

**Complexity Analysis**
- **Time:** O(N) — each position is expanded at most once due to the mirror optimization. The total number of expansion steps across all positions is bounded by N.
- **Space:** O(N) — for the transformed string and the palindrome radius array.

---

## Practice Resources

- [LeetCode — Implement strStr() (#28)](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/)
- [LeetCode — Longest Palindromic Substring (#5)](https://leetcode.com/problems/longest-palindromic-substring/)
- [LeetCode — Repeated String Match (#686)](https://leetcode.com/problems/repeated-string-match/)
- [cp-algorithms — String Hashing](https://cp-algorithms.com/string/string-hashing.html)
- [cp-algorithms — KMP / Prefix Function](https://cp-algorithms.com/string/prefix-function.html)

---

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: Number Theory →](/docs/CodingTestPreparation/Advanced/08_number_theory)
