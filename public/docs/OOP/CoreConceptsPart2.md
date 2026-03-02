

# 📘 OOP Deep Dive: Interfaces, Abstract Classes & Methods, and Access Modifiers

This guide builds on top of the core OOP concepts and dives deeper into three critical topics that are fundamental to writing clean, scalable, and well-structured Java code.

---

## 1. Abstract Classes & Abstract Methods

### **The Concept**

An **Abstract Class** is a class that cannot be instantiated on its own. It serves as an incomplete blueprint that must be completed by a child class. Think of it like a template — it can contain both complete (concrete) and incomplete (abstract) methods.

An **Abstract Method** is a method declared without a body (no `{}`). It forces the child class to provide its own implementation.

### **Rules to Remember**
*   Declared using the `abstract` keyword.
*   **Cannot be instantiated** directly (no `new AbstractClass()`).
*   **Can have constructors** (used to initialize common fields for child classes).
*   Can contain a mix of `abstract` methods (no body) and `concrete` methods (with body).
*   Can have instance variables (state), `static` variables, and `final` variables.
*   If a class has even **one** abstract method, the class **must** be declared abstract.
*   A child class that extends an abstract class **must** override all abstract methods, or it must also be declared abstract.

### **Code Example**

```java
// Abstract Class
abstract class Shape {

    String color; // Instance variable (state)

    // Constructor
    public Shape(String color) {
        this.color = color;
    }

    // Abstract Method: No body. Child MUST implement this.
    abstract double calculateArea();

    // Concrete Method: Has a body. Shared by all children.
    public void displayColor() {
        System.out.println("Shape color is: " + color);
    }
}

// Concrete Child Class 1
class Circle extends Shape {
    double radius;

    public Circle(String color, double radius) {
        super(color); // Calls Shape's constructor
        this.radius = radius;
    }

    @Override
    double calculateArea() {
        return Math.PI * radius * radius;
    }
}

// Concrete Child Class 2
class Rectangle extends Shape {
    double length, width;

    public Rectangle(String color, double length, double width) {
        super(color);
        this.length = length;
        this.width = width;
    }

    @Override
    double calculateArea() {
        return length * width;
    }
}

// Main Class
public class Main {
    public static void main(String[] args) {
        Shape circle = new Circle("Red", 5.0);
        Shape rectangle = new Rectangle("Blue", 4.0, 6.0);

        circle.displayColor();       // Output: Shape color is: Red
        System.out.println("Area: " + circle.calculateArea()); // Output: Area: 78.53...

        rectangle.displayColor();    // Output: Shape color is: Blue
        System.out.println("Area: " + rectangle.calculateArea()); // Output: Area: 24.0
    }
}
```

### 🧠 Advanced Interview Q&A

**Q: Can an abstract class have a constructor? If yes, why, since you cannot instantiate it?**
> **A:** Yes, an abstract class **can** have a constructor. Even though you cannot create an object of the abstract class directly, the constructor is called when a **child class is instantiated**. It is used to initialize common fields defined in the abstract class. The child class constructor calls `super()` to invoke it.

**Q: Can an abstract class have no abstract methods at all?**
> **A:** Yes, it is perfectly valid. You might do this when you want to prevent the class from being instantiated directly but still want to provide shared concrete methods. A common real-world example is `HttpServlet` in the Servlet API.

**Q: Can an abstract method be `static` or `final` or `private`?**
> **A:** **No** to all three.
> *   `static`: Static methods belong to the class and cannot be overridden. Abstract methods require overriding.
> *   `final`: Final methods cannot be overridden. Abstract methods *must* be overridden. This is a direct contradiction.
> *   `private`: Private methods are not visible to child classes. Abstract methods must be overridden by child classes. This is also a contradiction.

---

## 2. Interfaces

### **The Concept**

