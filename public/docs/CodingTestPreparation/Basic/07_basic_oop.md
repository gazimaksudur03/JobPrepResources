# Basic Object-Oriented Programming in C++

[← Back to Coding Test Home](/docs/CodingTestPreparation/coding_test_preparation)

---

## Overview

Object-Oriented Programming (OOP) is a programming paradigm that organizes code around **objects** — bundles of data (attributes) and the functions (methods) that operate on that data. C++ was one of the first mainstream languages to support OOP, and nearly every coding interview expects you to be comfortable with classes, inheritance, and polymorphism.

The four pillars of OOP are **Encapsulation**, **Abstraction**, **Inheritance**, and **Polymorphism**. Encapsulation means bundling data with the methods that modify it and restricting direct access. Abstraction means exposing only what a caller needs while hiding internal details. Inheritance lets a new class reuse and extend the behavior of an existing one. Polymorphism allows different classes to be used through the same interface.

In coding interviews, OOP questions typically appear as "design a class" prompts. You will be asked to model real-world entities, manage state, and demonstrate that you understand access control and the relationship between base and derived classes. Mastering these fundamentals also makes your solutions cleaner and more modular.

## Key Concepts

### Classes and Objects

A **class** is a user-defined type that serves as a blueprint. An **object** is an instance of that class.

```cpp
class Dog {
public:
    std::string name;
    int age;

    void bark() {
        std::cout << name << " says Woof!" << std::endl;
    }
};

int main() {
    Dog d;
    d.name = "Rex";
    d.age = 3;
    d.bark(); // Rex says Woof!
}
```

### Constructors and Destructors

A **constructor** initializes an object when it is created. A **destructor** cleans up when it goes out of scope. Prefer initializer lists for efficiency.

```cpp
class Point {
    double x, y;
public:
    // Default constructor
    Point() : x(0), y(0) {}

    // Parameterized constructor
    Point(double x, double y) : x(x), y(y) {}

    // Copy constructor
    Point(const Point& other) : x(other.x), y(other.y) {}

    // Destructor
    ~Point() {
        // Release resources if any
    }
};
```

### Access Modifiers

| Modifier    | Accessible Inside Class | Accessible in Derived Class | Accessible Outside |
|-------------|:-----------------------:|:---------------------------:|:------------------:|
| `public`    | Yes | Yes | Yes |
| `protected` | Yes | Yes | No  |
| `private`   | Yes | No  | No  |

```cpp
class Account {
private:
    double balance;       // only this class can touch it

protected:
    std::string owner;    // derived classes can access

public:
    Account(const std::string& owner, double balance)
        : owner(owner), balance(balance) {}

    double getBalance() const { return balance; }
};
```

### Encapsulation

Keep data `private` and expose controlled access through public getter/setter methods. This prevents external code from putting the object into an invalid state.

```cpp
class Temperature {
    double celsius;
public:
    Temperature(double c) : celsius(c) {}

    double getCelsius() const { return celsius; }
    double getFahrenheit() const { return celsius * 9.0 / 5.0 + 32.0; }

    void setCelsius(double c) {
        if (c < -273.15) throw std::invalid_argument("Below absolute zero");
        celsius = c;
    }
};
```

### Inheritance

A derived class **inherits** members from a base class, promoting code reuse.

```cpp
class Animal {
protected:
    std::string name;
public:
    Animal(const std::string& n) : name(n) {}
    void eat() { std::cout << name << " is eating.\n"; }
};

class Cat : public Animal {
public:
    Cat(const std::string& n) : Animal(n) {}
    void purr() { std::cout << name << " purrs.\n"; }
};

int main() {
    Cat c("Whiskers");
    c.eat();  // inherited
    c.purr(); // own method
}
```

### Polymorphism and Virtual Functions

**Polymorphism** lets a base-class pointer/reference call the derived class's override at runtime. This requires the `virtual` keyword.

```cpp
class Shape {
public:
    virtual double area() const = 0; // pure virtual → Shape is abstract
    virtual ~Shape() = default;      // always make destructors virtual
};

class Circle : public Shape {
    double radius;
public:
    Circle(double r) : radius(r) {}
    double area() const override { return 3.14159265 * radius * radius; }
};

class Square : public Shape {
    double side;
public:
    Square(double s) : side(s) {}
    double area() const override { return side * side; }
};

void printArea(const Shape& s) {
    std::cout << "Area = " << s.area() << "\n";
}

int main() {
    Circle c(5);
    Square sq(4);
    printArea(c);  // Area = 78.5398
    printArea(sq); // Area = 16
}
```

