# ☕ Object-Oriented Programming in Java: Core Concepts & Interview Guide

---

## Class & Object

### What is a Class?
A **class** is a blueprint that defines the state (fields) and behavior (methods) of a type. It occupies no memory until instantiated.

### What is an Object?
An **object** is a concrete **instance** of a class, created with the `new` keyword, with its own allocated memory and state.

```java
public class Car {
    String brand;
    int speed;

    public Car(String brand, int speed) {
        this.brand = brand;
        this.speed = speed;
    }

    public String describe() {
        return brand + " runs at " + speed + " km/h";
    }

    public static void main(String[] args) {
        Car myCar = new Car("Toyota", 180);  // Object instantiation
        System.out.println(myCar.describe()); // Toyota runs at 180 km/h
    }
}
```

> 🔑 A class is the cookie cutter; an object is the actual cookie.

---

## The Four Pillars of OOP

---

## 1. Abstraction

Abstraction **hides internal complexity** and exposes only what the user needs. It focuses on *what* an object does, not *how* it does it.

In Java, abstraction is achieved via **abstract classes** and **interfaces**.

```java
// Abstract class
public abstract class Shape {
    public abstract double area();
    public abstract double perimeter();

    // Concrete method shared by all shapes
    public void printInfo() {
        System.out.println("Area: " + area() + ", Perimeter: " + perimeter());
    }
}

public class Circle extends Shape {
    private double radius;

    public Circle(double radius) {
        this.radius = radius;
    }

    @Override
    public double area() {
        return Math.PI * radius * radius;
    }

    @Override
    public double perimeter() {
        return 2 * Math.PI * radius;
    }
}

public class Rectangle extends Shape {
    private double width, height;

    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    @Override
    public double area() { return width * height; }

    @Override
    public double perimeter() { return 2 * (width + height); }
}

// Usage
Shape s = new Circle(5);
s.printInfo();  // Area: 78.539..., Perimeter: 31.415...
```

> 🔑 `Shape` enforces a contract — every subclass *must* implement `area()` and `perimeter()` — without dictating *how*.

---

## 2. Encapsulation

Encapsulation **bundles fields and methods** into a class and **restricts direct access** using access modifiers, protecting internal state from unintended interference.

**Java access modifiers:**
- `public` — accessible from anywhere
- `protected` — accessible within the package and subclasses
- `private` — accessible only within the class
- *(default)* — accessible within the package

```java
public class BankAccount {
    private String owner;    // private — hidden from outside
    private double balance;  // private — hidden from outside

    public BankAccount(String owner, double initialBalance) {
        this.owner = owner;
        this.balance = initialBalance;
    }

    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }

    public void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
        } else {
            throw new IllegalArgumentException("Insufficient funds");
        }
    }

    // Controlled read access via getter
    public double getBalance() {
        return balance;
    }

    public String getOwner() {
        return owner;
    }
}

// Usage
BankAccount acc = new BankAccount("Alice", 1000);
acc.deposit(500);
acc.withdraw(200);
System.out.println(acc.getBalance()); // 1300.0

// acc.balance = -9999;  ← Compile error! Direct access blocked.
```

> 🔑 Encapsulation ensures no external code can put the account into an invalid state (e.g., a negative balance).

---

## 3. Inheritance

Inheritance lets a **subclass** acquire the fields and methods of a **superclass**, establishing an "is-a" relationship and enabling code reuse. Java uses the `extends` keyword.

```java
public class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    public String breathe() {
        return name + " breathes oxygen";
    }
}

public class Dog extends Animal {
    public Dog(String name) {
        super(name); // Call parent constructor
    }

    public String speak() {
        return name + " says: Woof!";
    }
}

public class Cat extends Animal {
    public Cat(String name) {
        super(name);
    }

    public String speak() {
        return name + " says: Meow!";
    }
}

// Usage
Dog dog = new Dog("Rex");
Cat cat = new Cat("Whiskers");

System.out.println(dog.breathe()); // Rex breathes oxygen  ← inherited
System.out.println(dog.speak());   // Rex says: Woof!
System.out.println(cat.speak());   // Whiskers says: Meow!
```

