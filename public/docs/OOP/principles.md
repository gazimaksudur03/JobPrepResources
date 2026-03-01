# OOP Principles

Object-Oriented Programming (OOP) is a programming paradigm based on the concept of "objects" that contain data and code. Here are the four core principles:

## **Encapsulation**

Encapsulation is the bundling of data and methods that operate on that data within a single unit (class), restricting direct access to some components.

| Concept | Description |
|---------|-------------|
| Private fields | Data hidden from outside access |
| Public methods | Controlled interface to interact with data |
| Getters/Setters | Methods to read/write private fields |
| Data hiding | Internal state is protected from unintended modification |

```java
public class BankAccount {
    private double balance;  // encapsulated

    public double getBalance() {
        return balance;
    }

    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }
}
```

## **Abstraction**

Abstraction means hiding complex implementation details and showing only the necessary features of an object.

| Concept | Description |
|---------|-------------|
| Abstract classes | Classes that cannot be instantiated directly |
| Interfaces | Contracts that define what methods a class must implement |
| API design | Exposing simple methods while hiding complexity |
| Separation of concerns | Each module handles a specific responsibility |

```java
public interface Shape {
    double area();
    double perimeter();
}

public class Circle implements Shape {
    private double radius;

    public Circle(double radius) {
        this.radius = radius;
    }

    public double area() {
        return Math.PI * radius * radius;
    }

    public double perimeter() {
        return 2 * Math.PI * radius;
    }
}
```

## **Inheritance**

Inheritance allows a class to inherit properties and methods from another class, promoting code reuse.

| Concept | Description |
|---------|-------------|
| Parent/Base class | The class being inherited from |
| Child/Derived class | The class that inherits |
| `extends` keyword | Used to create a subclass (Java/JS) |
| Method overriding | Child class provides its own implementation |
| `super` keyword | Refers to the parent class |

```java
public class Animal {
    protected String name;

    public void speak() {
        System.out.println("...");
    }
}

public class Dog extends Animal {
    @Override
    public void speak() {
        System.out.println("Woof!");
    }
}
```

## **Polymorphism**

Polymorphism allows objects of different classes to be treated as objects of a common parent class.

| Type | Description |
|------|-------------|
| Compile-time (overloading) | Same method name, different parameters |
| Runtime (overriding) | Child class redefines parent method |
| Interface polymorphism | Different classes implement the same interface |

```java
// Method overloading (compile-time)
public int add(int a, int b) { return a + b; }
public double add(double a, double b) { return a + b; }

// Method overriding (runtime)
Shape shape = new Circle(5);
shape.area();  // calls Circle's area()

shape = new Rectangle(4, 6);
shape.area();  // calls Rectangle's area()
```

## **Key OOP Concepts Summary**

| Principle | Purpose | Benefit |
|-----------|---------|---------|
| Encapsulation | Hide internal state | Data protection, modularity |
| Abstraction | Hide complexity | Simpler interfaces, reduced coupling |
| Inheritance | Reuse code | Less duplication, hierarchy |
| Polymorphism | Flexible behavior | Extensibility, cleaner code |
