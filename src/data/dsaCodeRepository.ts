export interface CodeSnippets {
  cpp: string;
  python: string;
  java: string;
}

export interface DSAFullImplementation {
  title: string;
  description: string;
  fullCode: CodeSnippets;
}

export const SINGLY_LINKED_LIST_FULL_CODE: DSAFullImplementation = {
  title: 'Complete Singly Linked List Implementation',
  description: 'Full production-grade implementation including Node definition, insertion at beginning/end/index, deletion from beginning/end/index, linear search, traversal display, and driver main function.',
  fullCode: {
    cpp: `#include <iostream>
using namespace std;

// Node structure
struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

// Singly Linked List Class
class SinglyLinkedList {
private:
    Node* head;
    int length;

public:
    SinglyLinkedList() : head(nullptr), length(0) {}

    // Destructor to prevent memory leaks
    ~SinglyLinkedList() {
        clear();
    }

    // Insert at beginning: O(1)
    void insertAtBeginning(int val) {
        Node* newNode = new Node(val);
        newNode->next = head;
        head = newNode;
        length++;
    }

    // Insert at end: O(n) without tail pointer
    void insertAtEnd(int val) {
        Node* newNode = new Node(val);
        if (!head) {
            head = newNode;
        } else {
            Node* curr = head;
            while (curr->next) {
                curr = curr->next;
            }
            curr->next = newNode;
        }
        length++;
    }

    // Insert at specific index: O(n)
    void insertAtIndex(int index, int val) {
        if (index < 0 || index > length) {
            cout << "Error: Index " << index << " out of bounds!\\n";
            return;
        }
        if (index == 0) {
            insertAtBeginning(val);
            return;
        }
        Node* curr = head;
        for (int i = 0; i < index - 1; i++) {
            curr = curr->next;
        }
        Node* newNode = new Node(val);
        newNode->next = curr->next;
        curr->next = newNode;
        length++;
    }

    // Delete from beginning: O(1)
    void deleteBeginning() {
        if (!head) {
            cout << "Error: List is empty! Underflow.\\n";
            return;
        }
        Node* temp = head;
        head = head->next;
        delete temp;
        length--;
    }

    // Delete from end: O(n)
    void deleteEnd() {
        if (!head) {
            cout << "Error: List is empty! Underflow.\\n";
            return;
        }
        if (!head->next) {
            delete head;
            head = nullptr;
        } else {
            Node* curr = head;
            while (curr->next->next) {
                curr = curr->next;
            }
            delete curr->next;
            curr->next = nullptr;
        }
        length--;
    }

    // Delete from specific index: O(n)
    void deleteAtIndex(int index) {
        if (index < 0 || index >= length || !head) {
            cout << "Error: Index out of bounds!\\n";
            return;
        }
        if (index == 0) {
            deleteBeginning();
            return;
        }
        Node* curr = head;
        for (int i = 0; i < index - 1; i++) {
            curr = curr->next;
        }
        Node* target = curr->next;
        curr->next = target->next;
        delete target;
        length--;
    }

    // Search value: O(n)
    int search(int val) {
        Node* curr = head;
        int idx = 0;
        while (curr) {
            if (curr->data == val) return idx;
            curr = curr->next;
            idx++;
        }
        return -1;
    }

    // Display list elements: O(n)
    void display() {
        Node* curr = head;
        cout << "HEAD -> ";
        while (curr) {
            cout << "[" << curr->data << "] -> ";
            curr = curr->next;
        }
        cout << "NULL (Length: " << length << ")\\n";
    }

    int size() const { return length; }
    bool isEmpty() const { return head == nullptr; }

    void clear() {
        Node* curr = head;
        while (curr) {
            Node* nextNode = curr->next;
            delete curr;
            curr = nextNode;
        }
        head = nullptr;
        length = 0;
    }
};

int main() {
    SinglyLinkedList list;
    cout << "=== Singly Linked List Demo ===\\n";
    list.insertAtEnd(10);
    list.insertAtEnd(20);
    list.insertAtEnd(30);
    list.display(); // HEAD -> [10] -> [20] -> [30] -> NULL

    cout << "\\nInserting 5 at beginning:\\n";
    list.insertAtBeginning(5);
    list.display(); // HEAD -> [5] -> [10] -> [20] -> [30] -> NULL

    cout << "\\nInserting 25 at index 3:\\n";
    list.insertAtIndex(3, 25);
    list.display();

    cout << "\\nDeleting beginning and index 2:\\n";
    list.deleteBeginning();
    list.deleteAtIndex(2);
    list.display();

    return 0;
}`,
    python: `class Node:
    """Represents an individual node in a Singly Linked List."""
    def __init__(self, data):
        self.data = data
        self.next = None

class SinglyLinkedList:
    """Full implementation of a Singly Linked List."""
    def __init__(self):
        self.head = None
        self._length = 0

    def insert_at_beginning(self, val):
        """Insert value at beginning in O(1) time."""
        new_node = Node(val)
        new_node.next = self.head
        self.head = new_node
        self._length += 1

    def insert_at_end(self, val):
        """Insert value at end in O(n) time."""
        new_node = Node(val)
        if not self.head:
            self.head = new_node
        else:
            curr = self.head
            while curr.next:
                curr = curr.next
            curr.next = new_node
        self._length += 1

    def insert_at_index(self, index, val):
        """Insert value at target index in O(n) time."""
        if index < 0 or index > self._length:
            raise IndexError("Index out of bounds")
        if index == 0:
            self.insert_at_beginning(val)
            return

        curr = self.head
        for _ in range(index - 1):
            curr = curr.next
        new_node = Node(val)
        new_node.next = curr.next
        curr.next = new_node
        self._length += 1

    def delete_beginning(self):
        """Delete from head in O(1) time."""
        if not self.head:
            raise IndexError("List is empty! Underflow.")
        removed = self.head.data
        self.head = self.head.next
        self._length -= 1
        return removed

    def delete_end(self):
        """Delete from tail in O(n) time."""
        if not self.head:
            raise IndexError("List is empty! Underflow.")
        if not self.head.next:
            removed = self.head.data
            self.head = None
            self._length = 0
            return removed

        curr = self.head
        while curr.next.next:
            curr = curr.next
        removed = curr.next.data
        curr.next = None
        self._length -= 1
        return removed

    def delete_at_index(self, index):
        """Delete node at index in O(n) time."""
        if index < 0 or index >= self._length or not self.head:
            raise IndexError("Index out of bounds")
        if index == 0:
            return self.delete_beginning()

        curr = self.head
        for _ in range(index - 1):
            curr = curr.next
        target = curr.next
        removed = target.data
        curr.next = target.next
        self._length -= 1
        return removed

    def search(self, val):
        """Search value returning index or -1 in O(n)."""
        curr = self.head
        idx = 0
        while curr:
            if curr.data == val:
                return idx
            curr = curr.next
            idx += 1
        return -1

    def display(self):
        """Traverse and print all nodes."""
        curr = self.head
        nodes = []
        while curr:
            nodes.append(str(curr.data))
            curr = curr.next
        print("HEAD -> " + " -> ".join(nodes) + " -> NULL (Length: " + str(self._length) + ")")

    def __len__(self):
        return self._length

if __name__ == "__main__":
    ll = SinglyLinkedList()
    print("=== Singly Linked List Demo ===")
    ll.insert_at_end(10)
    ll.insert_at_end(20)
    ll.insert_at_end(30)
    ll.display() # HEAD -> 10 -> 20 -> 30 -> NULL

    ll.insert_at_beginning(5)
    ll.insert_at_index(2, 15)
    ll.display()

    ll.delete_beginning()
    ll.delete_at_index(2)
    ll.display()
`,
    java: `public class SinglyLinkedList {
    // Inner Node representation
    private static class Node {
        int data;
        Node next;
        Node(int data) {
            this.data = data;
            this.next = null;
        }
    }

    private Node head;
    private int size;

    public SinglyLinkedList() {
        this.head = null;
        this.size = 0;
    }

    // Insert at beginning: O(1)
    public void insertAtBeginning(int val) {
        Node newNode = new Node(val);
        newNode.next = head;
        head = newNode;
        size++;
    }

    // Insert at end: O(n)
    public void insertAtEnd(int val) {
        Node newNode = new Node(val);
        if (head == null) {
            head = newNode;
        } else {
            Node curr = head;
            while (curr.next != null) {
                curr = curr.next;
            }
            curr.next = newNode;
        }
        size++;
    }

    // Insert at index: O(n)
    public void insertAtIndex(int index, int val) {
        if (index < 0 || index > size) {
            throw new IndexOutOfBoundsException("Invalid index: " + index);
        }
        if (index == 0) {
            insertAtBeginning(val);
            return;
        }
        Node curr = head;
        for (int i = 0; i < index - 1; i++) {
            curr = curr.next;
        }
        Node newNode = new Node(val);
        newNode.next = curr.next;
        curr.next = newNode;
        size++;
    }

    // Delete from beginning: O(1)
    public int deleteBeginning() {
        if (head == null) {
            throw new RuntimeException("List is empty! Underflow.");
        }
        int removed = head.data;
        head = head.next;
        size--;
        return removed;
    }

    // Delete from end: O(n)
    public int deleteEnd() {
        if (head == null) {
            throw new RuntimeException("List is empty! Underflow.");
        }
        if (head.next == null) {
            int removed = head.data;
            head = null;
            size = 0;
            return removed;
        }
        Node curr = head;
        while (curr.next.next != null) {
            curr = curr.next;
        }
        int removed = curr.next.data;
        curr.next = null;
        size--;
        return removed;
    }

    // Delete at index: O(n)
    public int deleteAtIndex(int index) {
        if (index < 0 || index >= size || head == null) {
            throw new IndexOutOfBoundsException("Invalid index: " + index);
        }
        if (index == 0) return deleteBeginning();

        Node curr = head;
        for (int i = 0; i < index - 1; i++) {
            curr = curr.next;
        }
        Node target = curr.next;
        int removed = target.data;
        curr.next = target.next;
        size--;
        return removed;
    }

    // Traverse and display: O(n)
    public void display() {
        Node curr = head;
        System.out.print("HEAD -> ");
        while (curr != null) {
            System.out.print("[" + curr.data + "] -> ");
            curr = curr.next;
        }
        System.out.println("NULL (Size: " + size + ")");
    }

    public int getSize() { return size; }
    public boolean isEmpty() { return head == null; }

    public static void main(String[] args) {
        SinglyLinkedList list = new SinglyLinkedList();
        System.out.println("=== Singly Linked List Demo ===");
        list.insertAtEnd(10);
        list.insertAtEnd(20);
        list.insertAtEnd(30);
        list.display();

        list.insertAtBeginning(5);
        list.insertAtIndex(2, 15);
        list.display();

        list.deleteBeginning();
        list.deleteAtIndex(2);
        list.display();
    }
}`,
  },
};

