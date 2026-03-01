# Common Design Patterns

Design patterns are reusable solutions to commonly occurring problems in software design. They are grouped into three categories.

## **Creational Patterns**

Patterns that deal with object creation mechanisms.

| Pattern | Description | Use Case |
|---------|-------------|----------|
| Singleton | Ensures a class has only one instance | Database connections, logging |
| Factory Method | Creates objects without specifying exact class | When the type of object is determined at runtime |
| Abstract Factory | Creates families of related objects | Cross-platform UI components |
| Builder | Constructs complex objects step by step | Objects with many optional parameters |
| Prototype | Creates new objects by cloning existing ones | When object creation is expensive |

### Singleton Example

```java
public class Database {
    private static Database instance;

    private Database() {}

    public static Database getInstance() {
        if (instance == null) {
            instance = new Database();
        }
        return instance;
    }
}
```

### Factory Method Example

```java
public interface Shape {
    void draw();
}

public class ShapeFactory {
    public Shape createShape(String type) {
        return switch (type) {
            case "circle" -> new Circle();
            case "rectangle" -> new Rectangle();
            default -> throw new IllegalArgumentException("Unknown shape");
        };
    }
}
```

## **Structural Patterns**

Patterns that deal with object composition and relationships.

| Pattern | Description | Use Case |
|---------|-------------|----------|
| Adapter | Converts one interface to another | Integrating legacy code |
| Decorator | Adds behavior to objects dynamically | Extending functionality without subclassing |
| Facade | Provides a simplified interface | Simplifying complex subsystems |
| Proxy | Controls access to another object | Lazy loading, access control |
| Composite | Treats individual objects and compositions uniformly | Tree structures like file systems |

### Decorator Example

```java
public interface Coffee {
    double cost();
    String description();
}

public class SimpleCoffee implements Coffee {
    public double cost() { return 1.00; }
    public String description() { return "Simple coffee"; }
}

public class MilkDecorator implements Coffee {
    private Coffee coffee;

    public MilkDecorator(Coffee coffee) {
        this.coffee = coffee;
    }

    public double cost() { return coffee.cost() + 0.50; }
    public String description() { return coffee.description() + ", milk"; }
}
```

## **Behavioral Patterns**

Patterns that deal with communication between objects.

| Pattern | Description | Use Case |
|---------|-------------|----------|
| Observer | Notifies dependents when state changes | Event systems, UI updates |
| Strategy | Defines interchangeable algorithms | Sorting algorithms, payment methods |
| Command | Encapsulates a request as an object | Undo/redo, task queues |
| Iterator | Provides sequential access to elements | Traversing collections |
| State | Changes behavior when internal state changes | Workflow engines, UI states |
| Template Method | Defines algorithm skeleton, lets subclasses fill in steps | Frameworks, data processing pipelines |

### Observer Example

```java
public interface Observer {
    void update(String message);
}

public class EventManager {
    private List<Observer> listeners = new ArrayList<>();

    public void subscribe(Observer listener) {
        listeners.add(listener);
    }

    public void notify(String message) {
        for (Observer listener : listeners) {
            listener.update(message);
        }
    }
}
```

### Strategy Example

```java
public interface SortStrategy {
    void sort(int[] array);
}

public class Sorter {
    private SortStrategy strategy;

    public Sorter(SortStrategy strategy) {
        this.strategy = strategy;
    }

    public void sort(int[] array) {
        strategy.sort(array);
    }
}
```

## **When to Use Which Pattern**

| Scenario | Recommended Pattern |
|----------|-------------------|
| Need exactly one instance | Singleton |
| Object creation varies by context | Factory Method |
| Adding features without modifying existing code | Decorator |
| Simplifying a complex API | Facade |
| Reacting to state changes | Observer |
| Swappable algorithms | Strategy |
| Step-by-step object construction | Builder |
| Undo/redo functionality | Command |
