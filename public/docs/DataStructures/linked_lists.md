# Linked Lists

A linked list is a linear data structure where elements are stored in nodes, each pointing to the next node in the sequence.

## **Types of Linked Lists**

| Type | Description |
|------|-------------|
| Singly Linked List | Each node points to the next node |
| Doubly Linked List | Each node points to both next and previous nodes |
| Circular Linked List | Last node points back to the first node |

## **Operations and Time Complexity**

| Operation | Singly | Doubly |
|-----------|--------|--------|
| Access by index | O(n) | O(n) |
| Search | O(n) | O(n) |
| Insert at head | O(1) | O(1) |
| Insert at tail | O(n) / O(1)* | O(1) |
| Insert at position | O(n) | O(n) |
| Delete at head | O(1) | O(1) |
| Delete at tail | O(n) | O(1) |
| Delete at position | O(n) | O(n) |

*O(1) if a tail pointer is maintained.

## **Singly Linked List Implementation**

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class LinkedList:
    def __init__(self):
        self.head = None

    def insert_at_head(self, val):
        new_node = ListNode(val, self.head)
        self.head = new_node

    def delete_node(self, val):
        if not self.head:
            return
        if self.head.val == val:
            self.head = self.head.next
            return
        current = self.head
        while current.next:
            if current.next.val == val:
                current.next = current.next.next
                return
            current = current.next
```

## **Common Linked List Techniques**

| Technique | Description | Use Case |
|-----------|-------------|----------|
| Fast and Slow Pointers | Two pointers at different speeds | Cycle detection, find middle |
| Dummy Head Node | Extra node before the real head | Simplify edge cases |
| Reverse In-Place | Reverse pointers iteratively | Reverse linked list |
| Merge Two Lists | Combine sorted lists | Merge sort on lists |

### Reverse a Linked List

```python
def reverse_list(head):
    prev = None
    current = head
    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node
    return prev
```

### Detect Cycle (Floyd's Algorithm)

```python
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False
```

### Find Middle Node

```python
def find_middle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow
```

## **Linked List vs Array**

| Feature | Array | Linked List |
|---------|-------|-------------|
| Memory | Contiguous | Non-contiguous |
| Access | O(1) by index | O(n) by index |
| Insertion at start | O(n) | O(1) |
| Insertion at end | O(1) amortized | O(n) or O(1)* |
| Memory overhead | None | Extra pointer per node |
| Cache performance | Excellent | Poor |

## **Key Interview Problems**

| Problem | Approach | Complexity |
|---------|----------|------------|
| Reverse Linked List | Iterative pointer reversal | O(n) |
| Detect Cycle | Floyd's fast/slow pointers | O(n) |
| Merge Two Sorted Lists | Two pointers with dummy head | O(n + m) |
| Remove Nth Node From End | Two pointers with gap | O(n) |
| Find Middle | Fast and slow pointers | O(n) |
| Palindrome Linked List | Reverse second half and compare | O(n) |
| Intersection of Two Lists | Calculate lengths, align starts | O(n + m) |