### Abstraction

Abstract classes define **interfaces** via pure virtual functions (`= 0`). They cannot be instantiated; they force derived classes to implement the contract.

```cpp
class Drawable {
public:
    virtual void draw() const = 0;
    virtual ~Drawable() = default;
};
```

## Common Patterns

### Pattern 1 — Encapsulated Data with Validation

Interviewers frequently ask you to design classes where setters validate input before modifying internal state. Always keep invariants inside the class.

### Pattern 2 — Shape / Vehicle / Animal Hierarchy

A classic OOP interview scenario: define a base class with a pure virtual method, then create multiple derived classes that override it. The interviewer checks whether you use `virtual`, `override`, and a virtual destructor.

### Pattern 3 — Operator or Method Overriding

Derived classes provide specialized behavior. The base class pointer selects the right function at runtime. Remember: without `virtual`, the base version is called (static binding).

### Pattern 4 — Constructor Chaining

Derived constructors should call the base constructor via an initializer list. Forgetting this is a common interview pitfall.

---

## Practice Problems

### Problem 1: Rectangle Class

**Problem Statement**

Design a `Rectangle` class with:
- Private members `width` and `height`.
- A parameterized constructor.
- Methods `area()` and `perimeter()` that return the respective values.

```
Input:  Rectangle r(5, 3);
Output: r.area() → 15, r.perimeter() → 16
```

**Approach**

Store `width` and `height` as private doubles. Expose read-only computation methods. Use the constructor initializer list.

**Pseudo-code**

```
class Rectangle:
    private width, height
    constructor(w, h):
        width = w
        height = h
    area():
        return width * height
    perimeter():
        return 2 * (width + height)
```

**C++ Solution**

```cpp
#include <iostream>

class Rectangle {
    double width, height;
public:
    Rectangle(double w, double h) : width(w), height(h) {}

    double area() const {
        return width * height;
    }

    double perimeter() const {
        return 2.0 * (width + height);
    }

    void print() const {
        std::cout << "Width: " << width
                  << ", Height: " << height
                  << ", Area: " << area()
                  << ", Perimeter: " << perimeter() << "\n";
    }
};

int main() {
    Rectangle r(5, 3);
    r.print();
    // Width: 5, Height: 3, Area: 15, Perimeter: 16

    Rectangle sq(4, 4);
    sq.print();
    // Width: 4, Height: 4, Area: 16, Perimeter: 16

    return 0;
}
```

**Complexity Analysis**

- **Time:** O(1) for both `area()` and `perimeter()` — simple arithmetic.
- **Space:** O(1) — the object stores only two doubles.

---

### Problem 2: Simple Bank Account

**Problem Statement**

Implement a `BankAccount` class that supports:
- `deposit(amount)` — adds money (amount must be positive).
- `withdraw(amount)` — removes money if sufficient balance exists; otherwise prints an error.
- `getBalance()` — returns the current balance.

```
Input:
  BankAccount acc("Alice", 1000);
  acc.deposit(500);
  acc.withdraw(200);
  acc.getBalance();
Output: 1300
```

**Approach**

Encapsulate `balance` as a private member. Validate inputs in `deposit` and `withdraw`. Prevent negative balances by checking before subtracting.

**Pseudo-code**

```
class BankAccount:
    private balance, owner
    constructor(owner, initial):
        this.owner = owner
        balance = initial
    deposit(amount):
        if amount <= 0: print error, return
        balance += amount
    withdraw(amount):
        if amount <= 0: print error, return
        if amount > balance: print "Insufficient funds", return
        balance -= amount
    getBalance():
        return balance
```

**C++ Solution**