### Using `super`
```java
public class ElectricDog extends Dog {
    public ElectricDog(String name) {
        super(name);
    }

    @Override
    public String speak() {
        return super.speak() + " (but electric)";
        // Rex says: Woof! (but electric)
    }
}
```

**Types of Inheritance:**

| Type | Java Support | Description |
|---|---|---|
| Single | ✅ | One class extends one parent |
| Multi-level | ✅ | `A → B → C` chain |
| Hierarchical | ✅ | Multiple classes extend one parent |
| Multiple | ❌ (classes) / ✅ (interfaces) | Java prevents class-level multiple inheritance |
| Hybrid | ✅ (via interfaces) | Combination of the above |

> 🔑 Java intentionally forbids multiple class inheritance to avoid the Diamond Problem — but allows it through interfaces.

---

## 4. Polymorphism

Polymorphism means **"many forms"** — the same method name behaves differently depending on the object or parameters.

### a) Compile-time Polymorphism — Method Overloading

Same method name, different parameter signatures, resolved at **compile time**.

```java
public class Calculator {
    public int add(int a, int b) {
        return a + b;
    }

    public double add(double a, double b) {
        return a + b;
    }

    public int add(int a, int b, int c) {
        return a + b + c;
    }
}

// Usage
Calculator calc = new Calculator();
System.out.println(calc.add(2, 3));        // 5
System.out.println(calc.add(2.5, 3.1));    // 5.6
System.out.println(calc.add(1, 2, 3));     // 6
```

### b) Runtime Polymorphism — Method Overriding

A subclass overrides a parent method. The actual method called is determined at **runtime** based on the object type.

```java
public class Notification {
    public String send(String message) {
        return "Sending: " + message;
    }
}

public class EmailNotification extends Notification {
    @Override
    public String send(String message) {
        return "📧 Email sent: " + message;
    }
}

public class SMSNotification extends Notification {
    @Override
    public String send(String message) {
        return "📱 SMS sent: " + message;
    }
}

public class PushNotification extends Notification {
    @Override
    public String send(String message) {
        return "🔔 Push sent: " + message;
    }
}

// Polymorphic usage — parent reference, child objects
Notification[] notifications = {
    new EmailNotification(),
    new SMSNotification(),
    new PushNotification()
};

for (Notification n : notifications) {
    System.out.println(n.send("Your order has shipped!"));
}
// 📧 Email sent: Your order has shipped!
// 📱 SMS sent: Your order has shipped!
// 🔔 Push sent: Your order has shipped!
```

> 🔑 The reference type is `Notification`, but Java calls the correct overridden method at runtime via dynamic dispatch.

---

## Advanced Interview Q&A

---

**Q1: What is the difference between Abstraction and Encapsulation?**

| | Abstraction | Encapsulation |
|---|---|---|
| **Focus** | Hiding *complexity* | Hiding *data* |
| **Purpose** | Show only relevant behavior | Protect internal state |
| **Achieved via** | `abstract` classes, `interface` | `private`/`protected` modifiers + getters/setters |
| **Level** | Design level | Implementation level |

> *"Abstraction defines a clean interface — encapsulation enforces it. You often use both together: an interface abstracts the behavior, and the implementing class encapsulates the details."*

---

**Q2: What is the Liskov Substitution Principle (LSP)?**

*"Objects of a subclass should be substitutable for objects of the superclass without altering the correctness of the program."*

