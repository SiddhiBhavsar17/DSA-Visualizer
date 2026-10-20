# DSA Computing Platform — Interactive Data Structures Visualizer

A clean, focused, interactive educational platform for learning fundamental Data Structures and Algorithms (DSA) through step-by-step visualizations.

## Modules

### 1. Landing Dashboard
- **DSA COMPUTING PLATFORM** — "Learn Data Structures Through Interactive Visualization"
- Four streamlined navigation cards:
  - **Stack** (LIFO)
  - **Queue** (FIFO)
  - **Array** (Fixed-Capacity Sequential Storage)
  - **Linked List** (Singly, Doubly, and Circular Linked Lists)

### 2. Stack Visualizer
- Preserved LIFO vertical visualization with TOP pointer indicator.
- Controls: Value input, Random generator, Push, Pop, Peek, Set Capacity, Clear Stack.
- Time & Space complexity indicators: O(1) Push, O(1) Pop, O(1) Peek.
- Implementation code in **C++**, **Python**, and **Java** for the active operation.

### 3. Queue Visualizer
- Preserved FIFO horizontal transport rail with FRONT and REAR pointer indicators.
- Controls: Value input, Random generator, Enqueue, Dequeue, Peek, Set Capacity, Clear Queue.
- Time & Space complexity indicators: O(1) Enqueue, O(1) Dequeue, O(1) Peek.
- Implementation code in **C++**, **Python**, and **Java** for the active operation.

### 4. Array Visualizer (Fixed-Capacity & Sequential Insertion)
- Row of fixed array cells with indices `[0, 1, 2, ..., Capacity - 1]`.
- Displays fixed capacity and currently occupied elements (`Occupied: X / Capacity`).
- Distinguishes occupied cells from empty placeholder cells (`_`).
- Inserts new elements into the **next available position** at the end of the occupied portion without overwriting existing data.
- **Clear Array** button resets all cells to empty while keeping capacity and indices fixed.
- Handles full-array alerts safely.
- Time & Space complexity: Insert at next position O(1), Clear O(1)/O(n), Access O(1).
- Implementation code in **C++**, **Python**, and **Java**.

### 5. Linked List Visualizer (3 Distinct Subtypes)
- **Three Selectable Subtypes**:
  1. **Singly Linked List**: `[value | next] ➔ ... ➔ NULL` with forward arrows and `HEAD`.
  2. **Doubly Linked List**: `NULL ⮜ [prev | value | next] ⇄ ... ➔ NULL` with forward and backward connections.
  3. **Circular Linked List**: Closed loop where the last node links back to `HEAD` (single node points to itself; no NULL).
- **Visible New Node Preview**:
  - Typing a value in the input dynamically renders a separate node preview (`[ val | NEXT ]` or `[ PREV | val | NEXT ]`) above the list before insertion.
- **Controls & Operations**:
  - Insert at Beginning, End, or Specified Index.
  - Delete at Beginning, End, or Specified Index.
  - Reset to sample nodes.
- **Step-by-Step Visualization Controls**:
  - **Previous Step**, **Next Step**, **Play / Pause**, and **Reset Animation**.
  - Informative step status messages (e.g. `Step 1/4: Created separate new node [25]`).
- Time & Space complexity and implementation code in **C++**, **Python**, and **Java**.

## Tech Stack
- **Framework**: React 19 (TypeScript)
- **Styling**: Tailwind CSS (strict Black, Blue, and Green palette)
- **Icons**: Lucide React
- **Bundler**: Vite