```cpp
#include <iostream>
#include <string>

class BankAccount {
    std::string owner;
    double balance;
public:
    BankAccount(const std::string& owner, double initial)
        : owner(owner), balance(initial) {}

    void deposit(double amount) {
        if (amount <= 0) {
            std::cerr << "Deposit amount must be positive.\n";
            return;
        }
        balance += amount;
    }

    void withdraw(double amount) {
        if (amount <= 0) {
            std::cerr << "Withdrawal amount must be positive.\n";
            return;
        }
        if (amount > balance) {
            std::cerr << "Insufficient funds. Current balance: " << balance << "\n";
            return;
        }
        balance -= amount;
    }

    double getBalance() const { return balance; }

    void printStatement() const {
        std::cout << "Account: " << owner
                  << " | Balance: $" << balance << "\n";
    }
};

int main() {
    BankAccount acc("Alice", 1000);
    acc.deposit(500);
    acc.withdraw(200);
    acc.printStatement(); // Account: Alice | Balance: $1300

    acc.withdraw(2000);   // Insufficient funds. Current balance: 1300

    return 0;
}
```

**Complexity Analysis**

- **Time:** O(1) for every operation — direct arithmetic and comparisons.
- **Space:** O(1) — stores a string and a double.

---

### Problem 3: Shape Hierarchy with Polymorphic Area

**Problem Statement**

Create an abstract `Shape` base class with a pure virtual `area()` method. Derive `Circle`, `Rectangle`, and `Triangle` from it. Write a function that takes a `vector<Shape*>` and prints the area of each shape.

```
Input:  Circle(5), Rectangle(4, 6), Triangle(3, 8)
Output: 78.5398, 24, 12
```

**Approach**

Define `Shape` with `virtual double area() const = 0` and a virtual destructor. Each derived class stores its own dimensions and overrides `area()`. Iterate over a container of `Shape*` to leverage runtime polymorphism.

**Pseudo-code**

```
abstract class Shape:
    virtual area() -> double

class Circle extends Shape:
    radius
    area() -> pi * radius * radius

class Rectangle extends Shape:
    width, height
    area() -> width * height

class Triangle extends Shape:
    base, height
    area() -> 0.5 * base * height

function printAreas(shapes[]):
    for each shape in shapes:
        print shape.area()
```

**C++ Solution**

```cpp
#include <iostream>
#include <vector>
#include <cmath>
#include <memory>

class Shape {
public:
    virtual double area() const = 0;
    virtual std::string name() const = 0;
    virtual ~Shape() = default;
};

class Circle : public Shape {
    double radius;
public:
    Circle(double r) : radius(r) {}
    double area() const override { return M_PI * radius * radius; }
    std::string name() const override { return "Circle"; }
};

class Rectangle : public Shape {
    double width, height;
public:
    Rectangle(double w, double h) : width(w), height(h) {}
    double area() const override { return width * height; }
    std::string name() const override { return "Rectangle"; }
};

class Triangle : public Shape {
    double base, height;
public:
    Triangle(double b, double h) : base(b), height(h) {}
    double area() const override { return 0.5 * base * height; }
    std::string name() const override { return "Triangle"; }
};

void printAreas(const std::vector<std::unique_ptr<Shape>>& shapes) {
    for (const auto& s : shapes) {
        std::cout << s->name() << " area = " << s->area() << "\n";
    }
}

int main() {
    std::vector<std::unique_ptr<Shape>> shapes;
    shapes.push_back(std::make_unique<Circle>(5));
    shapes.push_back(std::make_unique<Rectangle>(4, 6));
    shapes.push_back(std::make_unique<Triangle>(3, 8));

    printAreas(shapes);
    // Circle area = 78.5398
    // Rectangle area = 24
    // Triangle area = 12

    return 0;
}
```

**Complexity Analysis**

- **Time:** O(n) where n is the number of shapes — one virtual call per shape.
- **Space:** O(n) — storing n shape pointers. Each shape object itself is O(1).

---

## Practice Resources

- [LeetCode — Design Parking System (easy OOP warm-up)](https://leetcode.com/problems/design-parking-system/)
- [GeeksforGeeks — OOP Concepts in C++](https://www.geeksforgeeks.org/object-oriented-programming-in-cpp/)
- [GeeksforGeeks — Virtual Functions and Runtime Polymorphism](https://www.geeksforgeeks.org/virtual-functions-and-runtime-polymorphism-in-cpp/)
- [Cplusplus.com — Classes Tutorial](https://cplusplus.com/doc/tutorial/classes/)
- [LeetCode — Design Browser History](https://leetcode.com/problems/design-browser-history/)

---

[← Back to Home](/docs/CodingTestPreparation/coding_test_preparation) | [Next: STL Basics →](/docs/CodingTestPreparation/Basic/08_stl_basics)
