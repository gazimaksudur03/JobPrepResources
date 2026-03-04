# 🧱 Object-Oriented Programming: Core Concepts & Interview Guide

---

## Class & Object

### What is a Class?
A **class** is a blueprint or template that defines the properties (attributes) and behaviors (methods) that objects of that type will have. It does not occupy memory on its own — it's a definition.

### What is an Object?
An **object** is a concrete **instance** of a class. When instantiated, memory is allocated and the object gets its own state.

```python
class Car:
    def __init__(self, brand, speed):
        self.brand = brand
        self.speed = speed

    def describe(self):
        return f"{self.brand} runs at {self.speed} km/h"

my_car = Car("Toyota", 180)
print(my_car.describe())  # Toyota runs at 180 km/h
```

> 🔑 A class is like a cookie cutter; an object is the actual cookie.

---

## The Four Pillars of OOP

---

## 1. Abstraction

Abstraction means **hiding internal complexity** and exposing only what's relevant. It focuses on *what* an object does, not *how*.

Think of a car's steering wheel — you turn it without needing to understand the hydraulics.

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -> float: pass

    @abstractmethod
    def perimeter(self) -> float: pass

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14159 * self.radius ** 2

    def perimeter(self):
        return 2 * 3.14159 * self.radius

c = Circle(5)
print(c.area())       # 78.53975
print(c.perimeter())  # 31.4159
```

> 🔑 `Shape` forces all subclasses to implement `area()` and `perimeter()` without dictating *how*.

---

## 2. Encapsulation

Encapsulation bundles **data + methods** into a class while **restricting direct access** to the internal state.

Access modifiers: `public`, `_protected`, `__private`

```python
class BankAccount:
    def __init__(self, owner, balance):
        self.owner = owner           # public
        self.__balance = balance     # private

    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount

    def withdraw(self, amount):
        if 0 < amount <= self.__balance:
            self.__balance -= amount
        else:
            raise ValueError("Insufficient funds")

    def get_balance(self):
        return self.__balance

acc = BankAccount("Alice", 1000)
acc.deposit(500)
acc.withdraw(200)
print(acc.get_balance())   # 1300
# acc.__balance            # ← AttributeError! Access blocked.
```

> 🔑 Encapsulation prevents outside code from corrupting internal state (e.g., setting a negative balance directly).

---

## 3. Inheritance

Inheritance lets a **child class** acquire properties and behaviors from a **parent class**, enabling code reuse and establishing an "is-a" relationship.

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def breathe(self):
        return f"{self.name} breathes oxygen"

class Dog(Animal):
    def speak(self):
        return f"{self.name} says: Woof!"

class Cat(Animal):
    def speak(self):
        return f"{self.name} says: Meow!"

dog = Dog("Rex")
print(dog.breathe())   # Rex breathes oxygen  ← inherited
print(dog.speak())     # Rex says: Woof!       ← defined in Dog
```

**Types of Inheritance:**

| Type | Description |
|---|---|
| Single | One child from one parent |
| Multi-level | Chain: `A → B → C` |
| Multiple | One child from multiple parents |
| Hierarchical | Multiple children from one parent |
| Hybrid | Combination of the above |

> 🔑 Prefer **composition over inheritance** when the relationship is "has-a" rather than "is-a".

---

## 4. Polymorphism

Polymorphism means **"many forms"** — the same interface behaves differently depending on the object.

**a) Compile-time (Overloading):**
```python
class Calculator:
    def add(self, a, b, c=0):
        return a + b + c

calc = Calculator()
print(calc.add(2, 3))     # 5
print(calc.add(2, 3, 4))  # 9
```

**b) Runtime (Overriding):**
```python
class Notification:
    def send(self, message):
        raise NotImplementedError

class EmailNotification(Notification):
    def send(self, message): return f"📧 Email: {message}"

class SMSNotification(Notification):
    def send(self, message): return f"📱 SMS: {message}"

class PushNotification(Notification):
    def send(self, message): return f"🔔 Push: {message}"

for notif in [EmailNotification(), SMSNotification(), PushNotification()]:
    print(notif.send("Order shipped!"))
# 📧 Email: Order shipped!
# 📱 SMS: Order shipped!
# 🔔 Push: Order shipped!
```

> 🔑 The calling code doesn't need to know *which* type it's dealing with — it just calls `.send()`.

---

## Advanced Interview Q&A

---