An **Interface** is a contract or a set of rules that a class agrees to follow. It defines *what* a class must do, but not *how* it does it. It is the primary mechanism for achieving **100% abstraction** and **multiple inheritance** in Java.

Think of it like a job description: it lists the required skills (methods), and anyone who applies (a class that implements it) must have those skills.

### **Evolution of Interfaces in Java**

| Java Version | What Interfaces Can Contain |
| :--- | :--- |
| **Java 7 and below** | Only `public abstract` methods and `public static final` constants. |
| **Java 8** | Added `default` methods (with body) and `static` methods (with body). |
| **Java 9+** | Added `private` methods (helper methods for default methods). |

### **Rules to Remember**
*   Declared using the `interface` keyword.
*   A class uses the `implements` keyword to implement an interface.
*   A class can implement **multiple** interfaces (solves the multiple inheritance problem).
*   An interface can **extend** another interface (using `extends`).
*   All variables in an interface are implicitly `public`, `static`, and `final`.
*   All methods (before Java 8) are implicitly `public` and `abstract`.
*   **Cannot have constructors.**
*   **Cannot have instance variables (state).**

### **Code Example**

```java
// Interface 1
interface Printable {
    void print(); // implicitly public and abstract
}

// Interface 2
interface Showable {
    void show(); // implicitly public and abstract
}

// Interface 3 with default and static methods (Java 8+)
interface Loggable {

    // Abstract method
    void log(String message);

    // Default method: Has a body. Implementing class CAN override it.
    default void logInfo(String message) {
        System.out.println("[INFO]: " + message);
    }

    // Static method: Belongs to the interface. Cannot be overridden.
    static void logError(String message) {
        System.out.println("[ERROR]: " + message);
    }
}

// A class implementing MULTIPLE interfaces
class Document implements Printable, Showable, Loggable {

    @Override
    public void print() {
        System.out.println("Printing document...");
    }

    @Override
    public void show() {
        System.out.println("Showing document...");
    }

    @Override
    public void log(String message) {
        System.out.println("[LOG]: " + message);
    }
}

// Main Class
public class Main {
    public static void main(String[] args) {
        Document doc = new Document();
        doc.print();                  // Output: Printing document...
        doc.show();                   // Output: Showing document...
        doc.log("Document created");  // Output: [LOG]: Document created
        doc.logInfo("All good");      // Output: [INFO]: All good

        // Static method is called on the Interface itself
        Loggable.logError("File not found"); // Output: [ERROR]: File not found
    }
}
```

### **Interface vs. Abstract Class: A Head-to-Head Comparison**

| Feature | Abstract Class | Interface |
| :--- | :--- | :--- |
| **Keyword** | `abstract class` | `interface` |
| **Methods** | Abstract + Concrete | Abstract + Default + Static + Private (Java 9) |
| **Variables** | Any type (instance, static, final) | Only `public static final` (constants) |
| **Constructors** | ✅ Yes | ❌ No |
| **State (Instance Variables)** | ✅ Yes | ❌ No |
| **Multiple Inheritance** | ❌ No (single `extends`) | ✅ Yes (multiple `implements`) |
| **Access Modifiers** | Any (`public`, `private`, `protected`) | Methods are `public` by default |
| **When to Use?** | When classes share a **common state and behavior** (IS-A). | When unrelated classes need to follow a **common contract** (CAN-DO). |

### 🧠 Advanced Interview Q&A

**Q: What is the Diamond Problem, and how do Java 8 `default` methods bring it back?**
> **A:** The Diamond Problem occurs when a class inherits from two sources that have the same method. With `default` methods in interfaces, this can happen:
> ```java
> interface A { default void hello() { System.out.println("A"); } }
> interface B { default void hello() { System.out.println("B"); } }
> class C implements A, B { } // COMPILE ERROR!
> ```
> Java forces `Class C` to **explicitly override** the `hello()` method and resolve the conflict manually:
> ```java
> class C implements A, B {
>     @Override
>     public void hello() {
>         A.super.hello(); // Explicitly choosing A's version
>     }
> }
> ```

