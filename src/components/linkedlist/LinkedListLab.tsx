import React, { useState, useEffect, useRef } from 'react';
import {
  Link2,
  Plus,
  Trash2,
  RotateCcw,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { CodeComplexityPanel } from '../common/CodeComplexityPanel';
import {
  SINGLY_LINKED_LIST_FULL_CODE,
  DOUBLY_LINKED_LIST_FULL_CODE,
  CIRCULAR_LINKED_LIST_FULL_CODE,
} from '../../data/dsaCodeRepository';

type ListSubtype = 'singly' | 'doubly' | 'circular';
type PositionType = 'beginning' | 'end' | 'index';
type LLOperationType = 'insert' | 'delete';

interface StepState {
  stepIndex: number;
  totalSteps: number;
  title: string;
  opType: LLOperationType;
  position: PositionType;
  stagedVal: number;
  targetIdx: number;
  isCompleted: boolean;
}

export const LinkedListLab: React.FC = () => {
  const [subtype, setSubtype] = useState<ListSubtype>('singly');
  const [valInput, setValInput] = useState<string>('25');
  const [insertPos, setInsertPos] = useState<PositionType>('beginning');
  const [deletePos, setDeletePos] = useState<PositionType>('beginning');
  const [customIndex, setCustomIndex] = useState<string>('1');

  // List data per subtype
  const [singlyList, setSinglyList] = useState<number[]>([10, 20, 30]);
  const [doublyList, setDoublyList] = useState<number[]>([10, 20, 30]);
  const [circularList, setCircularList] = useState<number[]>([10, 20, 30]);

  const currentList =
    subtype === 'singly' ? singlyList : subtype === 'doubly' ? doublyList : circularList;

  const setCurrentList = (updater: (prev: number[]) => number[]) => {
    if (subtype === 'singly') setSinglyList(updater);
    else if (subtype === 'doubly') setDoublyList(updater);
    else setCircularList(updater);
  };

  // Step-by-step animation state
  const [currentStep, setCurrentStep] = useState<StepState | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Parse input value
  const parsedVal = parseInt(valInput);
  const hasValidVal = !isNaN(parsedVal);

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Handle Play/Pause auto-stepping
  useEffect(() => {
    if (isPlaying && currentStep && !currentStep.isCompleted) {
      timerRef.current = setInterval(() => {
        handleNextStep();
      }, 1400);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentStep]);

  // ==========================================
  // START INSERTION
  // ==========================================
  const handleStartInsert = () => {
    if (!hasValidVal) return;
    const val = parsedVal;

    if (insertPos === 'beginning') {
      setCurrentStep({
        stepIndex: 1,
        totalSteps: 4,
        title: `Step 1 of 4: Allocate New Node [${val}]`,
        opType: 'insert',
        position: 'beginning',
        stagedVal: val,
        targetIdx: 0,
        isCompleted: false,
      });
    } else if (insertPos === 'end') {
      setCurrentStep({
        stepIndex: 1,
        totalSteps: 3,
        title: `Step 1 of 3: Allocate New Node [${val}] at End`,
        opType: 'insert',
        position: 'end',
        stagedVal: val,
        targetIdx: currentList.length,
        isCompleted: false,
      });
    } else {
      const idx = parseInt(customIndex);
      if (isNaN(idx) || idx < 0 || idx > currentList.length) return;
      if (idx === 0) {
        setInsertPos('beginning');
        setCurrentStep({
          stepIndex: 1,
          totalSteps: 4,
          title: `Step 1 of 4: Allocate New Node [${val}] at Beginning (Index 0)`,
          opType: 'insert',
          position: 'beginning',
          stagedVal: val,
          targetIdx: 0,
          isCompleted: false,
        });
        return;
      }
      if (idx === currentList.length) {
        setInsertPos('end');
        setCurrentStep({
          stepIndex: 1,
          totalSteps: 3,
          title: `Step 1 of 3: Allocate New Node [${val}] at End (Index ${idx})`,
          opType: 'insert',
          position: 'end',
          stagedVal: val,
          targetIdx: currentList.length,
          isCompleted: false,
        });
        return;
      }
      const predVal = currentList[idx - 1];
      const succVal = currentList[idx];
      setCurrentStep({
        stepIndex: 1,
        totalSteps: 4,
        title: `Step 1 of 4: Allocate New Node [${val}] at Index [${idx}] (Between [${predVal}] and [${succVal}])`,
        opType: 'insert',
        position: 'index',
        stagedVal: val,
        targetIdx: idx,
        isCompleted: false,
      });
    }
  };

  // ==========================================
  // START DELETION
  // ==========================================
  const handleStartDelete = () => {
    if (currentList.length === 0) return;

    if (deletePos === 'beginning') {
      setCurrentStep({
        stepIndex: 1,
        totalSteps: 4,
        title: `Step 1 of 4: Highlight HEAD Node [${currentList[0]}] for Deletion`,
        opType: 'delete',
        position: 'beginning',
        stagedVal: currentList[0],
        targetIdx: 0,
        isCompleted: false,
      });
    } else if (deletePos === 'end') {
      const lastIdx = currentList.length - 1;
      setCurrentStep({
        stepIndex: 1,
        totalSteps: 4,
        title: `Step 1 of 4: Highlight TAIL Node [${currentList[lastIdx]}] for Deletion`,
        opType: 'delete',
        position: 'end',
        stagedVal: currentList[lastIdx],
        targetIdx: lastIdx,
        isCompleted: false,
      });
    } else {
      const idx = parseInt(customIndex);
      if (isNaN(idx) || idx < 0 || idx >= currentList.length) return;
      if (idx === 0) {
        setDeletePos('beginning');
        handleStartDelete();
        return;
      }
      if (idx === currentList.length - 1) {
        setDeletePos('end');
        handleStartDelete();
        return;
      }
      setCurrentStep({
        stepIndex: 1,
        totalSteps: 4,
        title: `Step 1 of 4: Highlight Node [${currentList[idx]}] at Index [${idx}]`,
        opType: 'delete',
        position: 'index',
        stagedVal: currentList[idx],
        targetIdx: idx,
        isCompleted: false,
      });
    }
  };

  // ==========================================
  // NEXT STEP (ANIMATION ADVANCEMENT)
  // ==========================================
  const handleNextStep = () => {
    if (!currentStep) return;

    const { opType, position, stepIndex, stagedVal, targetIdx } = currentStep;

    if (opType === 'insert') {
      if (position === 'beginning') {
        if (stepIndex === 1) {
          // STEP 2: LINK NEW NODE TO CURRENT FIRST NODE (UPWARD GREEN ARROW)
          setCurrentStep({
            ...currentStep,
            stepIndex: 2,
            title: `Step 2 of 4: Link New Node's Next Pointer to Current HEAD [${currentList[0] ?? 'NULL'}]`,
          });
        } else if (stepIndex === 2) {
          // STEP 3: UPDATE HEAD POINTER (HEAD POINTS TO NEW NODE)
          setCurrentStep({
            ...currentStep,
            stepIndex: 3,
            title: `Step 3 of 4: Move HEAD Pointer to Point to New Node [${stagedVal}]`,
          });
        } else if (stepIndex === 3) {
          // STEP 4: MOVE NODE INTO MAIN CHAIN (FINAL STATE)
          setCurrentList((prev) => [stagedVal, ...prev]);
          setCurrentStep({
            ...currentStep,
            stepIndex: 4,
            title: `Step 4 of 4: Node [${stagedVal}] Moved into Main Chain. Complete!`,
            isCompleted: true,
          });
          setIsPlaying(false);
        }
      } else if (position === 'end') {
        if (stepIndex === 1) {
          // STEP 2: LINK PREVIOUS TAIL TO NEW NODE (GREEN ARROW)
          const lastVal = currentList[currentList.length - 1];
          setCurrentStep({
            ...currentStep,
            stepIndex: 2,
            title: `Step 2 of 3: Connect TAIL Node [${lastVal}]->next to New Node [${stagedVal}]`,
          });
        } else if (stepIndex === 2) {
          // STEP 3: MOVE NODE INTO MAIN CHAIN & UPDATE TAIL
          setCurrentList((prev) => [...prev, stagedVal]);
          setCurrentStep({
            ...currentStep,
            stepIndex: 3,
            title: `Step 3 of 3: TAIL Moved to New Node [${stagedVal}]. Complete!`,
            isCompleted: true,
          });
          setIsPlaying(false);
        }
      } else {
        // Insert at Index
        const succVal = targetIdx < currentList.length ? currentList[targetIdx] : null;
        const predVal = targetIdx > 0 ? currentList[targetIdx - 1] : null;

        if (stepIndex === 1) {
          // STEP 2: Link New Node -> Successor (and in Doubly: Successor->prev = newNode)
          setCurrentStep({
            ...currentStep,
            stepIndex: 2,
            title: isDoubly
              ? `Step 2 of 4: Link newNode->next = [${succVal}] & successor [${succVal}]->prev = newNode`
              : `Step 2 of 4: Link New Node [${stagedVal}]->next to Successor [${succVal}]`,
          });
        } else if (stepIndex === 2) {
          // STEP 3: Link Predecessor -> New Node (and in Doubly: newNode->prev = predecessor)
          setCurrentStep({
            ...currentStep,
            stepIndex: 3,
            title: isDoubly
              ? `Step 3 of 4: Link predecessor [${predVal}]->next = newNode & newNode->prev = [${predVal}]`
              : `Step 3 of 4: Redirect Predecessor [${predVal}]->next to New Node [${stagedVal}]`,
          });
        } else if (stepIndex === 3) {
          // STEP 4: Integrate node into main chain
          setCurrentList((prev) => {
            const copy = [...prev];
            copy.splice(targetIdx, 0, stagedVal);
            return copy;
          });
          setCurrentStep({
            ...currentStep,
            stepIndex: 4,
            title: `Step 4 of 4: Node [${stagedVal}] Integrated at Index [${targetIdx}] between [${predVal}] and [${succVal}]. Complete!`,
            isCompleted: true,
          });
          setIsPlaying(false);
        }
      }
    } else {
      // ----------------------------------------
      // DELETION OPERATIONS
      // ----------------------------------------
      if (position === 'beginning') {
        if (stepIndex === 1) {
          // STEP 2: Advance HEAD to second node, sever link from node 0
          setCurrentStep({
            ...currentStep,
            stepIndex: 2,
            title: currentList.length > 1
              ? `Step 2 of 4: Advance HEAD Pointer to [${currentList[1]}], Sever Link from [${stagedVal}]`
              : `Step 2 of 4: HEAD and TAIL Set to NULL. Link Severed.`,
          });
        } else if (stepIndex === 2) {
          // STEP 3: Node drops downward (deallocating / freeing memory)
          setCurrentStep({
            ...currentStep,
            stepIndex: 3,
            title: `Step 3 of 4: Free Node [${stagedVal}] from Memory (delete temp)`,
          });
        } else if (stepIndex === 3) {
          // STEP 4: List collapses cleanly
          setCurrentList((prev) => prev.slice(1));
          setCurrentStep({
            ...currentStep,
            stepIndex: 4,
            title: `Step 4 of 4: Deletion Complete. List Realigned!`,
            isCompleted: true,
          });
          setIsPlaying(false);
        }
      } else if (position === 'end') {
        if (stepIndex === 1) {
          // STEP 2: Sever pointer to tail and move TAIL
          const predVal = currentList[targetIdx - 1];
          setCurrentStep({
            ...currentStep,
            stepIndex: 2,
            title: predVal !== undefined
              ? `Step 2 of 4: Move TAIL to [${predVal}], Sever Link to [${stagedVal}]`
              : `Step 2 of 4: List becomes empty. HEAD and TAIL point to NULL.`,
          });
        } else if (stepIndex === 2) {
          // STEP 3: Tail drops downward
          setCurrentStep({
            ...currentStep,
            stepIndex: 3,
            title: `Step 3 of 4: Free Old TAIL Node [${stagedVal}] from Memory`,
          });
        } else if (stepIndex === 3) {
          // STEP 4: Complete
          setCurrentList((prev) => prev.slice(0, -1));
          setCurrentStep({
            ...currentStep,
            stepIndex: 4,
            title: `Step 4 of 4: TAIL Node Removed. Deletion Complete!`,
            isCompleted: true,
          });
          setIsPlaying(false);
        }
      } else {
        // Delete at Index
        if (stepIndex === 1) {
          // STEP 2: Bypass target node with curved green pointer
          const predVal = currentList[targetIdx - 1];
          const succVal = targetIdx + 1 < currentList.length ? currentList[targetIdx + 1] : 'NULL';
          setCurrentStep({
            ...currentStep,
            stepIndex: 2,
            title: `Step 2 of 4: Bypass Target Node: Connect [${predVal}] Directly to [${succVal}]`,
          });
        } else if (stepIndex === 2) {
          // STEP 3: Target drops downward
          setCurrentStep({
            ...currentStep,
            stepIndex: 3,
            title: `Step 3 of 4: Free Target Node [${stagedVal}] from Memory`,
          });
        } else if (stepIndex === 3) {
          // STEP 4: List collapses
          setCurrentList((prev) => {
            const copy = [...prev];
            copy.splice(targetIdx, 1);
            return copy;
          });
          setCurrentStep({
            ...currentStep,
            stepIndex: 4,
            title: `Step 4 of 4: List Collapses to Close Gap. Deletion Complete!`,
            isCompleted: true,
          });
          setIsPlaying(false);
        }
      }
    }
  };

  const handlePrevStep = () => {
    if (!currentStep || currentStep.stepIndex <= 1) return;
    setCurrentStep({
      ...currentStep,
      stepIndex: currentStep.stepIndex - 1,
      title: `Step ${currentStep.stepIndex - 1} of ${currentStep.totalSteps}`,
      isCompleted: false,
    });
  };

  const handleResetAnimation = () => {
    setCurrentStep(null);
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleResetList = () => {
    setCurrentStep(null);
    setIsPlaying(false);
    setCurrentList(() => [10, 20, 30]);
  };

  // ==========================================
  // CODE & COMPLEXITY REFERENCE
  // ==========================================
  const getSubtypeCodeAndComplexity = () => {
    const isBeginning = (currentStep ? currentStep.position : insertPos) === 'beginning';
    const isEnd = (currentStep ? currentStep.position : insertPos) === 'end';
    const isInsert = currentStep ? currentStep.opType === 'insert' : true;

    let fullImpl = SINGLY_LINKED_LIST_FULL_CODE;
    if (subtype === 'doubly') fullImpl = DOUBLY_LINKED_LIST_FULL_CODE;
    else if (subtype === 'circular') fullImpl = CIRCULAR_LINKED_LIST_FULL_CODE;

    if (subtype === 'singly') {
      if (isInsert && isBeginning) {
        return {
          fullImpl,
          opTitle: 'Singly Linked List: Insert at Beginning',
          time: 'O(1)',
          space: 'O(1) auxiliary',
          note: 'Allocates a new node and points its next pointer to current head in constant O(1) time.',
          snippets: {
            cpp: `// Insert at Beginning: O(1)
void insertBeginning(int value) {
    Node* newNode = new Node(value);
    newNode->next = head;
    head = newNode;
    length++;
}`,
            python: `# Insert at Beginning: O(1)
def insert_beginning(self, value):
    new_node = Node(value)
    new_node.next = self.head
    self.head = new_node
    self.length += 1`,
            java: `// Insert at Beginning: O(1)
public void insertBeginning(int value) {
    Node newNode = new Node(value);
    newNode.next = head;
    head = newNode;
    size++;
}`,
          },
        };
      } else if (isInsert && isEnd) {
        return {
          fullImpl,
          opTitle: 'Singly Linked List: Insert at End',
          time: 'O(1) with Tail / O(n) without',
          space: 'O(1) auxiliary',
          note: 'Traverses to last node in O(n) unless dedicated tail pointer is maintained.',
          snippets: {
            cpp: `// Insert at End: O(n)
void insertEnd(int value) {
    Node* newNode = new Node(value);
    if (!head) {
        head = newNode;
    } else {
        Node* curr = head;
        while (curr->next) curr = curr->next;
        curr->next = newNode;
    }
    length++;
}`,
            python: `# Insert at End: O(n)
def insert_end(self, value):
    new_node = Node(value)
    if not self.head:
        self.head = new_node
    else:
        curr = self.head
        while curr.next:
            curr = curr.next
        curr.next = new_node
    self.length += 1`,
            java: `// Insert at End: O(n)
public void insertEnd(int value) {
    Node newNode = new Node(value);
    if (head == null) {
        head = newNode;
    } else {
        Node curr = head;
        while (curr.next != null) curr = curr.next;
        curr.next = newNode;
    }
    size++;
}`,
          },
        };
      } else if (isInsert) {
        return {
          fullImpl,
          opTitle: 'Singly Linked List: Insert at Index',
          time: 'O(n)',
          space: 'O(1) auxiliary',
          note: 'Traverses k steps to locate predecessor before repointing next pointers.',
          snippets: {
            cpp: `// Insert at Index: O(n)
void insertAtIndex(int index, int value) {
    if (index == 0) { insertBeginning(value); return; }
    Node* curr = head;
    for (int i = 0; i < index - 1 && curr; i++) curr = curr->next;
    if (!curr) return;
    Node* newNode = new Node(value);
    newNode->next = curr->next;
    curr->next = newNode;
    length++;
}`,
            python: `# Insert at Index: O(n)
def insert_at_index(self, index, value):
    if index == 0:
        self.insert_beginning(value)
        return
    curr = self.head
    for _ in range(index - 1):
        if not curr: return
        curr = curr.next
    new_node = Node(value)
    new_node.next = curr.next
    curr.next = new_node
    self.length += 1`,
            java: `// Insert at Index: O(n)
public void insertAtIndex(int index, int value) {
    if (index == 0) { insertBeginning(value); return; }
    Node curr = head;
    for (int i = 0; i < index - 1 && curr != null; i++) curr = curr.next;
    if (curr == null) return;
    Node newNode = new Node(value);
    newNode.next = curr.next;
    curr.next = newNode;
    size++;
}`,
          },
        };
      } else {
        return {
          fullImpl,
          opTitle: `Singly Linked List: ${isBeginning ? 'Delete Beginning' : isEnd ? 'Delete End' : 'Delete Index'}`,
          time: isBeginning ? 'O(1)' : 'O(n)',
          space: 'O(1) auxiliary',
          note: isBeginning
            ? 'Updating head to head->next in constant O(1) time.'
            : 'Locating predecessor takes O(n) time.',
          snippets: {
            cpp: `// Delete Beginning: O(1)
void deleteBeginning() {
    if (!head) return;
    Node* temp = head;
    head = head->next;
    delete temp;
    length--;
}`,
            python: `# Delete Beginning: O(1)
def delete_beginning(self):
    if not self.head: return
    self.head = self.head.next
    self.length -= 1`,
            java: `// Delete Beginning: O(1)
public void deleteBeginning() {
    if (head == null) return;
    head = head.next;
    size--;
}`,
          },
        };
      }
    } else if (subtype === 'doubly') {
      if (isInsert && isBeginning) {
        return {
          fullImpl,
          opTitle: 'Doubly Linked List: Insert at Beginning',
          time: 'O(1)',
          space: 'O(1) auxiliary',
          note: 'Allocates new node, sets newNode->next = head, head->prev = newNode, head = newNode.',
          snippets: {
            cpp: `// Doubly Linked List Insert Beginning: O(1)
void insertBeginning(int value) {
    Node* newNode = new Node(value);
    newNode->next = head;
    if (head) head->prev = newNode;
    head = newNode;
    if (!tail) tail = newNode;
    length++;
}`,
            python: `# Doubly Linked List Insert Beginning: O(1)
def insert_beginning(self, value):
    new_node = DoublyNode(value)
    new_node.next = self.head
    if self.head:
        self.head.prev = new_node
    self.head = new_node
    if not self.tail:
        self.tail = new_node
    self.length += 1`,
            java: `// Doubly Linked List Insert Beginning: O(1)
public void insertBeginning(int value) {
    Node newNode = new Node(value);
    newNode.next = head;
    if (head != null) head.prev = newNode;
    head = newNode;
    if (tail == null) tail = newNode;
    size++;
}`,
          },
        };
      } else if (isInsert && isEnd) {
        return {
          fullImpl,
          opTitle: 'Doubly Linked List: Insert at End',
          time: 'O(1) with Tail',
          space: 'O(1) auxiliary',
          note: 'Connects tail->next = newNode, newNode->prev = tail, then updates tail = newNode in O(1).',
          snippets: {
            cpp: `// Doubly Linked List Insert End: O(1) with Tail
void insertEnd(int value) {
    Node* newNode = new Node(value);
    if (!tail) {
        head = tail = newNode;
    } else {
        tail->next = newNode;
        newNode->prev = tail;
        tail = newNode;
    }
    length++;
}`,
            python: `# Doubly Linked List Insert End: O(1) with Tail
def insert_end(self, value):
    new_node = DoublyNode(value)
    if not self.tail:
        self.head = self.tail = new_node
    else:
        self.tail.next = new_node
        new_node.prev = self.tail
        self.tail = new_node
    self.length += 1`,
            java: `// Doubly Linked List Insert End: O(1) with Tail
public void insertEnd(int value) {
    Node newNode = new Node(value);
    if (tail == null) {
        head = tail = newNode;
    } else {
        tail.next = newNode;
        newNode.prev = tail;
        tail = newNode;
    }
    size++;
}`,
          },
        };
      } else if (isInsert) {
        return {
          fullImpl,
          opTitle: 'Doubly Linked List: Insert at Index',
          time: 'O(n)',
          space: 'O(1) auxiliary',
          note: 'Locates predecessor (i-1) and successor (i). Updates all 4 pointers: newNode->next = succ, succ->prev = newNode, pred->next = newNode, newNode->prev = pred.',
          snippets: {
            cpp: `// Doubly Linked List Insert at Index: O(n)
void insertAtIndex(int index, int value) {
    if (index < 0 || index > length) return;
    if (index == 0) { insertBeginning(value); return; }
    if (index == length) { insertEnd(value); return; }

    Node* curr = head;
    for (int i = 0; i < index - 1; i++) curr = curr->next;
    Node* succ = curr->next; // node currently at index

    Node* newNode = new Node(value);
    // 1. Connect newNode to successor
    newNode->next = succ;
    succ->prev = newNode;
    // 2. Connect predecessor to newNode
    newNode->prev = curr;
    curr->next = newNode;

    length++;
}`,
            python: `# Doubly Linked List Insert at Index: O(n)
def insert_at_index(self, index, value):
    if index < 0 or index > self.length:
        raise IndexError("Index out of bounds")
    if index == 0:
        self.insert_beginning(value)
        return
    if index == self.length:
        self.insert_end(value)
        return

    curr = self.head
    for _ in range(index - 1):
        curr = curr.next
    succ = curr.next  # node previously at index

    new_node = DoublyNode(value)
    # 1. Connect to successor
    new_node.next = succ
    succ.prev = new_node
    # 2. Connect to predecessor
    new_node.prev = curr
    curr.next = new_node

    self.length += 1`,
            java: `// Doubly Linked List Insert at Index: O(n)
public void insertAtIndex(int index, int value) {
    if (index < 0 || index > size) throw new IndexOutOfBoundsException();
    if (index == 0) { insertBeginning(value); return; }
    if (index == size) { insertEnd(value); return; }

    Node curr = head;
    for (int i = 0; i < index - 1; i++) curr = curr.next;
    Node succ = curr.next; // node previously at index

    Node newNode = new Node(value);
    // 1. Connect to successor
    newNode.next = succ;
    succ.prev = newNode;
    // 2. Connect to predecessor
    newNode.prev = curr;
    curr.next = newNode;

    size++;
}`,
          },
        };
      } else {
        return {
          fullImpl,
          opTitle: `Doubly Linked List: ${isBeginning ? 'Delete Beginning' : isEnd ? 'Delete End' : 'Delete at Index'}`,
          time: isBeginning || isEnd ? 'O(1)' : 'O(n)',
          space: 'O(1) auxiliary',
          note: 'Updates bidirectional pointers and deallocates deleted node.',
          snippets: {
            cpp: `// Doubly Linked List Deletion: O(1) or O(n)
void deleteAtIndex(int index) {
    if (index < 0 || index >= length) return;
    if (index == 0) { deleteBeginning(); return; }
    if (index == length - 1) { deleteEnd(); return; }

    Node* curr = head;
    for (int i = 0; i < index; i++) curr = curr->next;
    curr->prev->next = curr->next;
    curr->next->prev = curr->prev;
    delete curr;
    length--;
}`,
            python: `# Doubly Linked List Deletion: O(1) or O(n)
def delete_at_index(self, index):
    if index < 0 or index >= self.length:
        raise IndexError("Index out of bounds")
    if index == 0:
        return self.delete_beginning()
    if index == self.length - 1:
        return self.delete_end()

    curr = self.head
    for _ in range(index):
        curr = curr.next
    curr.prev.next = curr.next
    curr.next.prev = curr.prev
    self.length -= 1
    return curr.data`,
            java: `// Doubly Linked List Deletion: O(1) or O(n)
public int deleteAtIndex(int index) {
    if (index < 0 || index >= size) throw new IndexOutOfBoundsException();
    if (index == 0) return deleteBeginning();
    if (index == size - 1) return deleteEnd();

    Node curr = head;
    for (int i = 0; i < index; i++) curr = curr.next;
    curr.prev.next = curr.next;
    curr.next.prev = curr.prev;
    size--;
    return curr.data;
}`,
          },
        };
      }
    } else {
      return {
        fullImpl,
        opTitle: `Circular Linked List: ${isInsert ? 'Insertion' : 'Deletion'}`,
        time: isBeginning ? 'O(1) / O(n)' : 'O(n)',
        space: 'O(1) auxiliary',
        note: 'Unbroken circular loop connects the last node back to head without NULL.',
        snippets: {
          cpp: `// Circular Linked List Insert End: O(n)
void insertEnd(int value) {
    Node* newNode = new Node(value);
    if (!head) {
        head = newNode;
        newNode->next = head;
        return;
    }
    Node* curr = head;
    while (curr->next != head) curr = curr->next;
    curr->next = newNode;
    newNode->next = head;
    length++;
}`,
          python: `# Circular Linked List Insert End: O(n)
def insert_end(self, value):
    new_node = Node(value)
    if not self.head:
        self.head = new_node
        new_node.next = self.head
        return
    curr = self.head
    while curr.next != self.head:
        curr = curr.next
    curr.next = new_node
    new_node.next = self.head
    self.length += 1`,
          java: `// Circular Linked List Insert End: O(n)
public void insertEnd(int value) {
    Node newNode = new Node(value);
    if (head == null) {
        head = newNode;
        newNode.next = head;
        return;
    }
    Node curr = head;
    while (curr.next != head) curr = curr.next;
    curr.next = newNode;
    newNode.next = head;
    size++;
}`,
        },
      };
    }
  };

  const currentOpInfo = getSubtypeCodeAndComplexity();

  // ==========================================
  // GEOMETRY & LAYOUT CALCULATIONS FOR DIAGRAM
  // ==========================================
  // Node box sizes:
  // Singly: 106px width (DATA: 64px, NEXT: 42px), height: 54px
  // Doubly: 140px width (PREV: 38px, DATA: 64px, NEXT: 38px), height: 54px
  const isDoubly = subtype === 'doubly';
  const nodeWidth = isDoubly ? 140 : 106;
  const nodeHeight = 54;
  const gapWidth = 48;
  const stepDistance = nodeWidth + gapWidth;
  const startX = 32;
  const row1Y = 56; // Main row Y (gives 50px of clearance above for HEAD / TAIL vertical stems)
  const row2Y = 176; // Lower row Y (where staged new node appears)

  // Staged node position on row 2
  const activePosition = currentStep ? currentStep.position : insertPos;
  const stagedNodeVal = currentStep ? currentStep.stagedVal : parsedVal;

  let stagedColIndex = 0;
  if (activePosition === 'beginning') {
    stagedColIndex = 0;
  } else if (activePosition === 'end') {
    stagedColIndex = Math.max(0, currentList.length);
  } else {
    // Insert at index: staged node appears directly aligned with targetIdx (the index it will occupy!)
    const target = currentStep ? currentStep.targetIdx : parseInt(customIndex) || 0;
    stagedColIndex = Math.max(0, Math.min(target, currentList.length));
  }

  const stagedX = startX + stagedColIndex * stepDistance;

  // Staged node visibility on row 2:
  const showStagedNodeOnRow2 =
    (!currentStep && hasValidVal) ||
    (currentStep && currentStep.opType === 'insert' && currentStep.stepIndex < 4);

  // Animation phase flags
  const isInsertBeginningStep2 =
    currentStep?.opType === 'insert' &&
    currentStep?.position === 'beginning' &&
    currentStep?.stepIndex === 2;

  const isInsertBeginningStep3 =
    currentStep?.opType === 'insert' &&
    currentStep?.position === 'beginning' &&
    currentStep?.stepIndex === 3;

  const isInsertEndStep2 =
    currentStep?.opType === 'insert' &&
    currentStep?.position === 'end' &&
    currentStep?.stepIndex === 2;

  const isInsertIndexStep2 =
    currentStep?.opType === 'insert' &&
    currentStep?.position === 'index' &&
    currentStep?.stepIndex === 2;
  const isInsertIndexStep3 =
    currentStep?.opType === 'insert' &&
    currentStep?.position === 'index' &&
    currentStep?.stepIndex === 3;

  // Deletion States
  const isDeleteBeginningStep2 =
    currentStep?.opType === 'delete' &&
    currentStep?.position === 'beginning' &&
    currentStep?.stepIndex === 2;
  const isDeleteBeginningStep3 =
    currentStep?.opType === 'delete' &&
    currentStep?.position === 'beginning' &&
    currentStep?.stepIndex === 3;

  const isDeleteEndStep2 =
    currentStep?.opType === 'delete' &&
    currentStep?.position === 'end' &&
    currentStep?.stepIndex === 2;
  const isDeleteEndStep3 =
    currentStep?.opType === 'delete' &&
    currentStep?.position === 'end' &&
    currentStep?.stepIndex === 3;

  const isDeleteIndexStep2 =
    currentStep?.opType === 'delete' &&
    currentStep?.position === 'index' &&
    currentStep?.stepIndex === 2;
  const isDeleteIndexStep3 =
    currentStep?.opType === 'delete' &&
    currentStep?.position === 'index' &&
    currentStep?.stepIndex === 3;

  // ========================================================
  // DETERMINING EXACT HEAD & TAIL POINTER DESTINATIONS
  // ========================================================
  // Default values
  let headTargetIndex: number | null = currentList.length > 0 ? 0 : null;
  let tailTargetIndex: number | null = currentList.length > 0 ? currentList.length - 1 : null;
  let headPointsToStaged = false; // When true, HEAD points directly to staged node on Row 2
  let headMovedGreen = false;
  let tailMovedGreen = false;

  if (currentStep) {
    const { opType, position, stepIndex } = currentStep;
    if (opType === 'insert') {
      if (position === 'beginning') {
        if (stepIndex === 3) {
          // STEP 3: HEAD moves to point to [stagedNode] on Row 2!
          headTargetIndex = null;
          headPointsToStaged = true;
          headMovedGreen = true;
        } else if (stepIndex === 4) {
          headTargetIndex = 0;
          headMovedGreen = true;
        }
      } else if (position === 'end') {
        if (stepIndex === 3) {
          // TAIL moved to new end
          tailTargetIndex = currentList.length - 1;
          tailMovedGreen = true;
        }
      }
    } else if (opType === 'delete') {
      if (position === 'beginning') {
        if (stepIndex >= 2) {
          // HEAD advanced to index 1!
          headTargetIndex = currentList.length > 1 ? 1 : null;
          headMovedGreen = true;
          if (currentList.length === 1) {
            tailTargetIndex = null;
          }
        }
      } else if (position === 'end') {
        if (stepIndex >= 2) {
          // TAIL moved to second-to-last node!
          tailTargetIndex = currentList.length > 1 ? currentList.length - 2 : null;
          tailMovedGreen = true;
          if (currentList.length === 1) {
            headTargetIndex = null;
          }
        }
      }
    }
  }

  // Minimum canvas width to avoid clipping horizontal scroll
  const totalSlots = Math.max(currentList.length + 1, 4);
  const minCanvasWidth = startX + totalSlots * stepDistance + 140;

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-mono">
      {/* Terminal Title Bar & Subtype Tabs */}
      <div className="terminal-panel p-4 bg-[#0B1018] border border-[#1E3A5F] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded bg-[#0D1626] text-[#3B82F6] border border-[#1E3A5F]">
            <Link2 size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[#3B82F6] text-xs font-bold">&gt;</span>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
                LINKED_LIST_ENGINE
              </h1>
            </div>
            <p className="text-[11px] text-[#94A3B8]">
              Permanent HEAD &amp; TAIL pointers // In-Place Pointer Redirection
            </p>
          </div>
        </div>

        {/* 3 Selectable Subtype Tabs */}
        <div className="flex items-center gap-1 bg-[#05070B] p-1 rounded border border-[#1E3A5F]">
          <button
            onClick={() => {
              setSubtype('singly');
              handleResetAnimation();
            }}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              subtype === 'singly'
                ? 'bg-[#15243D] text-white border border-[#3B82F6] font-bold shadow-sm'
                : 'text-[#94A3B8] hover:text-[#EAF2FF]'
            }`}
          >
            [1] SINGLY
          </button>
          <button
            onClick={() => {
              setSubtype('doubly');
              handleResetAnimation();
            }}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              subtype === 'doubly'
                ? 'bg-[#15243D] text-white border border-[#3B82F6] font-bold shadow-sm'
                : 'text-[#94A3B8] hover:text-[#EAF2FF]'
            }`}
          >
            [2] DOUBLY
          </button>
          <button
            onClick={() => {
              setSubtype('circular');
              handleResetAnimation();
            }}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              subtype === 'circular'
                ? 'bg-[#15243D] text-white border border-[#3B82F6] font-bold shadow-sm'
                : 'text-[#94A3B8] hover:text-[#EAF2FF]'
            }`}
          >
            [3] CIRCULAR
          </button>
        </div>
      </div>

      {/* Main Grid: Terminal Control Panel (4 cols) & Central Visualizer (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Compact Terminal Controls Deck (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Node Value Input */}
          <div className="terminal-panel p-4 bg-[#0D1626] border border-[#1E3A5F] rounded-lg space-y-2">
            <div className="flex items-center justify-between text-xs text-[#94A3B8]">
              <span className="font-bold text-[#EAF2FF] flex items-center gap-1.5">
                <span className="text-[#3B82F6]">$</span> valInput
              </span>
              <span className="text-[10px] text-[#94A3B8]">type: int</span>
            </div>
            <input
              type="number"
              value={valInput}
              onChange={(e) => setValInput(e.target.value)}
              placeholder="e.g. 25"
              className="w-full bg-[#05070B] border border-[#1E3A5F] px-3 py-2 rounded text-sm text-[#EAF2FF] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          {/* Insertion Deck */}
          <div className="terminal-panel p-4 bg-[#0D1626] border border-[#1E3A5F] rounded-lg space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#EAF2FF]">
              <span className="flex items-center gap-1.5">
                <span className="text-[#22C55E]">+</span> INSERT_OPERATION
              </span>
              <span className="text-[10px] text-[#3B82F6]">target: {insertPos}</span>
            </div>

            <div className="grid grid-cols-3 gap-1 bg-[#05070B] p-1 rounded border border-[#1E3A5F] text-xs">
              <button
                onClick={() => setInsertPos('beginning')}
                className={`py-1 rounded font-semibold transition-colors ${
                  insertPos === 'beginning'
                    ? 'bg-[#15243D] text-white border border-[#3B82F6]'
                    : 'text-[#94A3B8] hover:text-[#EAF2FF]'
                }`}
              >
                Beginning
              </button>
              <button
                onClick={() => setInsertPos('end')}
                className={`py-1 rounded font-semibold transition-colors ${
                  insertPos === 'end'
                    ? 'bg-[#15243D] text-white border border-[#3B82F6]'
                    : 'text-[#94A3B8] hover:text-[#EAF2FF]'
                }`}
              >
                End
              </button>
              <button
                onClick={() => setInsertPos('index')}
                className={`py-1 rounded font-semibold transition-colors ${
                  insertPos === 'index'
                    ? 'bg-[#15243D] text-white border border-[#3B82F6]'
                    : 'text-[#94A3B8] hover:text-[#EAF2FF]'
                }`}
              >
                Index [i]
              </button>
            </div>

            {insertPos === 'index' && (
              <div className="flex gap-2 items-center text-xs">
                <span className="text-[#94A3B8]">index:</span>
                <input
                  type="number"
                  min="0"
                  max={currentList.length}
                  value={customIndex}
                  onChange={(e) => setCustomIndex(e.target.value)}
                  className="flex-1 bg-[#05070B] border border-[#1E3A5F] px-2 py-1 rounded text-xs text-[#EAF2FF]"
                />
              </div>
            )}

            <button
              onClick={handleStartInsert}
              disabled={!hasValidVal}
              className="w-full py-2 px-3 rounded text-xs font-bold uppercase bg-[#2563EB] hover:bg-[#3B82F6] text-white disabled:opacity-40 flex items-center justify-center gap-1.5 shadow-md transition-colors"
            >
              <Plus size={14} /> Run Insert at {insertPos}
            </button>
          </div>

          {/* Deletion Deck */}
          <div className="terminal-panel p-4 bg-[#0D1626] border border-[#1E3A5F] rounded-lg space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#EAF2FF]">
              <span className="flex items-center gap-1.5">
                <span className="text-[#EF4444]">-</span> DELETE_OPERATION
              </span>
              <span className="text-[10px] text-[#94A3B8]">target: {deletePos}</span>
            </div>

            <div className="grid grid-cols-3 gap-1 bg-[#05070B] p-1 rounded border border-[#1E3A5F] text-xs">
              <button
                onClick={() => setDeletePos('beginning')}
                className={`py-1 rounded font-semibold transition-colors ${
                  deletePos === 'beginning'
                    ? 'bg-[#15243D] text-white border border-[#3B82F6]'
                    : 'text-[#94A3B8] hover:text-[#EAF2FF]'
                }`}
              >
                Beginning
              </button>
              <button
                onClick={() => setDeletePos('end')}
                className={`py-1 rounded font-semibold transition-colors ${
                  deletePos === 'end'
                    ? 'bg-[#15243D] text-white border border-[#3B82F6]'
                    : 'text-[#94A3B8] hover:text-[#EAF2FF]'
                }`}
              >
                End
              </button>
              <button
                onClick={() => setDeletePos('index')}
                className={`py-1 rounded font-semibold transition-colors ${
                  deletePos === 'index'
                    ? 'bg-[#15243D] text-white border border-[#3B82F6]'
                    : 'text-[#94A3B8] hover:text-[#EAF2FF]'
                }`}
              >
                Index [i]
              </button>
            </div>

            {deletePos === 'index' && (
              <div className="flex gap-2 items-center text-xs">
                <span className="text-[#94A3B8]">index:</span>
                <input
                  type="number"
                  min="0"
                  max={Math.max(0, currentList.length - 1)}
                  value={customIndex}
                  onChange={(e) => setCustomIndex(e.target.value)}
                  className="flex-1 bg-[#05070B] border border-[#1E3A5F] px-2 py-1 rounded text-xs text-[#EAF2FF]"
                />
              </div>
            )}

            <button
              onClick={handleStartDelete}
              disabled={currentList.length === 0}
              className="w-full py-2 px-3 rounded text-xs font-bold uppercase bg-[#15243D] hover:bg-[#1E3A5F] text-[#EAF2FF] border border-[#1E3A5F] hover:text-[#EF4444] disabled:opacity-40 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trash2 size={14} /> Run Delete at {deletePos}
            </button>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleResetList}
            className="w-full py-2 px-3 rounded text-xs text-[#94A3B8] hover:text-[#EAF2FF] hover:bg-[#15243D] border border-[#1E3A5F] flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw size={13} /> Reset Memory to [10, 20, 30]
          </button>
        </div>

        {/* ======================================================== */}
        {/* CENTRAL VISUALIZATION WORKSPACE (8 cols)                 */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-3">
          <div className="terminal-panel p-5 bg-[#05070B] border border-[#1E3A5F] rounded-lg flex flex-col justify-between min-h-[470px] relative shadow-xl">
            {/* Terminal Window Header with Micro Step Badge */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-[#1E3A5F] text-xs">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-[#3B82F6]" />
                <span className="font-bold text-[#EAF2FF] tracking-wide">
                  MEMORY_BUFFER // {subtype.toUpperCase()}_LINKED_LIST
                </span>
              </div>

              {/* Small Step Indicator Badge */}
              {currentStep ? (
                <span className="px-2.5 py-0.5 rounded font-bold text-xs bg-[#102A1E] text-[#22C55E] border border-[#22C55E]/50 flex items-center gap-1.5 animate-pulse">
                  <Sparkles size={12} />
                  {currentStep.title}
                </span>
              ) : (
                <span className="text-[#94A3B8] text-[11px]">
                  LENGTH: {currentList.length}
                </span>
              )}
            </div>

            {/* SHARED DIAGRAM CONTAINER */}
            <div className="relative flex-1 w-full my-2 overflow-x-auto min-h-[300px] flex items-center">
              {currentList.length === 0 && !showStagedNodeOnRow2 ? (
                /* ================================================ */
                /* EMPTY LIST STATE: MANDATORY HEAD & TAIL TO NULL */
                /* ================================================ */
                <div className="w-full flex flex-col items-center justify-center py-10 space-y-4">
                  <div className="p-5 rounded-lg bg-[#0B1018] border border-[#1E3A5F] space-y-3 min-w-[260px] text-center shadow-lg">
                    <div className="flex items-center justify-center gap-3 text-xs">
                      <span className="text-white font-bold bg-[#15243D] border border-[#2563EB] px-2.5 py-1 rounded">
                        HEAD
                      </span>
                      <span className="text-[#3B82F6] font-bold">──&#9654;</span>
                      <span className="text-[#94A3B8] font-bold px-2 py-0.5 rounded bg-[#05070B] border border-[#1E3A5F]">
                        NULL
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-3 text-xs">
                      <span className="text-white font-bold bg-[#15243D] border border-[#3B82F6] px-2.5 py-1 rounded">
                        TAIL
                      </span>
                      <span className="text-[#3B82F6] font-bold">──&#9654;</span>
                      <span className="text-[#94A3B8] font-bold px-2 py-0.5 rounded bg-[#05070B] border border-[#1E3A5F]">
                        NULL
                      </span>
                    </div>

                    <div className="text-[11px] text-[#94A3B8] border-t border-[#1E3A5F] pt-2 tracking-widest font-bold">
                      [ 0 NODES ALLOCATED // EMPTY LIST ]
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  style={{ width: `${minCanvasWidth}px`, height: '280px' }}
                  className="relative shrink-0 select-none"
                >
                  {/* SVG Connecting Layer for Dynamic Arrows */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                    <defs>
                      {/* Blue Arrow Marker */}
                      <marker
                        id="arrow-blue"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                      >
                        <path d="M 0 1 L 9 5 L 0 9 z" fill="#3B82F6" />
                      </marker>

                      {/* Green Arrow Marker Right */}
                      <marker
                        id="arrow-green"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                      >
                        <path d="M 0 1 L 9 5 L 0 9 z" fill="#22C55E" />
                      </marker>

                      {/* Green Arrow Marker Reverse */}
                      <marker
                        id="arrow-green-rev"
                        viewBox="0 0 10 10"
                        refX="2"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto"
                      >
                        <path d="M 9 1 L 0 5 L 9 9 z" fill="#22C55E" />
                      </marker>

                      {/* Red Arrow Marker */}
                      <marker
                        id="arrow-red"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                      >
                        <path d="M 0 1 L 9 5 L 0 9 z" fill="#EF4444" />
                      </marker>
                    </defs>

                    {/* ---------------------------------------------------- */}
                    {/* INSERT BEGINNING: UPWARD GREEN ARROW (Step 2 & Step 3) */}
                    {/* ---------------------------------------------------- */}
                    {(isInsertBeginningStep2 || isInsertBeginningStep3) && (
                      <g>
                        <path
                          d={`M ${stagedX + (isDoubly ? 115 : 82)} ${row2Y} L ${stagedX + (isDoubly ? 115 : 82)} ${row1Y + nodeHeight + 8}`}
                          stroke="#22C55E"
                          strokeWidth="3.5"
                          fill="none"
                          markerEnd="url(#arrow-green)"
                          strokeDasharray="6 3"
                          className="animate-pulse"
                        />
                        <rect
                          x={stagedX + (isDoubly ? 125 : 92)}
                          y={(row1Y + nodeHeight + row2Y) / 2 - 12}
                          width="142"
                          height="22"
                          rx="4"
                          fill="#0D1626"
                          stroke="#22C55E"
                          strokeWidth="1.5"
                        />
                        <text
                          x={stagedX + (isDoubly ? 132 : 99)}
                          y={(row1Y + nodeHeight + row2Y) / 2 + 3}
                          fill="#22C55E"
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          newNode-&gt;next = head;
                        </text>
                      </g>
                    )}

                    {/* ---------------------------------------------------- */}
                    {/* INSERT END: DOWNWARD GREEN ARROW (Step 2)            */}
                    {/* ---------------------------------------------------- */}
                    {isInsertEndStep2 && currentList.length > 0 && (
                      <g>
                        <path
                          d={`M ${stagedX + (isDoubly ? 115 : 82)} ${row1Y + nodeHeight} L ${stagedX + (isDoubly ? 115 : 82)} ${row2Y - 8}`}
                          stroke="#22C55E"
                          strokeWidth="3.5"
                          fill="none"
                          markerEnd="url(#arrow-green)"
                          strokeDasharray="6 3"
                          className="animate-pulse"
                        />
                        <rect
                          x={stagedX - 115}
                          y={(row1Y + nodeHeight + row2Y) / 2 - 12}
                          width="106"
                          height="22"
                          rx="4"
                          fill="#0D1626"
                          stroke="#22C55E"
                          strokeWidth="1.5"
                        />
                        <text
                          x={stagedX - 109}
                          y={(row1Y + nodeHeight + row2Y) / 2 + 3}
                          fill="#22C55E"
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          tail-&gt;next = node;
                        </text>
                      </g>
                    )}

                    {/* ---------------------------------------------------- */}
                    {/* INSERT INDEX: CONNECTORS (Step 2 & Step 3)            */}
                    {/* ---------------------------------------------------- */}
                    {isInsertIndexStep2 && (
                      <g>
                        {/* newNode->next points directly UP into successor node (at stagedColIndex) */}
                        <path
                          d={`M ${stagedX + (isDoubly ? 115 : 82)} ${row2Y} L ${stagedX + (isDoubly ? 115 : 82)} ${row1Y + nodeHeight + 8}`}
                          stroke="#22C55E"
                          strokeWidth="3.5"
                          fill="none"
                          markerEnd="url(#arrow-green)"
                          strokeDasharray="6 3"
                          className="animate-pulse"
                        />
                        {/* In Doubly: successor->prev points back down into newNode */}
                        {isDoubly && (
                          <path
                            d={`M ${stagedX + 25} ${row1Y + nodeHeight} L ${stagedX + 25} ${row2Y - 8}`}
                            stroke="#22C55E"
                            strokeWidth="3.5"
                            fill="none"
                            markerEnd="url(#arrow-green)"
                            strokeDasharray="6 3"
                            className="animate-pulse"
                          />
                        )}
                        <rect
                          x={stagedX + (isDoubly ? 125 : 92)}
                          y={(row1Y + nodeHeight + row2Y) / 2 - 14}
                          width={isDoubly ? "160" : "130"}
                          height="24"
                          rx="4"
                          fill="#0D1626"
                          stroke="#22C55E"
                          strokeWidth="1.5"
                        />
                        <text
                          x={stagedX + (isDoubly ? 132 : 98)}
                          y={(row1Y + nodeHeight + row2Y) / 2 + 2}
                          fill="#22C55E"
                          fontSize="9.5"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {isDoubly
                            ? `newNode->next=succ; succ->prev=newNode;`
                            : `newNode->next = succ;`}
                        </text>
                      </g>
                    )}
                    {isInsertIndexStep3 && (
                      <g>
                        {/* predecessor is at stagedColIndex - 1. predecessor->next points down into newNode */}
                        <path
                          d={`M ${stagedX - stepDistance + (isDoubly ? 115 : 82)} ${row1Y + nodeHeight} Q ${stagedX - gapWidth / 2} ${(row1Y + row2Y) / 2} ${stagedX + 20} ${row2Y - 8}`}
                          stroke="#22C55E"
                          strokeWidth="3.5"
                          fill="none"
                          markerEnd="url(#arrow-green)"
                          strokeDasharray="6 3"
                          className="animate-pulse"
                        />
                        {/* In Doubly: newNode->prev points back to predecessor */}
                        {isDoubly && (
                          <path
                            d={`M ${stagedX + 15} ${row2Y} Q ${stagedX - gapWidth / 2} ${(row1Y + row2Y) / 2} ${stagedX - stepDistance + (isDoubly ? 95 : 62)} ${row1Y + nodeHeight + 8}`}
                            stroke="#22C55E"
                            strokeWidth="3.5"
                            fill="none"
                            markerEnd="url(#arrow-green)"
                            strokeDasharray="6 3"
                            className="animate-pulse"
                          />
                        )}
                        <rect
                          x={stagedX - stepDistance + 10}
                          y={(row1Y + nodeHeight + row2Y) / 2 - 14}
                          width={isDoubly ? "160" : "130"}
                          height="24"
                          rx="4"
                          fill="#0D1626"
                          stroke="#22C55E"
                          strokeWidth="1.5"
                        />
                        <text
                          x={stagedX - stepDistance + 16}
                          y={(row1Y + nodeHeight + row2Y) / 2 + 2}
                          fill="#22C55E"
                          fontSize="9.5"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {isDoubly
                            ? `pred->next=newNode; newNode->prev=pred;`
                            : `prev->next = newNode;`}
                        </text>
                      </g>
                    )}

                    {/* ---------------------------------------------------- */}
                    {/* DELETE INDEX: CURVED GREEN BYPASS ARROW (Step 2)      */}
                    {/* ---------------------------------------------------- */}
                    {isDeleteIndexStep2 && currentStep && (
                      <g>
                        <path
                          d={`M ${startX + (currentStep.targetIdx - 1) * stepDistance + nodeWidth - 10} ${row1Y} Q ${startX + currentStep.targetIdx * stepDistance + nodeWidth / 2} ${row1Y - 44} ${startX + (currentStep.targetIdx + 1) * stepDistance + 10} ${row1Y}`}
                          stroke="#22C55E"
                          strokeWidth="3.5"
                          fill="none"
                          markerEnd="url(#arrow-green)"
                          strokeDasharray="5 3"
                          className="animate-pulse"
                        />
                        <rect
                          x={startX + currentStep.targetIdx * stepDistance - 20}
                          y={row1Y - 50}
                          width="144"
                          height="20"
                          rx="4"
                          fill="#0D1626"
                          stroke="#22C55E"
                          strokeWidth="1.5"
                        />
                        <text
                          x={startX + currentStep.targetIdx * stepDistance - 14}
                          y={row1Y - 36}
                          fill="#22C55E"
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          prev-&gt;next = curr-&gt;next
                        </text>
                      </g>
                    )}

                    {/* ---------------------------------------------------- */}
                    {/* CIRCULAR LINKED LIST RETURN ARROW (MANDATORY VISUAL) */}
                    {/* ---------------------------------------------------- */}
                    {subtype === 'circular' && currentList.length > 0 && (
                      <g>
                        {currentList.length === 1 ? (
                          // Single-node circular list loops back around itself
                          <path
                            d={`M ${startX + nodeWidth} ${row1Y + nodeHeight / 2} C ${startX + nodeWidth + 35} ${row1Y + nodeHeight / 2}, ${startX + nodeWidth + 35} ${row1Y + nodeHeight + 35}, ${startX + nodeWidth / 2} ${row1Y + nodeHeight + 35} C ${startX + 15} ${row1Y + nodeHeight + 35}, ${startX + 15} ${row1Y + nodeHeight + 10}, ${startX + 24} ${row1Y + nodeHeight + 8}`}
                            stroke="#22C55E"
                            strokeWidth="2.5"
                            fill="none"
                            markerEnd="url(#arrow-green)"
                          />
                        ) : (
                          // Multiple-node circular list loop from Tail directly into Head
                          <>
                            <path
                              d={`M ${startX + (currentList.length - 1) * stepDistance + nodeWidth - 20} ${row1Y + nodeHeight} L ${startX + (currentList.length - 1) * stepDistance + nodeWidth - 20} ${row1Y + nodeHeight + 34} L ${startX + 24} ${row1Y + nodeHeight + 34} L ${startX + 24} ${row1Y + nodeHeight + 8}`}
                              stroke="#22C55E"
                              strokeWidth="2.5"
                              fill="none"
                              markerEnd="url(#arrow-green)"
                            />
                            <rect
                              x={startX + ((currentList.length - 1) * stepDistance) / 2 - 35}
                              y={row1Y + nodeHeight + 24}
                              width="170"
                              height="20"
                              rx="3"
                              fill="#0D1626"
                              stroke="#22C55E"
                              strokeWidth="1.2"
                            />
                            <text
                              x={startX + ((currentList.length - 1) * stepDistance) / 2 - 28}
                              y={row1Y + nodeHeight + 38}
                              fill="#22C55E"
                              fontSize="9"
                              fontFamily="monospace"
                              fontWeight="bold"
                            >
                              tail-&gt;next = head [LOOP]
                            </text>
                          </>
                        )}
                      </g>
                    )}
                  </svg>

                  {/* ==================================================== */}
                  {/* MANDATORY: PERMANENT HEAD & TAIL POINTER INDICATORS  */}
                  {/* ==================================================== */}
                  {currentList.map((_, idx) => {
                    const nodeX = startX + idx * stepDistance;
                    const cx = nodeX + nodeWidth / 2;

                    const isHeadTarget = headTargetIndex === idx;
                    const isTailTarget = tailTargetIndex === idx;

                    if (!isHeadTarget && !isTailTarget) return null;

                    // CASE A: Single Node (Both HEAD and TAIL point here)
                    if (isHeadTarget && isTailTarget) {
                      return (
                        <div
                          key={`pointer-both-${idx}`}
                          style={{ left: `${cx - 48}px`, top: '8px', width: '96px' }}
                          className="absolute flex flex-col items-center pointer-events-none z-30"
                        >
                          <span
                            className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1 border ${
                              headMovedGreen || tailMovedGreen
                                ? 'bg-[#102A1E] text-[#22C55E] border-[#22C55E]'
                                : 'bg-[#15243D] text-white border-[#2563EB]'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                            HEAD, TAIL
                          </span>
                          <span
                            className={`text-xs font-bold leading-none mt-0.5 ${
                              headMovedGreen || tailMovedGreen ? 'text-[#22C55E]' : 'text-[#3B82F6]'
                            }`}
                          >
                            │
                          </span>
                          <span
                            className={`text-xs font-bold leading-none -mt-1 ${
                              headMovedGreen || tailMovedGreen ? 'text-[#22C55E]' : 'text-[#3B82F6]'
                            }`}
                          >
                            ▼
                          </span>
                        </div>
                      );
                    }

                    // CASE B: HEAD pointer only
                    if (isHeadTarget) {
                      return (
                        <div
                          key={`pointer-head-${idx}`}
                          style={{ left: `${cx - 36}px`, top: '8px', width: '72px' }}
                          className="absolute flex flex-col items-center pointer-events-none z-30"
                        >
                          <span
                            className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1 border ${
                              headMovedGreen
                                ? 'bg-[#102A1E] text-[#22C55E] border-[#22C55E] animate-pulse'
                                : 'bg-[#15243D] text-white border-[#2563EB]'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                            HEAD
                          </span>
                          <span
                            className={`text-xs font-bold leading-none mt-0.5 ${
                              headMovedGreen ? 'text-[#22C55E]' : 'text-[#2563EB]'
                            }`}
                          >
                            │
                          </span>
                          <span
                            className={`text-xs font-bold leading-none -mt-1 ${
                              headMovedGreen ? 'text-[#22C55E]' : 'text-[#2563EB]'
                            }`}
                          >
                            ▼
                          </span>
                        </div>
                      );
                    }

                    // CASE C: TAIL pointer only
                    if (isTailTarget) {
                      return (
                        <div
                          key={`pointer-tail-${idx}`}
                          style={{ left: `${cx - 36}px`, top: '8px', width: '72px' }}
                          className="absolute flex flex-col items-center pointer-events-none z-30"
                        >
                          <span
                            className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1 border ${
                              tailMovedGreen
                                ? 'bg-[#102A1E] text-[#22C55E] border-[#22C55E] animate-pulse'
                                : 'bg-[#15243D] text-[#EAF2FF] border-[#3B82F6]'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                            TAIL
                          </span>
                          <span
                            className={`text-xs font-bold leading-none mt-0.5 ${
                              tailMovedGreen ? 'text-[#22C55E]' : 'text-[#3B82F6]'
                            }`}
                          >
                            │
                          </span>
                          <span
                            className={`text-xs font-bold leading-none -mt-1 ${
                              tailMovedGreen ? 'text-[#22C55E]' : 'text-[#3B82F6]'
                            }`}
                          >
                            ▼
                          </span>
                        </div>
                      );
                    }

                    return null;
                  })}

                  {/* ==================================================== */}
                  {/* ROW 1: MAIN CHAIN OF LINKED LIST NODES               */}
                  {/* ==================================================== */}
                  {currentList.map((val, idx) => {
                    const nodeX = startX + idx * stepDistance;
                    const isLast = idx === currentList.length - 1;

                    // Active states
                    const isTargetDelete =
                      currentStep?.opType === 'delete' && currentStep?.targetIdx === idx;
                    const isSeveredLink =
                      (isDeleteBeginningStep2 && idx === 0) ||
                      (isDeleteEndStep2 && isLast) ||
                      (isDeleteIndexStep2 && isTargetDelete);
                    const isDroppedOut =
                      (isDeleteBeginningStep3 && idx === 0) ||
                      (isDeleteEndStep3 && isLast) ||
                      (isDeleteIndexStep3 && isTargetDelete);

                    return (
                      <React.Fragment key={`node-${idx}-${val}`}>
                        {/* Terminal Node Memory Cell */}
                        <div
                          style={{
                            left: `${nodeX}px`,
                            top: `${row1Y}px`,
                            width: `${nodeWidth}px`,
                            height: `${nodeHeight}px`,
                          }}
                          className={`absolute flex rounded overflow-hidden font-mono border transition-all duration-300 z-20 shadow-sm ${
                            isDroppedOut
                              ? 'translate-y-12 opacity-30 border-[#EF4444] bg-[#2A1010]'
                              : isTargetDelete
                              ? 'border-[#EF4444] bg-[#2A1010] text-[#EF4444] shadow-md shadow-[#EF4444]/30'
                              : 'border-[#1E3A5F] bg-[#0D1626] text-[#EAF2FF]'
                          }`}
                        >
                          {/* Doubly: PREV Slot */}
                          {isDoubly && (
                            <div className="w-[38px] bg-[#0B1018] border-r border-[#1E3A5F] flex flex-col items-center justify-center text-[10px] text-[#94A3B8]">
                              <span className="font-bold">{idx === 0 ? 'NULL' : '⮜'}</span>
                              <span className="text-[7px]">prev</span>
                            </div>
                          )}

                          {/* DATA Slot */}
                          <div className="flex-1 bg-[#0D1626] flex flex-col items-center justify-center">
                            <span className="text-[8px] text-[#94A3B8]">[{idx}]</span>
                            <span className="text-sm font-bold text-white">{val}</span>
                          </div>

                          {/* NEXT Slot */}
                          <div
                            className={`w-[42px] bg-[#0B1018] border-l border-[#1E3A5F] flex flex-col items-center justify-center text-[11px] ${
                              isSeveredLink
                                ? 'text-[#EF4444] line-through font-bold'
                                : 'text-[#3B82F6]'
                            }`}
                          >
                            <span>{isSeveredLink ? '✂' : isLast && subtype !== 'circular' ? 'NULL' : '•'}</span>
                            <span className="text-[7px] text-[#94A3B8]">next</span>
                          </div>
                        </div>

                        {/* Horizontal Arrow Connectors between consecutive nodes */}
                        {idx < currentList.length - 1 && (
                          <div
                            style={{
                              left: `${nodeX + nodeWidth}px`,
                              top: `${row1Y + nodeHeight / 2 - 10}px`,
                              width: `${gapWidth}px`,
                            }}
                            className={`absolute flex items-center justify-center text-xs font-mono font-bold transition-all z-20 ${
                              isSeveredLink
                                ? 'text-[#EF4444] line-through opacity-60'
                                : 'text-[#3B82F6]'
                            }`}
                          >
                            {isDoubly ? (
                              <div className="flex flex-col items-center leading-none">
                                <ArrowRight size={15} />
                                <ArrowLeft size={15} className="text-[#94A3B8]" />
                              </div>
                            ) : (
                              <ArrowRight size={18} />
                            )}
                          </div>
                        )}

                        {/* Final NULL Terminator (Only for non-circular lists) */}
                        {isLast && subtype !== 'circular' && (
                          <div
                            style={{
                              left: `${nodeX + nodeWidth + 8}px`,
                              top: `${row1Y + nodeHeight / 2 - 12}px`,
                            }}
                            className="absolute flex items-center gap-1.5 font-mono text-xs text-[#94A3B8] z-20"
                          >
                            <span className="text-[#3B82F6] font-bold">──&#9654;</span>
                            <span className="px-2 py-0.5 rounded bg-[#0D1626] border border-[#1E3A5F] font-bold text-[10px] text-[#EAF2FF]">
                              NULL
                            </span>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}

                  {/* ==================================================== */}
                  {/* ROW 2: STAGED NEW NODE (IN-PLACE BELOW ROW 1)        */}
                  {/* ==================================================== */}
                  {showStagedNodeOnRow2 && (
                    <>
                      {/* IN STEP 3: HEAD POINTER VISIBLY POINTS TO ROW 2 STAGED NODE! */}
                      {headPointsToStaged && (
                        <div
                          style={{
                            left: `${stagedX + nodeWidth / 2 - 36}px`,
                            top: `${row2Y - 44}px`,
                            width: '72px',
                          }}
                          className="absolute flex flex-col items-center pointer-events-none z-30 animate-bounce"
                        >
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow-lg flex items-center gap-1 bg-[#102A1E] text-[#22C55E] border border-[#22C55E]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                            HEAD
                          </span>
                          <span className="text-xs font-bold leading-none mt-0.5 text-[#22C55E]">│</span>
                          <span className="text-xs font-bold leading-none -mt-1 text-[#22C55E]">▼</span>
                        </div>
                      )}

                      {/* Staged Node Memory Box */}
                      <div
                        style={{
                          left: `${stagedX}px`,
                          top: `${row2Y}px`,
                          width: `${nodeWidth}px`,
                          height: `${nodeHeight}px`,
                        }}
                        className={`absolute flex rounded overflow-hidden font-mono border-2 transition-all duration-300 z-20 shadow-md ${
                          isInsertBeginningStep3
                            ? 'border-[#22C55E] bg-[#102A1E] text-[#22C55E] shadow-lg shadow-[#22C55E]/40'
                            : isInsertBeginningStep2
                            ? 'border-[#22C55E] bg-[#0D1626] text-white shadow-md shadow-[#22C55E]/30'
                            : 'border-[#2563EB] bg-[#0D1626] text-[#EAF2FF] shadow-[0_0_12px_rgba(37,99,235,0.35)]'
                        }`}
                      >
                        {!headPointsToStaged && (
                          <div className="absolute -top-5 left-1 text-[8px] font-bold text-[#3B82F6] uppercase tracking-wider">
                            NEW_NODE
                          </div>
                        )}

                        {/* Doubly: PREV Slot */}
                        {isDoubly && (
                          <div
                            className={`w-[38px] border-r flex flex-col items-center justify-center text-[10px] transition-colors ${
                              isInsertIndexStep3
                                ? 'bg-[#102A1E] border-[#22C55E] text-[#22C55E] font-bold'
                                : 'bg-[#0B1018] border-[#1E3A5F] text-[#94A3B8]'
                            }`}
                          >
                            <span className="font-bold">{isInsertIndexStep3 ? '⮜' : 'NULL'}</span>
                            <span className="text-[7px]">prev</span>
                          </div>
                        )}

                        {/* DATA Slot */}
                        <div className="flex-1 bg-[#0D1626] flex flex-col items-center justify-center">
                          <span className="text-[8px] text-[#94A3B8]">DATA</span>
                          <span className="text-sm font-bold text-white">{stagedNodeVal}</span>
                        </div>

                        {/* NEXT Slot */}
                        <div
                          className={`w-[42px] border-l flex flex-col items-center justify-center text-[11px] transition-colors ${
                            isInsertBeginningStep2 || isInsertBeginningStep3 || isInsertIndexStep2 || isInsertIndexStep3
                              ? 'bg-[#102A1E] border-[#22C55E] text-[#22C55E] font-bold'
                              : 'bg-[#0B1018] border-[#1E3A5F] text-[#3B82F6]'
                          }`}
                        >
                          <span>{isInsertBeginningStep2 || isInsertBeginningStep3 || isInsertIndexStep2 || isInsertIndexStep3 ? '▲' : '•'}</span>
                          <span className="text-[7px] text-[#94A3B8]">next</span>
                        </div>
                      </div>

                      {/* Staged Node Next -> NULL indicator (when in Step 1 or idle) */}
                      {!isInsertBeginningStep2 && !isInsertBeginningStep3 && !isInsertEndStep2 && !isInsertIndexStep2 && !isInsertIndexStep3 && (
                        <div
                          style={{
                            left: `${stagedX + nodeWidth + 8}px`,
                            top: `${row2Y + nodeHeight / 2 - 10}px`,
                          }}
                          className="absolute flex items-center gap-1.5 font-mono text-xs text-[#94A3B8] z-20"
                        >
                          <span className="text-[#3B82F6] font-bold">──&#9654;</span>
                          <span className="px-1.5 py-0.5 rounded bg-[#0D1626] border border-[#1E3A5F] text-[9px] text-[#94A3B8]">
                            NULL
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Terminal Step Playback Controls Bar */}
            <div className="pt-3 border-t border-[#1E3A5F] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevStep}
                  disabled={!currentStep || currentStep.stepIndex <= 1}
                  className="px-2.5 py-1.5 rounded bg-[#15243D] text-[#EAF2FF] hover:bg-[#1E3A5F] disabled:opacity-40 flex items-center gap-1 transition-colors border border-[#1E3A5F]"
                >
                  <ChevronLeft size={14} /> Prev Step
                </button>

                <button
                  onClick={handleNextStep}
                  disabled={!currentStep || currentStep.isCompleted}
                  className="px-3.5 py-1.5 rounded bg-[#2563EB] hover:bg-[#3B82F6] text-white disabled:opacity-40 flex items-center gap-1 font-bold shadow-md transition-colors"
                >
                  Next Step <ChevronRight size={14} />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  disabled={!currentStep || currentStep.isCompleted}
                  className="px-2.5 py-1.5 rounded bg-[#15243D] text-[#EAF2FF] hover:bg-[#1E3A5F] disabled:opacity-40 flex items-center gap-1 transition-colors border border-[#1E3A5F]"
                >
                  {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>

                <button
                  onClick={handleResetAnimation}
                  disabled={!currentStep}
                  className="px-2.5 py-1.5 rounded text-[#94A3B8] hover:text-white disabled:opacity-30 transition-colors"
                >
                  Reset
                </button>
              </div>

              {/* Status Note */}
              <div className="text-[11px] text-[#94A3B8] flex items-center gap-1.5">
                <span className="text-[#3B82F6]">$</span>
                <span>
                  {currentStep
                    ? currentStep.title
                    : `Enter a value and trigger an operation to observe pointer changes.`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Complexity Panel with Full Implementation & Snippet Toggle */}
      <CodeComplexityPanel
        operationName={currentOpInfo.opTitle}
        timeComplexity={currentOpInfo.time}
        spaceComplexity={currentOpInfo.space}
        complexityNote={currentOpInfo.note}
        codeSnippets={currentOpInfo.snippets}
        fullImplementation={currentOpInfo.fullImpl}
      />
    </div>
  );
};
