# Strings

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

Strings are one of the most common data types in coding interviews. Nearly every real-world application deals with text processing, and interviewers love string problems because they test a wide range of skills: traversal, character manipulation, two-pointer techniques, and even hashing. In C++, you have two ways to work with strings: old-school C-style character arrays and the modern `std::string` class from the Standard Library.

The `std::string` class is what you should use in interviews unless specifically asked otherwise. It handles memory management automatically, provides a rich set of built-in methods (length, substring, find, append, compare), and integrates seamlessly with the rest of the STL. However, understanding C-style strings (`char[]` with a null terminator `'\0'`) is important because pointer-based string questions still appear, and knowing the underlying mechanics helps you debug and optimize.

String problems in interviews often revolve around traversal (checking each character), character frequency counting (using arrays or hash maps), and in-place transformations (reversing, rotating). ASCII values are your secret weapon: since characters are just integers under the hood, you can do arithmetic on them — for example, `'a' - 'A'` gives you 32, and `ch - 'a'` gives you the alphabetical index of a lowercase letter.

## Key Concepts

### C-Style Strings vs. std::string

**C-style strings** are arrays of `char` terminated by a null character `'\0'`:

```cpp
char greeting[] = "Hello";  // actually stores: {'H','e','l','l','o','\0'}
char name[20];               // can hold up to 19 characters + '\0'
```

**std::string** is a class that manages its own memory:

```cpp
#include <string>
std::string greeting = "Hello";
std::string name;
std::cin >> name;  // reads until whitespace
```

**Why prefer std::string:**
- Automatic memory management (no buffer overflows)
- Dynamic sizing (grows as needed)
- Rich method library
- Works naturally with `==`, `+`, `<` operators

### Essential String Operations

```cpp
#include <string>
using namespace std;

string s = "Hello, World!";

// Length
s.length();    // 13
s.size();      // 13 (identical to length)

// Access characters
s[0];          // 'H'
s.at(0);       // 'H' (with bounds checking)
s.front();     // 'H'
s.back();      // '!'

// Substring: substr(start_pos, length)
s.substr(0, 5);   // "Hello"
s.substr(7);      // "World!" (from index 7 to end)

// Find: returns position or string::npos if not found
size_t pos = s.find("World");  // 7
if (s.find("xyz") == string::npos) {
    // not found
}

// Append
s.append(" Bye");   // "Hello, World! Bye"
s += " Bye";        // equivalent

// Compare
string a = "abc", b = "abd";
if (a == b) { /* equal */ }
if (a < b)  { /* lexicographically less */ }
a.compare(b);  // negative if a < b, 0 if equal, positive if a > b

// Insert and erase
s.insert(5, "!!");     // insert at position 5
s.erase(5, 2);         // erase 2 characters starting at position 5

// Replace
s.replace(0, 5, "Hi"); // replace 5 chars starting at 0 with "Hi"
```

### Character Manipulation and ASCII Values

Every character maps to an integer (ASCII value). This is heavily exploited in interviews:

```cpp
char ch = 'A';
int ascii = ch;          // 65
char lower = ch + 32;    // 'a' (97)

// Check character type
bool isLetter = isalpha(ch);
bool isDigit  = isdigit(ch);
bool isLower  = islower(ch);
bool isUpper  = isupper(ch);

// Convert case
char upper = toupper('a');  // 'A'
char lower = tolower('Z');  // 'z'

// Alphabetical index (0-25)
int index = ch - 'a';  // for lowercase
int index = ch - 'A';  // for uppercase
```

**Common ASCII ranges:**
- `'0'` to `'9'`: 48–57
- `'A'` to `'Z'`: 65–90
- `'a'` to `'z'`: 97–122

### String Traversal

```cpp
string s = "Hello";

// Index-based
for (int i = 0; i < s.length(); i++) {
    cout << s[i];
}

// Range-based
for (char ch : s) {
    cout << ch;
}

// Reverse traversal
for (int i = s.length() - 1; i >= 0; i--) {
    cout << s[i];
}
```

### Reading Strings with Spaces

```cpp
string word;
cin >> word;                    // reads one word (stops at whitespace)

string line;
getline(cin, line);             // reads entire line including spaces

// After cin >> ..., flush the newline before getline:
cin.ignore();
getline(cin, line);
```

## Common Patterns

### Pattern 1: Character Frequency Array

Use an array of size 26 (or 128 for full ASCII) to count character occurrences:

```cpp
int freq[26] = {};
for (char ch : s) {
    if (isalpha(ch)) {
        freq[tolower(ch) - 'a']++;
    }
}
```

### Pattern 2: Two-Pointer on Strings

Check palindromes, remove characters, or compare from both ends:

```cpp
int left = 0, right = s.length() - 1;
while (left < right) {
    if (s[left] != s[right]) break;
    left++;
    right--;
}
```

### Pattern 3: Building Result Strings

Construct a new string character by character or word by word:

```cpp
string result = "";
for (char ch : s) {
    if (ch != ' ') {
        result += ch;
    }
}
```

---

## Practice Problems

### Problem 1: Check if a String is a Palindrome

**Problem Statement**

Given a string, determine whether it reads the same forwards and backwards. Consider only alphanumeric characters and ignore case.

```
Input: "racecar"
Output: true

Input: "A man, a plan, a canal: Panama"
Output: true

Input: "hello"
Output: false
```