**Q: What is a Marker Interface? Give examples.**
> **A:** A Marker Interface is an interface with **no methods or constants** inside it. It is used to "mark" or tag a class with a special capability. The JVM or framework checks at runtime if a class implements the marker interface.
> *   `Serializable`: Marks a class so its objects can be serialized.
> *   `Cloneable`: Marks a class so its objects can be cloned using `clone()`.
> *   `Remote`: Marks a class for Remote Method Invocation (RMI).
> In modern Java, Annotations (like `@Entity`) have largely replaced the need for marker interfaces.

**Q: What is a Functional Interface?**
> **A:** A Functional Interface is an interface that has **exactly one abstract method**. It can have any number of `default` or `static` methods. It is annotated with `@FunctionalInterface` and is the foundation for **Lambda Expressions** in Java 8.
> ```java
> @FunctionalInterface
> interface Calculator {
>     int calculate(int a, int b); // Only ONE abstract method
> }
>
> // Usage with Lambda
> Calculator add = (a, b) -> a + b;
> System.out.println(add.calculate(5, 3)); // Output: 8
> ```

---

## 3. Access Modifiers

### **The Concept**

Access Modifiers are keywords that define the **visibility and accessibility** of classes, methods, constructors, and variables. They are the backbone of **Encapsulation**. Java provides four levels of access control:

1.  `private`
2.  `default` (No keyword)
3.  `protected`
4.  `public`

### **The Scope Table**

| Modifier | Same Class | Same Package | Subclass (Different Package) | Everywhere (World) |
| :--- | :---: | :---: | :---: | :---: |
| `private` | ✅ | ❌ | ❌ | ❌ |
| `default` | ✅ | ✅ | ❌ | ❌ |
| `protected` | ✅ | ✅ | ✅ | ❌ |
| `public` | ✅ | ✅ | ✅ | ✅ |

> **Memory Tip:** Think of it as expanding circles of trust: `private` → `default` → `protected` → `public`.

### **Detailed Breakdown**

#### A. `private` — Most Restrictive
Accessible only within the **same class**.

```java
class BankAccount {
    private double balance = 1000; // Only this class can touch this

    private void updateBalance(double amount) {
        this.balance += amount;
    }

    public void deposit(double amount) {
        if (amount > 0) {
            updateBalance(amount); // Private method used internally
        }
    }
}
```
> **Use case:** For internal data and helper methods that should never be exposed.

---

#### B. `default` (Package-Private) — No Keyword
Accessible within the **same class** and **same package**.

```java
// File: com/myapp/service/UserService.java
package com.myapp.service;

class UserService { // default class: only visible within com.myapp.service
    void createUser() { // default method
        System.out.println("User created");
    }
}
```
> **Use case:** For classes/methods that are internal to a specific package.

---

#### C. `protected` — Package + Subclass Access
Accessible within the **same class**, **same package**, and by **subclasses in other packages** (via inheritance).

```java
// File: com/myapp/core/BaseController.java
package com.myapp.core;

public class BaseController {
    protected void validateRequest() { // Accessible to all subclasses
        System.out.println("Request validated.");
    }
}

// File: com/myapp/api/UserController.java
package com.myapp.api; // DIFFERENT package

import com.myapp.core.BaseController;

public class UserController extends BaseController {
    public void handleRequest() {
        validateRequest(); // ✅ Works! Accessible because it's a subclass.
    }
}
```
> **Use case:** For methods/fields designed to be inherited but not publicly available.

---

#### D. `public` — Least Restrictive
Accessible from **anywhere**.

```java
public class Application {
    public static void main(String[] args) { // Must be public
        System.out.println("Application started.");
    }
}
```
> **Use case:** For APIs, public methods, and the main method.

---

### **Access Modifiers on Classes**

