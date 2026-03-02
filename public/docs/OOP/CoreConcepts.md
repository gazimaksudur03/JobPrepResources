# 📘 Object-Oriented Programming (OOP) Core Concepts & Interview Guide

Object-Oriented Programming (OOP) is a paradigm based on the concept of "objects," which can contain data (attributes/fields) and code (methods/behaviors). 

This guide breaks down the foundation of OOP: **Classes, Objects**, and the **4 Pillars (Encapsulation, Inheritance, Polymorphism, Abstraction)**, complete with advanced interview Q&A.

---

## 1. Classes and Objects

### **The Concepts**
*   **Class:** A blueprint or template for creating objects. It defines the state (variables) and behavior (methods) that the objects of this type will have. It does not consume any memory until an object is created.
*   **Object:** A real-world instance of a class. It represents a specific entity with actual values and consumes memory (in the Heap space).

### **Code Example**
```java
// The Class (Blueprint)
class Car {
    String model; // State
    
    // Constructor
    public Car(String model) {
        this.model = model;
    }
    
    // Behavior
    public void startEngine() {
        System.out.println(model + " engine is starting...");
    }
}

public class Main {
    public static void main(String[] args) {
        // The Object (Real-world instance)
        Car myCar = new Car("Tesla Model 3"); 
        myCar.startEngine();
    }
}
```

### 🧠 Advanced Interview Q&A

**Q: How many ways can you create an object in Java?**
> **A:** There are 5 primary ways:
> 1. Using the `new` keyword (Most common).
> 2. Using `Class.forName().newInstance()` (Reflection).
> 3. Using `Constructor.newInstance()` (Reflection).
> 4. Using the `clone()` method (Requires implementing `Cloneable`).
> 5. Using Object Deserialization (Requires implementing `Serializable`).

**Q: What happens in memory when an object is created?**
> **A:** The `new` keyword allocates memory for the new object on the **Heap**. The object's reference variable (e.g., `myCar`) is created on the **Stack**, and it holds the memory address of the object stored in the Heap.

---

## 2. Pillar 1: Encapsulation

### **The Concept**
Encapsulation is the mechanism of wrapping the data (variables) and code acting on the data (methods) together as a single unit. It is heavily tied to **Data Hiding**. You declare the variables of a class as `private` and provide `public` getter and setter methods to modify and view the variable values.

### **Code Example**
```java
class BankAccount {
    // Hidden internal state
    private double balance; 

    // Public setter with validation logic
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        } else {
            System.out.println("Invalid deposit amount");
        }
    }

    // Public getter
    public double getBalance() {
        return balance;
    }
}
```

### 🧠 Advanced Interview Q&A

**Q: Is there a way to break Encapsulation in Java and access a private variable from another class?**
> **A:** Yes, encapsulation can be bypassed using **Java Reflection**. By calling `Field.setAccessible(true)` on a private field, you can modify it at runtime. However, this is considered bad practice and a security risk.

**Q: What is the difference between Abstraction and Encapsulation?**
> **A:** Encapsulation is about **hiding the internal state** (how it works) to protect data integrity. Abstraction is about **hiding the complex implementation details** (what it is) and showing only the essential features to the user. Encapsulation is achieved using access modifiers (`private`, `public`), while Abstraction is achieved using Abstract Classes and Interfaces.

---

## 3. Pillar 2: Inheritance

### **The Concept**
Inheritance allows a new class (Child/Subclass) to inherit the properties and methods of an existing class (Parent/Superclass). It establishes an **IS-A relationship** (e.g., a Dog IS-A Animal) and promotes code reusability.

### **Code Example**
```java
// Parent Class
class Employee {
    String name;
    public void work() {
        System.out.println(name + " is working.");
    }
}

// Child Class inherits Employee
class Developer extends Employee {
    String programmingLanguage;
    
    public void code() {
        System.out.println(name + " is coding in " + programmingLanguage);
    }
}
```

### 🧠 Advanced Interview Q&A