export const DOUBLY_LINKED_LIST_FULL_CODE: DSAFullImplementation = {
  title: 'Complete Doubly Linked List Implementation',
  description: 'Full bidirectional node structure with prev and next pointers, head and tail pointers, forward and backward traversal, and complete insert and delete operations.',
  fullCode: {
    cpp: `#include <iostream>
using namespace std;

// Doubly Linked List Node
struct Node {
    int data;
    Node* prev;
    Node* next;
    Node(int val) : data(val), prev(nullptr), next(nullptr) {}
};

class DoublyLinkedList {
private:
    Node* head;
    Node* tail;
    int length;

public:
    DoublyLinkedList() : head(nullptr), tail(nullptr), length(0) {}

    ~DoublyLinkedList() {
        Node* curr = head;
        while (curr) {
            Node* nxt = curr->next;
            delete curr;
            curr = nxt;
        }
    }

    // Insert at beginning: O(1)
    void insertAtBeginning(int val) {
        Node* newNode = new Node(val);
        if (!head) {
            head = tail = newNode;
        } else {
            newNode->next = head;
            head->prev = newNode;
            head = newNode;
        }
        length++;
    }

    // Insert at end: O(1) with tail pointer
    void insertAtEnd(int val) {
        Node* newNode = new Node(val);
        if (!tail) {
            head = tail = newNode;
        } else {
            tail->next = newNode;
            newNode->prev = tail;
            tail = newNode;
        }
        length++;
    }

    // Insert at index: O(n)
    void insertAtIndex(int index, int val) {
        if (index < 0 || index > length) {
            cout << "Index out of bounds\\n";
            return;
        }
        if (index == 0) { insertAtBeginning(val); return; }
        if (index == length) { insertAtEnd(val); return; }

        Node* curr = head;
        for (int i = 0; i < index - 1; i++) curr = curr->next;
        Node* newNode = new Node(val);
        newNode->next = curr->next;
        newNode->prev = curr;
        curr->next->prev = newNode;
        curr->next = newNode;
        length++;
    }

    // Delete beginning: O(1)
    void deleteBeginning() {
        if (!head) return;
        Node* temp = head;
        if (head == tail) {
            head = tail = nullptr;
        } else {
            head = head->next;
            head->prev = nullptr;
        }
        delete temp;
        length--;
    }

    // Delete end: O(1)
    void deleteEnd() {
        if (!tail) return;
        Node* temp = tail;
        if (head == tail) {
            head = tail = nullptr;
        } else {
            tail = tail->prev;
            tail->next = nullptr;
        }
        delete temp;
        length--;
    }

    // Display forward: O(n)
    void displayForward() {
        Node* curr = head;
        cout << "HEAD <-> ";
        while (curr) {
            cout << "[" << curr->data << "] <-> ";
            curr = curr->next;
        }
        cout << "NULL (Length: " << length << ")\\n";
    }

    // Display backward: O(n)
    void displayBackward() {
        Node* curr = tail;
        cout << "TAIL <-> ";
        while (curr) {
            cout << "[" << curr->data << "] <-> ";
            curr = curr->prev;
        }
        cout << "HEAD\\n";
    }
};

int main() {
    DoublyLinkedList dll;
    cout << "=== Doubly Linked List Demo ===\\n";
    dll.insertAtEnd(10);
    dll.insertAtEnd(20);
    dll.insertAtEnd(30);
    dll.insertAtBeginning(5);
    dll.displayForward();
    dll.displayBackward();
    dll.deleteBeginning();
    dll.deleteEnd();
    dll.displayForward();
    return 0;
}`,
    python: `class DoublyNode:
    def __init__(self, val):
        self.data = val
        self.prev = None
        self.next = None

class DoublyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None
        self.length = 0

    def insert_at_beginning(self, val):
        new_node = DoublyNode(val)
        if not self.head:
            self.head = self.tail = new_node
        else:
            new_node.next = self.head
            self.head.prev = new_node
            self.head = new_node
        self.length += 1

    def insert_at_end(self, val):
        new_node = DoublyNode(val)
        if not self.tail:
            self.head = self.tail = new_node
        else:
            self.tail.next = new_node
            new_node.prev = self.tail
            self.tail = new_node
        self.length += 1

    def delete_beginning(self):
        if not self.head: return None
        removed = self.head.data
        if self.head == self.tail:
            self.head = self.tail = None
        else:
            self.head = self.head.next
            self.head.prev = None
        self.length -= 1
        return removed

    def delete_end(self):
        if not self.tail: return None
        removed = self.tail.data
        if self.head == self.tail:
            self.head = self.tail = None
        else:
            self.tail = self.tail.prev
            self.tail.next = None
        self.length -= 1
        return removed

    def display(self):
        curr = self.head
        nodes = []
        while curr:
            nodes.append(str(curr.data))
            curr = curr.next
        print("HEAD <-> " + " <-> ".join(nodes) + " <-> NULL")

if __name__ == "__main__":
    dll = DoublyLinkedList()
    dll.insert_at_end(10)
    dll.insert_at_end(20)
    dll.insert_at_beginning(5)
    dll.display() # HEAD <-> 5 <-> 10 <-> 20 <-> NULL
`,
    java: `public class DoublyLinkedList {
    private static class Node {
        int data;
        Node prev;
        Node next;
        Node(int data) { this.data = data; }
    }

    private Node head;
    private Node tail;
    private int size;

    public void insertAtBeginning(int val) {
        Node newNode = new Node(val);
        if (head == null) {
            head = tail = newNode;
        } else {
            newNode.next = head;
            head.prev = newNode;
            head = newNode;
        }
        size++;
    }

    public void insertAtEnd(int val) {
        Node newNode = new Node(val);
        if (tail == null) {
            head = tail = newNode;
        } else {
            tail.next = newNode;
            newNode.prev = tail;
            tail = newNode;
        }
        size++;
    }

    public int deleteBeginning() {
        if (head == null) throw new RuntimeException("Underflow");
        int val = head.data;
        if (head == tail) {
            head = tail = null;
        } else {
            head = head.next;
            head.prev = null;
        }
        size--;
        return val;
    }

    public void display() {
        Node curr = head;
        System.out.print("HEAD <-> ");
        while (curr != null) {
            System.out.print("[" + curr.data + "] <-> ");
            curr = curr.next;
        }
        System.out.println("NULL (Size: " + size + ")");
    }

    public static void main(String[] args) {
        DoublyLinkedList dll = new DoublyLinkedList();
        dll.insertAtEnd(10);
        dll.insertAtEnd(20);
        dll.insertAtBeginning(5);
        dll.display();
    }
}`,
  },
};