*   A **top-level class** (outer class) can only be `public` or `default`.
*   An **inner class** (nested class) can use all four modifiers: `private`, `default`, `protected`, `public`.

```java
public class OuterClass {       // public or default only
    private class InnerClass {} // All four modifiers allowed here
}
```

### **Applying Modifiers: A Real-World Class Design**

```java
public class Employee {

    // PRIVATE: Hidden state. Only this class manages it.
    private int id;
    private String name;
    private double salary;

    // PUBLIC: Constructor accessible to everyone.
    public Employee(int id, String name, double salary) {
        this.id = id;
        this.name = name;
        this.salary = salary;
    }

    // PUBLIC: Getters for the outside world.
    public String getName() {
        return name;
    }

    // PROTECTED: Only subclasses (like Manager) can see the salary.
    protected double getSalary() {
        return salary;
    }

    // DEFAULT (Package-Private): Only classes in the same package (like HR module) can use this.
    void updateSalary(double newSalary) {
        if (isValidSalary(newSalary)) {
            this.salary = newSalary;
        }
    }

    // PRIVATE: Internal helper method. Nobody outside needs this.
    private boolean isValidSalary(double salary) {
        return salary > 0;
    }
}
```

### 🧠 Advanced Interview Q&A

**Q: Can a top-level class be declared as `private` or `protected`?**
> **A:** **No.** A top-level class (a class defined in its own `.java` file) can only be `public` or `default` (package-private).
> *   If `private`, no other class could ever access it, making it useless.
> *   If `protected`, it would only make sense in the context of inheritance, but top-level classes are not "inside" anything to be inherited from a package scope.
> *   However, **inner classes (nested classes)** can be declared `private` or `protected`.

**Q: What is the difference between `default` and `protected` access?**
> **A:** The key difference lies in subclass access from a **different package**.
> *   `default`: Accessible only within the same package. A subclass in a **different** package **cannot** access it.
> *   `protected`: Accessible within the same package **AND** by subclasses in **different** packages (through inheritance only).
>
> So, `protected` = `default` + subclass access from other packages.

**Q: Can we change the access modifier of a method when overriding it?**
> **A:** You can **widen** (increase) the visibility but you **cannot narrow** (decrease) it.
> ```java
> class Parent {
>     protected void display() {} // protected
> }
>
> class Child extends Parent {
>     @Override
>     public void display() {} // ✅ Widened from protected to public
> }
>
> class Child2 extends Parent {
>     @Override
>     private void display() {} // ❌ COMPILE ERROR! Narrowed from protected to private
> }
> ```
> **Why?** Because of Polymorphism. If a `Parent` reference holds a `Child` object (`Parent p = new Child()`), the caller expects at least `protected` access. Making it `private` in the child would break that contract.

**Q: Which access modifier should be the default choice for fields and methods?**
> **A:** The best practice (Principle of Least Privilege):
> 1. Start with `private` for all fields and methods.
> 2. Only widen the access when you have a specific, justified need.
> 3. Use `public` only for your API surface (methods intended for external callers).
> This principle is fundamental to writing well-encapsulated, maintainable code.

---

## 📝 Quick Revision Cheat Sheet

| Topic | Key Idea |
| :--- | :--- |
| **Abstract Class** | An incomplete blueprint. Can have state + constructors. Use when classes share common behavior. |
| **Abstract Method** | A method with no body. Must be overridden by the child. |
| **Interface** | A strict contract. No state, no constructors. Use for "CAN-DO" capabilities. |
| **`default` method** | A method with a body inside an interface (Java 8+). |
| **Functional Interface** | An interface with exactly **one** abstract method. Used for Lambdas. |
| **Marker Interface** | An empty interface used to tag a class (e.g., `Serializable`). |
| **`private`** | Same class only. |
| **`default` (no keyword)** | Same class + same package. |
| **`protected`** | Same class + same package + subclass (different package). |
| **`public`** | Accessible everywhere. |

---