```java
// LSP Violation
class Rectangle {
    protected int width, height;
    public void setWidth(int w)  { this.width = w; }
    public void setHeight(int h) { this.height = h; }
    public int area() { return width * height; }
}

class Square extends Rectangle {
    @Override
    public void setWidth(int w) {
        this.width = w;
        this.height = w;  // Forces equal sides — breaks Rectangle's contract!
    }
}

// This breaks when Square is used as a Rectangle:
Rectangle r = new Square();
r.setWidth(5);
r.setHeight(10);
System.out.println(r.area()); // Expected 50, got 100! ← LSP violated
```

**Fix:** Don't model Square as a subclass of Rectangle. Use a common interface like `Shape` instead.

---

**Q3: What is the difference between an `abstract class` and an `interface` in Java?**

| | Abstract Class | Interface |
|---|---|---|
| **Methods** | Abstract + concrete | Abstract by default; `default`/`static` since Java 8 |
| **Fields** | Instance variables allowed | Only `public static final` constants |
| **Constructor** | Has constructor | No constructor |
| **Inheritance** | `extends` (single only) | `implements` (multiple allowed) |
| **Use case** | Shared base behavior + state | Define a capability contract |

```java
// Abstract class — "is-a" with shared state
abstract class Vehicle {
    protected String brand;

    public Vehicle(String brand) { this.brand = brand; }
    public abstract void startEngine();

    public String getBrand() { return brand; } // concrete method
}

// Interface — "can-do" contract
interface Chargeable {
    void charge();            // abstract by default
    default void checkPort() {  // default method (Java 8+)
        System.out.println("Checking charge port...");
    }
}

// A class can extend ONE abstract class and implement MANY interfaces
class ElectricCar extends Vehicle implements Chargeable {
    public ElectricCar(String brand) { super(brand); }

    @Override public void startEngine() { System.out.println("Silent start!"); }
    @Override public void charge() { System.out.println("Charging..."); }
}
```

---

**Q4: What is dynamic dispatch and how does Java implement it?**

**Dynamic dispatch** means the JVM resolves which overridden method to call at **runtime**, based on the actual object type — not the reference type. Java achieves this through the **virtual method table (vtable)**.

```java
Animal a = new Dog("Rex");  // reference type: Animal, object type: Dog
a.speak();                   // → "Rex says: Woof!" — resolved at runtime
```

All non-`static`, non-`final`, non-`private` methods in Java are virtual by default. Marking a method `final` removes it from dynamic dispatch.

---

**Q5: Explain the Diamond Problem and how Java solves it.**

```
        A
       / \
      B   C
       \ /
        D
```

If `B` and `C` both override `A`'s method, and `D` inherits from both — which version does `D` use? Java **prevents this at the class level** by disallowing multiple class inheritance.

With interfaces, Java 8+ allows `default` methods, which can reintroduce ambiguity:

```java
interface A { default String greet() { return "Hello from A"; } }
interface B extends A { default String greet() { return "Hello from B"; } }
interface C extends A { default String greet() { return "Hello from C"; } }

class D implements B, C {
    @Override
    public String greet() {
        return B.super.greet(); // Must explicitly resolve — compiler forces this!
    }
}
```

> Java forces `D` to **explicitly override** the ambiguous method, making the resolution a compile-time requirement.

---

**Q6: What is method overloading vs method overriding?**

| | Overloading | Overriding |
|---|---|---|
| **Location** | Same class | Parent & subclass |
| **Resolution** | Compile-time (static binding) | Runtime (dynamic binding) |
| **Signature** | Must differ | Must be identical |
| **Return type** | Can differ | Must be same (or covariant) |
| **Access modifier** | Can differ | Cannot be more restrictive |
| **Annotation** | None required | `@Override` recommended |

```java
// Overloading — same class, different signatures
class Printer {
    void print(String s)  { System.out.println("String: " + s); }
    void print(int n)     { System.out.println("Int: " + n); }
    void print(String s, int copies) { /* ... */ }
}

// Overriding — subclass redefines parent method
class Animal   { String speak() { return "..."; } }
class Dog extends Animal {
    @Override String speak() { return "Woof!"; }
}
```