**Q1: What is the difference between Abstraction and Encapsulation?**

| | Abstraction | Encapsulation |
|---|---|---|
| Focus | Hiding *complexity* | Hiding *data* |
| Purpose | Show only relevant behavior | Protect internal state |
| Achieved via | Abstract classes, interfaces | Access modifiers |
| Level | Design level | Implementation level |

> *"Abstraction defines a clean interface; encapsulation enforces it."*

---

**Q2: What is the Liskov Substitution Principle (LSP)?**

*"Objects of a subclass should be substitutable for objects of the superclass without breaking the program."*

```python
# LSP Violation
class Rectangle:
    def set_width(self, w): self.width = w
    def set_height(self, h): self.height = h
    def area(self): return self.width * self.height

class Square(Rectangle):
    def set_width(self, w):
        self.width = w
        self.height = w   # Breaks Rectangle's contract!
```

A `Square` used in place of `Rectangle` produces unexpected behavior — a classic LSP violation. This is why deep inheritance hierarchies are fragile.

---

**Q3: Overloading vs Overriding?**

| | Overloading | Overriding |
|---|---|---|
| Where | Same class | Parent & child class |
| Resolved | Compile-time | Runtime |
| Signature | Different parameters | Same parameters |
| Goal | Multiple call signatures | Customize inherited behavior |

---

**Q4: What is dynamic dispatch?**

A **virtual method** is resolved at **runtime** based on the actual object type, not the reference type. In Python all methods are virtual by default; in Java/C++ you use the `virtual` keyword.

```java
Animal a = new Dog();   // reference is Animal, object is Dog
a.speak();              // → "Woof" — resolved at runtime
```

---

**Q5: Explain the Diamond Problem.**

```text
      A
     / \
    B   C
     \ /
      D
```

If `B` and `C` both override a method from `A`, which version does `D` inherit? Python resolves this with **C3 linearization (MRO)**:

```python
class D(B, C): pass

print(D().greet())   # Hello from B  (MRO: D → B → C → A)
print(D.__mro__)
```

---

**Q6: Abstract Class vs Interface?**

| | Abstract Class | Interface |
|---|---|---|
| Methods | Concrete + abstract | Only signatures (strict) |
| State | Can have instance variables | Cannot (Java/C#) |
| Inheritance | Single (Java/C#) | Multiple |
| Use case | Shared base behavior | Define a contract |

---

**Q7: Composition vs Inheritance — when to use which?**

Inheritance = "is-a" (`Dog` IS-A `Animal`). Composition = "has-a" (`Car` HAS-A `Engine`).

```python
# Composition (flexible, preferred)
class FlyingCar:
    def __init__(self):
        self.car = Car()
        self.aircraft = Aircraft()

    def fly(self): return self.aircraft.fly()
    def drive(self): return self.car.drive()
```

> *"Favor composition over inheritance"* — Gang of Four. Use inheritance only when a genuine "is-a" relationship exists.

---

**Q8: Can you achieve polymorphism without inheritance?**

Yes — through **duck typing**. If an object has the required method, it works polymorphically regardless of class hierarchy.

```python
class Robot:
    def speak(self): return "Bzzzt"

class Human:
    def speak(self): return "Hello"

for being in [Robot(), Human()]:
    print(being.speak())
```

> *"If it walks like a duck and quacks like a duck, it's a duck."*

---

**Q9: What is Method Resolution Order (MRO)?**

MRO is the order Python uses to search for a method in a class hierarchy, computed by the **C3 linearization algorithm**. Inspect it with `ClassName.__mro__` or `help(ClassName)`.

---

**Q10: Which design patterns rely on OOP pillars?**

| Pattern | Pillar(s) |
|---|---|
| Strategy | Polymorphism, Abstraction |
| Decorator | Inheritance, Composition |
| Factory Method | Abstraction, Inheritance |
| Observer | Abstraction, Encapsulation |
| Template Method | Inheritance, Polymorphism |
| Facade | Abstraction, Encapsulation |

---

## 🧠 Quick Cheat Sheet

| Concept | One-liner |
|---|---|
| **Class** | Blueprint for objects |
| **Object** | Instance of a class |
| **Abstraction** | Show what, hide how |
| **Encapsulation** | Bundle data + protect it |
| **Inheritance** | Child reuses parent's code |
| **Polymorphism** | Same interface, different behavior |

---

*"OOP is not just a set of language features — it's a way of modeling the real world in code."*

---