**Approach**

Use two pointers — one starting at the beginning and one at the end. Move them toward each other, skipping non-alphanumeric characters. At each step, compare the characters (case-insensitively). If all compared pairs match, the string is a palindrome.

**Pseudo-code**

```
function isPalindrome(s):
    left = 0
    right = length(s) - 1
    while left < right:
        while left < right and s[left] is not alphanumeric:
            left++
        while left < right and s[right] is not alphanumeric:
            right--
        if toLower(s[left]) != toLower(s[right]):
            return false
        left++
        right--
    return true
```

**C++ Solution**

```cpp
#include <iostream>
#include <string>
#include <cctype>
using namespace std;

bool isPalindrome(const string& s) {
    int left = 0, right = s.length() - 1;

    while (left < right) {
        while (left < right && !isalnum(s[left])) left++;
        while (left < right && !isalnum(s[right])) right--;

        if (tolower(s[left]) != tolower(s[right])) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}

int main() {
    string s;
    getline(cin, s);

    if (isPalindrome(s)) {
        cout << "true" << endl;
    } else {
        cout << "false" << endl;
    }

    return 0;
}
```

**Complexity Analysis**
- **Time:** O(N) — each character is visited at most once by each pointer
- **Space:** O(1) — only two integer variables used

---

### Problem 2: Count Vowels and Consonants

**Problem Statement**

Given a string, count the number of vowels (a, e, i, o, u) and consonants (all other letters). Ignore non-alphabetic characters.

```
Input: "Hello World"
Output: Vowels: 3, Consonants: 7

Input: "Programming 101"
Output: Vowels: 3, Consonants: 8
```

**Approach**

Traverse each character. If it is a letter, check whether it is a vowel or consonant. A simple way to check for vowels is to use a string containing all vowels and use `find()`. Convert to lowercase first for uniform comparison.

**Pseudo-code**

```
function countVowelsConsonants(s):
    vowels = 0
    consonants = 0
    vowelSet = "aeiou"
    for each char ch in s:
        if ch is a letter:
            if toLower(ch) is in vowelSet:
                vowels++
            else:
                consonants++
    return (vowels, consonants)
```

**C++ Solution**

```cpp
#include <iostream>
#include <string>
#include <cctype>
using namespace std;

void countVowelsConsonants(const string& s, int& vowels, int& consonants) {
    vowels = 0;
    consonants = 0;
    string vowelSet = "aeiouAEIOU";

    for (char ch : s) {
        if (isalpha(ch)) {
            if (vowelSet.find(ch) != string::npos) {
                vowels++;
            } else {
                consonants++;
            }
        }
    }
}

int main() {
    string s;
    getline(cin, s);

    int vowels, consonants;
    countVowelsConsonants(s, vowels, consonants);

    cout << "Vowels: " << vowels << ", Consonants: " << consonants << endl;

    return 0;
}
```

**Complexity Analysis**
- **Time:** O(N) — single pass through the string; the `find` on a 10-character vowel string is O(1)
- **Space:** O(1) — fixed number of variables

---

### Problem 3: Reverse Words in a String

**Problem Statement**

Given a string of words separated by spaces, reverse the order of the words. Remove leading/trailing spaces and reduce multiple spaces between words to a single space.

```
Input: "  the sky is blue  "
Output: "blue is sky the"

Input: "hello world"
Output: "world hello"
```

**Approach**

1. Split the string into individual words (skipping extra spaces).
2. Reverse the list of words.
3. Join them back with a single space.

An alternative in-place approach: reverse the entire string, then reverse each individual word. The split-and-rebuild approach is cleaner and preferred in interviews for clarity.

**Pseudo-code**

```
function reverseWords(s):
    words = []
    current_word = ""
    for each char ch in s:
        if ch is not a space:
            current_word += ch
        else if current_word is not empty:
            words.append(current_word)
            current_word = ""
    if current_word is not empty:
        words.append(current_word)

    result = ""
    for i from length(words)-1 down to 0:
        result += words[i]
        if i > 0: result += " "
    return result
```

**C++ Solution**

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <sstream>
using namespace std;

string reverseWords(const string& s) {
    vector<string> words;
    istringstream stream(s);
    string word;

    while (stream >> word) {
        words.push_back(word);
    }

    string result = "";
    for (int i = words.size() - 1; i >= 0; i--) {
        result += words[i];
        if (i > 0) result += " ";
    }

    return result;
}

int main() {
    string s;
    getline(cin, s);
    cout << reverseWords(s) << endl;
    return 0;
}
```

**Complexity Analysis**
- **Time:** O(N) — parsing the string and building the result are both linear
- **Space:** O(N) — storing the individual words

---

## Practice Resources

- [LeetCode — Valid Palindrome (#125)](https://leetcode.com/problems/valid-palindrome/)
- [LeetCode — Reverse Words in a String (#151)](https://leetcode.com/problems/reverse-words-in-a-string/)
- [GeeksforGeeks — Strings in C++](https://www.geeksforgeeks.org/strings-in-cpp/)
- [HackerRank — Strings Introduction](https://www.hackerrank.com/challenges/c-tutorial-strings/problem)
- [cppreference.com — std::string](https://en.cppreference.com/w/cpp/string/basic_string)

---

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: Pointers and References →](/docs/CodingTestPreparation/Basic/05_pointers_and_references)