---

**Q7: Composition vs Inheritance — when do you prefer which?**

Use **inheritance** for "is-a" relationships where the child is truly a specialized version of the parent. Use **composition** for "has-a" relationships — it's more flexible and avoids fragile hierarchies.

```java
// Inheritance (tight coupling — breaks if parent changes)
class FlyingCar extends Car { /* inherits everything from Car */ }

// Composition (flexible — each piece evolves independently)
class FlyingCar {
    private Car car;
    private Aircraft aircraft;

    public FlyingCar() {
        this.car = new Car();
        this.aircraft = new Aircraft();
    }

    public void drive() { car.drive(); }
    public void fly()   { aircraft.fly(); }
}
```

> *"Favor composition over inheritance."* — Gang of Four, Design Patterns (1994)

---

**Q8: What is the `final` keyword and how does it relate to OOP?**

| Usage | Effect |
|---|---|
| `final` class | Cannot be subclassed (e.g., `String`) |
| `final` method | Cannot be overridden by subclasses |
| `final` variable | Value cannot be reassigned (constant) |

```java
public final class ImmutablePoint {
    private final int x;
    private final int y;

    public ImmutablePoint(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public int getX() { return x; }
    public int getY() { return y; }
    // No setters — state cannot change after construction
}
```

`final` classes are used for immutability (e.g., `String`, `Integer`) and security — preventing malicious subclassing.

---

**Q9: What is upcasting and downcasting in Java?**

```java
// Upcasting — implicit, always safe
Animal a = new Dog("Rex");   // Dog IS-A Animal ✅

// Downcasting — explicit, requires instanceof check
if (a instanceof Dog) {
    Dog d = (Dog) a;
    d.fetch();  // Dog-specific method
}

// Java 16+ pattern matching
if (a instanceof Dog d) {
    d.fetch();  // Cleaner syntax, no explicit cast needed
}
```

Upcasting enables polymorphism. Downcasting allows access to subclass-specific behavior but risks `ClassCastException` if done carelessly.

---

**Q10: Which design patterns rely heavily on OOP pillars?**

| Pattern | Java Mechanism | Pillar(s) |
|---|---|---|
| **Strategy** | Interface + multiple implementations | Polymorphism, Abstraction |
| **Decorator** | Wraps an interface with additional behavior | Inheritance, Composition |
| **Factory Method** | Abstract creator with subclass implementations | Abstraction, Inheritance |
| **Observer** | Interface for listeners, encapsulated subject | Abstraction, Encapsulation |
| **Template Method** | Abstract class with hook methods | Inheritance, Polymorphism |
| **Facade** | Hides complex subsystem behind simple API | Abstraction, Encapsulation |

```java
// Strategy Pattern — classic OOP polymorphism
interface SortStrategy {
    void sort(int[] arr);
}

class BubbleSort implements SortStrategy {
    public void sort(int[] arr) { /* bubble sort logic */ }
}

class QuickSort implements SortStrategy {
    public void sort(int[] arr) { /* quicksort logic */ }
}

class Sorter {
    private SortStrategy strategy;

    public Sorter(SortStrategy strategy) {
        this.strategy = strategy;
    }

    public void sort(int[] arr) {
        strategy.sort(arr);  // Polymorphic call
    }
}
```

---

## 🧠 Quick Cheat Sheet

| Concept | Java Keyword(s) | One-liner |
|---|---|---|
| **Class** | `class` | Blueprint for objects |
| **Object** | `new` | Instance of a class |
| **Abstraction** | `abstract`, `interface` | Show what, hide how |
| **Encapsulation** | `private`, getters/setters | Bundle data + protect it |
| **Inheritance** | `extends`, `super` | Child reuses parent's code |
| **Polymorphism** | `@Override`, dynamic dispatch | Same interface, different behavior |

---

*"OOP is not just a set of language features — it's a way of modeling the real world in code."*

---