**Q: Why doesn't Java support Multiple Inheritance through classes?**
> **A:** To prevent the **Diamond Problem**. If Class C inherits from Class A and Class B, and both A and B have a method called `start()`, the compiler won't know which `start()` method Class C should inherit. Java avoids this ambiguity by only allowing single class inheritance. However, multiple inheritance is supported via **Interfaces**.

**Q: What is "Composition over Inheritance"? Why is it recommended?**
> **A:** Inheritance creates tight coupling (a change in the parent breaks the child). Composition establishes a **HAS-A relationship** (e.g., a Car HAS-A Engine) by keeping an instance of another class as a field. Composition is preferred because it offers more flexibility, easier testing, and prevents deep, fragile inheritance hierarchies.

---

## 4. Pillar 3: Polymorphism

### **The Concept**
Polymorphism means "many forms." It allows objects of different classes to be treated as objects of a common superclass. 
There are two types:
1.  **Compile-time (Static):** Achieved via Method Overloading.
2.  **Run-time (Dynamic):** Achieved via Method Overriding.

### **Code Example (Run-time Polymorphism)**
```java
class Payment {
    public void processPayment() {
        System.out.println("Processing generic payment...");
    }
}

class CreditCard extends Payment {
    @Override
    public void processPayment() {
        System.out.println("Processing credit card payment...");
    }
}

public class Main {
    public static void main(String[] args) {
        // Parent reference holding a Child object!
        Payment myPayment = new CreditCard();
        
        // At runtime, the JVM decides to call the CreditCard version
        myPayment.processPayment(); // Outputs: Processing credit card payment...
    }
}
```

### 🧠 Advanced Interview Q&A

**Q: Can we override `static` methods or `private` methods?**
> **A:** **No.** 
> * Private methods are not visible to child classes, so they cannot be overridden.
> * Static methods belong to the *class*, not the *object*. If a child class defines a static method with the same signature as the parent, it's called **Method Hiding**, not overriding. The method called is determined at compile-time based on the reference type, not runtime.

**Q: Does Java support polymorphism for instance variables?**
> **A:** **No.** Polymorphism only applies to methods, not variables. If a child class declares a variable with the same name as a parent class variable, it hides the parent's variable. If you access the variable using a parent reference, it will return the parent's value.

---

## 5. Pillar 4: Abstraction

### **The Concept**
Abstraction is the process of hiding the implementation details and showing only the functionality to the user. It allows the user to know *what* the object does instead of *how* it does it.
It is achieved using:
1.  **Abstract Classes:** Can have both abstract (without body) and concrete (with body) methods. (0 to 100% abstraction).
2.  **Interfaces:** Historically 100% abstract, used to establish a strict contract.

### **Code Example**
```java
// Abstract Class (Concept)
abstract class DatabaseService {
    // Abstract method: Hides implementation
    abstract void connect(); 
    
    // Concrete method: Shared functionality
    public void logActivity() {
        System.out.println("Connecting to database...");
    }
}

// Concrete Class (Implementation)
class MySQLDatabase extends DatabaseService {
    @Override
    void connect() {
        System.out.println("MySQL Connection established using port 3306.");
    }
}
```

### 🧠 Advanced Interview Q&A

**Q: Since Java 8 introduced `default` methods in interfaces, what is the difference between an Abstract Class and an Interface?**
> **A:** While they are more similar now, key differences remain:
> 1. **State:** Abstract classes can have instance variables (state). Interfaces can only have `public static final` constants.
> 2. **Constructors:** Abstract classes can have constructors; interfaces cannot.
> 3. **Inheritance limit:** A class can implement *multiple* interfaces, but can only extend *one* abstract class.

**Q: Can you instantiate an Abstract Class?**
> **A:** No, you cannot instantiate an abstract class directly using the `new` keyword. However, you *can* instantiate it via an anonymous inner class, which essentially creates an unnamed subclass on the fly that implements the abstract methods.