export const CIRCULAR_LINKED_LIST_FULL_CODE: DSAFullImplementation = {
  title: 'Complete Circular Linked List Implementation',
  description: 'Unbroken loop structure where the tail connects directly back to head, with full insertion, deletion, and circular traversal.',
  fullCode: {
    cpp: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class CircularLinkedList {
private:
    Node* head;
    int length;

public:
    CircularLinkedList() : head(nullptr), length(0) {}

    // Insert at beginning: O(n) without tail pointer
    void insertAtBeginning(int val) {
        Node* newNode = new Node(val);
        if (!head) {
            head = newNode;
            newNode->next = head; // Points to itself
        } else {
            Node* curr = head;
            while (curr->next != head) curr = curr->next;
            curr->next = newNode;
            newNode->next = head;
            head = newNode; // Move head
        }
        length++;
    }

    // Insert at end: O(n)
    void insertAtEnd(int val) {
        Node* newNode = new Node(val);
        if (!head) {
            head = newNode;
            newNode->next = head;
        } else {
            Node* curr = head;
            while (curr->next != head) curr = curr->next;
            curr->next = newNode;
            newNode->next = head; // Close circular loop
        }
        length++;
    }

    // Delete beginning: O(n)
    void deleteBeginning() {
        if (!head) return;
        if (head->next == head) {
            delete head;
            head = nullptr;
        } else {
            Node* curr = head;
            while (curr->next != head) curr = curr->next;
            Node* temp = head;
            curr->next = head->next;
            head = head->next;
            delete temp;
        }
        length--;
    }

    // Display circular list: O(n)
    void display() {
        if (!head) {
            cout << "List is empty (HEAD -> NULL)\\n";
            return;
        }
        Node* curr = head;
        cout << "HEAD -> ";
        do {
            cout << "[" << curr->data << "] -> ";
            curr = curr->next;
        } while (curr != head);
        cout << "(Loops back to HEAD: " << head->data << ")\\n";
    }
};

int main() {
    CircularLinkedList cll;
    cout << "=== Circular Linked List Demo ===\\n";
    cll.insertAtEnd(10);
    cll.insertAtEnd(20);
    cll.insertAtEnd(30);
    cll.insertAtBeginning(5);
    cll.display(); // HEAD -> [5] -> [10] -> [20] -> [30] -> (Loops to HEAD: 5)
    cll.deleteBeginning();
    cll.display();
    return 0;
}`,
    python: `class Node:
    def __init__(self, val):
        self.data = val
        self.next = None

class CircularLinkedList:
    def __init__(self):
        self.head = None
        self.length = 0

    def insert_at_end(self, val):
        new_node = Node(val)
        if not self.head:
            self.head = new_node
            new_node.next = self.head
        else:
            curr = self.head
            while curr.next != self.head:
                curr = curr.next
            curr.next = new_node
            new_node.next = self.head
        self.length += 1

    def display(self):
        if not self.head:
            print("Empty list")
            return
        curr = self.head
        nodes = []
        while True:
            nodes.append(str(curr.data))
            curr = curr.next
            if curr == self.head: break
        print("HEAD -> " + " -> ".join(nodes) + " -> (Loops to HEAD: " + str(self.head.data) + ")")

if __name__ == "__main__":
    cll = CircularLinkedList()
    cll.insert_at_end(10)
    cll.insert_at_end(20)
    cll.insert_at_end(30)
    cll.display()
`,
    java: `public class CircularLinkedList {
    private static class Node {
        int data;
        Node next;
        Node(int data) { this.data = data; }
    }

    private Node head;
    private int size;

    public void insertAtEnd(int val) {
        Node newNode = new Node(val);
        if (head == null) {
            head = newNode;
            newNode.next = head;
        } else {
            Node curr = head;
            while (curr.next != head) {
                curr = curr.next;
            }
            curr.next = newNode;
            newNode.next = head;
        }
        size++;
    }

    public void display() {
        if (head == null) {
            System.out.println("Empty");
            return;
        }
        Node curr = head;
        System.out.print("HEAD -> ");
        do {
            System.out.print("[" + curr.data + "] -> ");
            curr = curr.next;
        } while (curr != head);
        System.out.println("(Loops back to HEAD: " + head.data + ")");
    }

    public static void main(String[] args) {
        CircularLinkedList cll = new CircularLinkedList();
        cll.insertAtEnd(10);
        cll.insertAtEnd(20);
        cll.insertAtEnd(30);
        cll.display();
    }
}`,
  },
};

export const STACK_FULL_CODE: DSAFullImplementation = {
  title: 'Complete Stack Implementation (LIFO)',
  description: 'Full stack class implementation with dynamic capacity array, push, pop, peek, isEmpty, isFull, clear, and overflow/underflow boundary protection.',
  fullCode: {
    cpp: `#include <iostream>
using namespace std;

class Stack {
private:
    int* arr;
    int top;
    int capacity;

public:
    Stack(int cap = 10) : capacity(cap), top(-1) {
        arr = new int[capacity];
    }

    ~Stack() {
        delete[] arr;
    }

    // Push: O(1)
    bool push(int val) {
        if (isFull()) {
            cout << "Stack Overflow! Cannot push " << val << "\\n";
            return false;
        }
        arr[++top] = val;
        return true;
    }

    // Pop: O(1)
    int pop() {
        if (isEmpty()) {
            cout << "Stack Underflow! Stack is empty.\\n";
            return -1;
        }
        return arr[top--];
    }

    // Peek: O(1)
    int peek() const {
        if (isEmpty()) {
            cout << "Stack is empty!\\n";
            return -1;
        }
        return arr[top];
    }

    bool isEmpty() const { return top == -1; }
    bool isFull() const { return top == capacity - 1; }
    int size() const { return top + 1; }

    void display() const {
        if (isEmpty()) {
            cout << "[Stack is Empty]\\n";
            return;
        }
        cout << "Stack (Top to Bottom):\\n";
        for (int i = top; i >= 0; i--) {
            cout << "  | " << arr[i] << " |" << (i == top ? " <-- TOP" : "") << "\\n";
        }
        cout << "  +-----+\\n";
    }
};

int main() {
    Stack s(5);
    cout << "=== Stack (LIFO) Demo ===\\n";
    s.push(10);
    s.push(20);
    s.push(30);
    s.display();

    cout << "\\nPeeking top element: " << s.peek() << "\\n";
    cout << "Popping element: " << s.pop() << "\\n";
    s.display();

    return 0;
}`,
    python: `class Stack:
    """Complete Stack (LIFO) implementation with fixed capacity."""
    def __init__(self, capacity=10):
        self.capacity = capacity
        self.stack = []

    def push(self, val):
        """Push value onto stack in O(1) time."""
        if len(self.stack) >= self.capacity:
            raise OverflowError("Stack Overflow! Maximum capacity reached.")
        self.stack.append(val)

    def pop(self):
        """Pop and return top value in O(1) time."""
        if not self.stack:
            raise IndexError("Stack Underflow! Stack is empty.")
        return self.stack.pop()

    def peek(self):
        """Return top value without removing in O(1)."""
        if not self.stack:
            raise IndexError("Stack is empty.")
        return self.stack[-1]

    def is_empty(self):
        return len(self.stack) == 0

    def is_full(self):
        return len(self.stack) >= self.capacity

    def size(self):
        return len(self.stack)

    def display(self):
        if not self.stack:
            print("[Stack is Empty]")
            return
        print("Stack (Top to Bottom):")
        for i in reversed(range(len(self.stack))):
            marker = " <-- TOP" if i == len(self.stack) - 1 else ""
            print(f"  | {self.stack[i]} |{marker}")
        print("  +-----+")

if __name__ == "__main__":
    s = Stack(5)
    print("=== Stack Demo ===")
    s.push(10)
    s.push(20)
    s.push(30)
    s.display()
    print("Popped:", s.pop())
    s.display()
`,
    java: `public class Stack {
    private int[] arr;
    private int top;
    private int capacity;

    public Stack(int capacity) {
        this.capacity = capacity;
        this.arr = new int[capacity];
        this.top = -1;
    }

    public boolean push(int val) {
        if (isFull()) {
            System.out.println("Stack Overflow!");
            return false;
        }
        arr[++top] = val;
        return true;
    }

    public int pop() {
        if (isEmpty()) {
            throw new RuntimeException("Stack Underflow!");
        }
        return arr[top--];
    }

    public int peek() {
        if (isEmpty()) {
            throw new RuntimeException("Stack is empty!");
        }
        return arr[top];
    }

    public boolean isEmpty() { return top == -1; }
    public boolean isFull() { return top == capacity - 1; }
    public int size() { return top + 1; }

    public void display() {
        if (isEmpty()) {
            System.out.println("[Stack is Empty]");
            return;
        }
        System.out.println("Stack (Top to Bottom):");
        for (int i = top; i >= 0; i--) {
            System.out.println("  | " + arr[i] + " |" + (i == top ? " <-- TOP" : ""));
        }
        System.out.println("  +-----+");
    }

    public static void main(String[] args) {
        Stack s = new Stack(5);
        s.push(10);
        s.push(20);
        s.push(30);
        s.display();
        System.out.println("Popped: " + s.pop());
        s.display();
    }
}`,
  },
};

export const QUEUE_FULL_CODE: DSAFullImplementation = {
  title: 'Complete Queue Implementation (FIFO)',
  description: 'Full Circular Queue class with front and rear pointers, enqueue, dequeue, peek, capacity management, and wrapping arithmetic.',
  fullCode: {
    cpp: `#include <iostream>
using namespace std;

class CircularQueue {
private:
    int* arr;
    int front;
    int rear;
    int count;
    int capacity;

public:
    CircularQueue(int cap = 10) : capacity(cap), front(0), rear(-1), count(0) {
        arr = new int[capacity];
    }

    ~CircularQueue() {
        delete[] arr;
    }

    // Enqueue at rear: O(1)
    bool enqueue(int val) {
        if (isFull()) {
            cout << "Queue Overflow! Capacity reached.\\n";
            return false;
        }
        rear = (rear + 1) % capacity;
        arr[rear] = val;
        count++;
        return true;
    }

    // Dequeue from front: O(1)
    int dequeue() {
        if (isEmpty()) {
            cout << "Queue Underflow! Queue is empty.\\n";
            return -1;
        }
        int removed = arr[front];
        front = (front + 1) % capacity;
        count--;
        return removed;
    }

    // Peek front element: O(1)
    int peek() const {
        if (isEmpty()) {
            cout << "Queue is empty!\\n";
            return -1;
        }
        return arr[front];
    }

    bool isEmpty() const { return count == 0; }
    bool isFull() const { return count == capacity; }
    int size() const { return count; }

    void display() const {
        if (isEmpty()) {
            cout << "[Queue is Empty]\\n";
            return;
        }
        cout << "Queue (Front to Rear):\\n  FRONT -> ";
        for (int i = 0; i < count; i++) {
            int idx = (front + i) % capacity;
            cout << "[" << arr[idx] << "] ";
        }
        cout << "<- REAR (Size: " << count << "/" << capacity << ")\\n";
    }
};

int main() {
    CircularQueue q(5);
    cout << "=== Queue (FIFO) Demo ===\\n";
    q.enqueue(10);
    q.enqueue(20);
    q.enqueue(30);
    q.display();

    cout << "\\nDequeued element: " << q.dequeue() << "\\n";
    q.display();

    q.enqueue(40);
    q.enqueue(50);
    q.display();

    return 0;
}`,
    python: `class CircularQueue:
    """Full Circular Queue implementation with FIFO ordering."""
    def __init__(self, capacity=10):
        self.capacity = capacity
        self.queue = [None] * capacity
        self.front = 0
        self.rear = -1
        self.count = 0

    def enqueue(self, val):
        """Enqueue at rear in O(1) time."""
        if self.count >= self.capacity:
            raise OverflowError("Queue Overflow! Queue is full.")
        self.rear = (self.rear + 1) % self.capacity
        self.queue[self.rear] = val
        self.count += 1

    def dequeue(self):
        """Dequeue from front in O(1) time."""
        if self.count == 0:
            raise IndexError("Queue Underflow! Queue is empty.")
        removed = self.queue[self.front]
        self.queue[self.front] = None
        self.front = (self.front + 1) % self.capacity
        self.count -= 1
        return removed

    def peek(self):
        """Peek front element in O(1) time."""
        if self.count == 0:
            raise IndexError("Queue is empty.")
        return self.queue[self.front]

    def is_empty(self):
        return self.count == 0

    def is_full(self):
        return self.count >= self.capacity

    def display(self):
        if self.count == 0:
            print("[Queue is Empty]")
            return
        items = []
        for i in range(self.count):
            idx = (self.front + i) % self.capacity
            items.append(f"[{self.queue[idx]}]")
        print("FRONT -> " + " ".join(items) + f" <- REAR (Size: {self.count}/{self.capacity})")

if __name__ == "__main__":
    q = CircularQueue(5)
    print("=== Queue Demo ===")
    q.enqueue(10)
    q.enqueue(20)
    q.enqueue(30)
    q.display()
    print("Dequeued:", q.dequeue())
    q.display()
`,
    java: `public class CircularQueue {
    private int[] arr;
    private int front;
    private int rear;
    private int count;
    private int capacity;

    public CircularQueue(int capacity) {
        this.capacity = capacity;
        this.arr = new int[capacity];
        this.front = 0;
        this.rear = -1;
        this.count = 0;
    }

    public boolean enqueue(int val) {
        if (isFull()) {
            System.out.println("Queue Overflow!");
            return false;
        }
        rear = (rear + 1) % capacity;
        arr[rear] = val;
        count++;
        return true;
    }

    public int dequeue() {
        if (isEmpty()) {
            throw new RuntimeException("Queue Underflow!");
        }
        int removed = arr[front];
        front = (front + 1) % capacity;
        count--;
        return removed;
    }

    public int peek() {
        if (isEmpty()) throw new RuntimeException("Queue is empty!");
        return arr[front];
    }

    public boolean isEmpty() { return count == 0; }
    public boolean isFull() { return count == capacity; }
    public int size() { return count; }

    public void display() {
        if (isEmpty()) {
            System.out.println("[Queue is Empty]");
            return;
        }
        System.out.print("FRONT -> ");
        for (int i = 0; i < count; i++) {
            int idx = (front + i) % capacity;
            System.out.print("[" + arr[idx] + "] ");
        }
        System.out.println("<- REAR (Size: " + count + "/" + capacity + ")");
    }

    public static void main(String[] args) {
        CircularQueue q = new CircularQueue(5);
        q.enqueue(10);
        q.enqueue(20);
        q.enqueue(30);
        q.display();
        System.out.println("Dequeued: " + q.dequeue());
        q.display();
    }
}`,
  },
};

export const ARRAY_FULL_CODE: DSAFullImplementation = {
  title: 'Complete Array Data Structure Implementation',
  description: 'Contiguous memory storage implementation supporting constant-time index access, bounded insertion, shifting deletions, and linear search.',
  fullCode: {
    cpp: `#include <iostream>
using namespace std;

class CustomArray {
private:
    int* arr;
    int size;
    int capacity;

public:
    CustomArray(int cap = 10) : capacity(cap), size(0) {
        arr = new int[capacity];
    }

    ~CustomArray() {
        delete[] arr;
    }

    // Insert at next available slot: O(1)
    bool append(int val) {
        if (size >= capacity) {
            cout << "Array Overflow! Capacity reached.\\n";
            return false;
        }
        arr[size++] = val;
        return true;
    }

    // Insert at specific index with shifting: O(n)
    bool insertAt(int index, int val) {
        if (size >= capacity || index < 0 || index > size) {
            cout << "Error: Invalid index or full capacity!\\n";
            return false;
        }
        for (int i = size; i > index; i--) {
            arr[i] = arr[i - 1]; // Shift right
        }
        arr[index] = val;
        size++;
        return true;
    }

    // Delete at index with shifting: O(n)
    int deleteAt(int index) {
        if (index < 0 || index >= size) {
            cout << "Error: Index out of bounds!\\n";
            return -1;
        }
        int removed = arr[index];
        for (int i = index; i < size - 1; i++) {
            arr[i] = arr[i + 1]; // Shift left
        }
        size--;
        return removed;
    }

    // Direct access by index: O(1)
    int get(int index) const {
        if (index < 0 || index >= size) {
            cout << "Error: Index out of bounds!\\n";
            return -1;
        }
        return arr[index];
    }

    // Search value: O(n)
    int search(int val) const {
        for (int i = 0; i < size; i++) {
            if (arr[i] == val) return i;
        }
        return -1;
    }

    void clear() { size = 0; }
    int length() const { return size; }
    int getCapacity() const { return capacity; }

    void display() const {
        cout << "Array [Size: " << size << "/" << capacity << "]:\\n[ ";
        for (int i = 0; i < size; i++) {
            cout << arr[i] << " ";
        }
        cout << "]\\n";
    }
};

int main() {
    CustomArray arr(5);
    cout << "=== Array Implementation Demo ===\\n";
    arr.append(10);
    arr.append(20);
    arr.append(30);
    arr.display();

    cout << "\\nInserting 15 at index 1:\\n";
    arr.insertAt(1, 15);
    arr.display();

    cout << "\\nDeleting at index 2:\\n";
    arr.deleteAt(2);
    arr.display();

    return 0;
}`,
    python: `class CustomArray:
    """Fixed-capacity sequential memory array representation."""
    def __init__(self, capacity=10):
        self.capacity = capacity
        self.arr = [None] * capacity
        self.size = 0

    def append(self, val):
        """Append to next available cell in O(1) time."""
        if self.size >= self.capacity:
            raise OverflowError("Array is full!")
        self.arr[self.size] = val
        self.size += 1

    def insert_at(self, index, val):
        """Insert at index with element shifting in O(n) time."""
        if self.size >= self.capacity or not (0 <= index <= self.size):
            raise IndexError("Out of bounds or full capacity")
        for i in range(self.size, index, -1):
            self.arr[i] = self.arr[i - 1]
        self.arr[index] = val
        self.size += 1

    def delete_at(self, index):
        """Delete from index shifting left in O(n) time."""
        if not (0 <= index < self.size):
            raise IndexError("Index out of bounds")
        removed = self.arr[index]
        for i in range(index, self.size - 1):
            self.arr[i] = self.arr[i + 1]
        self.arr[self.size - 1] = None
        self.size -= 1
        return removed

    def get(self, index):
        """O(1) direct contiguous access."""
        if 0 <= index < self.size:
            return self.arr[index]
        raise IndexError("Out of bounds")

    def display(self):
        elements = [str(self.arr[i]) for i in range(self.size)]
        print(f"Array [Size: {self.size}/{self.capacity}]: [{', '.join(elements)}]")

if __name__ == "__main__":
    arr = CustomArray(5)
    print("=== Array Demo ===")
    arr.append(10)
    arr.append(20)
    arr.append(30)
    arr.display()
    arr.insert_at(1, 15)
    arr.display()
    arr.delete_at(2)
    arr.display()
`,
    java: `public class CustomArray {
    private int[] arr;
    private int size;
    private int capacity;

    public CustomArray(int capacity) {
        this.capacity = capacity;
        this.arr = new int[capacity];
        this.size = 0;
    }

    public boolean append(int val) {
        if (size >= capacity) {
            System.out.println("Array is full!");
            return false;
        }
        arr[size++] = val;
        return true;
    }

    public boolean insertAt(int index, int val) {
        if (size >= capacity || index < 0 || index > size) {
            return false;
        }
        for (int i = size; i > index; i--) {
            arr[i] = arr[i - 1];
        }
        arr[index] = val;
        size++;
        return true;
    }

    public int deleteAt(int index) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException();
        }
        int removed = arr[index];
        for (int i = index; i < size - 1; i++) {
            arr[i] = arr[i + 1];
        }
        size--;
        return removed;
    }

    public int get(int index) {
        if (index < 0 || index >= size) throw new IndexOutOfBoundsException();
        return arr[index];
    }

    public void display() {
        System.out.print("Array [Size: " + size + "/" + capacity + "]: [ ");
        for (int i = 0; i < size; i++) {
            System.out.print(arr[i] + " ");
        }
        System.out.println("]");
    }

    public static void main(String[] args) {
        CustomArray arr = new CustomArray(5);
        arr.append(10);
        arr.append(20);
        arr.append(30);
        arr.display();
        arr.insertAt(1, 15);
        arr.display();
        arr.deleteAt(2);
        arr.display();
    }
}`,
  },
};
