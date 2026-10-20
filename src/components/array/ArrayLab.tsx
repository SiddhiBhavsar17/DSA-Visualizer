import React, { useState } from 'react';
import { useDSA } from '../../context/DSAContext';
import {
  Grid,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';
import { CodeComplexityPanel, CodeSnippets } from '../common/CodeComplexityPanel';
import { ARRAY_FULL_CODE } from '../../data/dsaCodeRepository';

type ArrayOperation = 'insert' | 'clear' | 'access';

export const ArrayLab: React.FC = () => {
  const {
    array,
    arrayCapacity,
    lastArrayMessage,
    setArrayCapacity,
    clearArray,
    insertAtArray,
  } = useDSA();

  const [capacityInput, setCapacityInput] = useState<string>(arrayCapacity.toString());
  const [valInput, setValInput] = useState<string>('');
  const [activeOp, setActiveOp] = useState<ArrayOperation>('insert');
  const [statusMsg, setStatusMsg] = useState<string>(lastArrayMessage);
  const [confirmCapChange, setConfirmCapChange] = useState<number | null>(null);
  const [lastInsertedIndex, setLastInsertedIndex] = useState<number | null>(null);

  const handleSetCapacity = () => {
    const newCap = parseInt(capacityInput);
    if (isNaN(newCap) || newCap < 1) return;
    const clamped = Math.min(20, Math.max(1, newCap));

    // If changing capacity would discard existing elements, ask confirmation
    if (array.length > clamped) {
      setConfirmCapChange(clamped);
      return;
    }

    setArrayCapacity(clamped);
    setStatusMsg(`Array capacity configured to ${clamped} cells.`);
    setConfirmCapChange(null);
  };

  const confirmCapacityChange = () => {
    if (confirmCapChange !== null) {
      setArrayCapacity(confirmCapChange);
      setStatusMsg(`Array resized to ${confirmCapChange} cells. Overflow elements discarded.`);
      setConfirmCapChange(null);
    }
  };

  const handleInsert = () => {
    setActiveOp('insert');
    if (array.length >= arrayCapacity) {
      setStatusMsg('Array is full. Clear the array or initialize a larger capacity.');
      return;
    }

    const val = valInput.trim() !== '' ? parseInt(valInput) : Math.floor(Math.random() * 90) + 10;
    const targetIdx = array.length; // Next available index!
    const ok = insertAtArray(targetIdx, val);
    if (ok) {
      setValInput('');
      setLastInsertedIndex(targetIdx);
      setStatusMsg(`Inserted ${val} at next available position [${targetIdx}].`);
      setTimeout(() => setLastInsertedIndex(null), 1500);
    }
  };

  const handleClear = () => {
    setActiveOp('clear');
    clearArray();
    setStatusMsg('Array cleared. All cells reset to empty.');
    setLastInsertedIndex(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInsert();
    }
  };

  const isFull = array.length >= arrayCapacity;
  const isEmpty = array.length === 0;

  // Code snippets for Array operations in C++, Python, and Java
  const codeSnippetsMap: Record<ArrayOperation, { snippets: CodeSnippets; time: string; space: string; note: string }> = {
    insert: {
      time: 'O(1)',
      space: 'O(1) auxiliary',
      note: 'Inserting into the next available position in a preallocated array takes constant O(1) time because the index is known and no elements shift.',
      snippets: {
        cpp: `// Insert at next available index
void insert(int value) {
    if (size >= capacity) {
        cout << "Array is full!\\n";
        return;
    }
    arr[size] = value; // Direct index assignment
    size++;
}`,
        python: `# Insert at next available index
def insert(self, value):
    if len(self.arr) >= self.capacity:
        raise OverflowError("Array is full!")
    self.arr.append(value) # Direct O(1) append`,
        java: `// Insert at next available index
public void insert(int value) {
    if (size >= capacity) {
        System.out.println("Array is full!");
        return;
    }
    arr[size] = value; // Direct index assignment
    size++;
}`,
      },
    },
    clear: {
      time: 'O(1) / O(n)',
      space: 'O(1) auxiliary',
      note: 'Clearing an array is O(1) when resetting the logical size counter (size = 0), or O(n) if zeroing each allocated memory cell.',
      snippets: {
        cpp: `// Clear array
void clear() {
    size = 0; // O(1) logical size reset
}`,
        python: `# Clear array
def clear(self):
    self.arr = [] # Reset elements list`,
        java: `// Clear array
public void clear() {
    size = 0; // O(1) logical size reset
}`,
      },
    },
    access: {
      time: 'O(1)',
      space: 'O(1) auxiliary',
      note: 'Array memory is contiguous: BaseAddress + (Index * ElementSize) yields immediate O(1) direct access.',
      snippets: {
        cpp: `int get(int index) {
    if (index < 0 || index >= size) return -1;
    return arr[index]; // O(1) pointer arithmetic
}`,
        python: `def get(self, index):
    if 0 <= index < len(self.arr):
        return self.arr[index]
    raise IndexError("Out of bounds")`,
        java: `public int get(int index) {
    if (index < 0 || index >= size) throw new IndexOutOfBoundsException();
    return arr[index]; // O(1) direct offset
}`,
      },
    },
  };

  const currentOpInfo = codeSnippetsMap[activeOp];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg bg-[#0D1626] border border-[#1E3A5F]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded bg-[#15243D] text-[#3B82F6] border border-[#1E3A5F]">
            <Grid size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono text-white">ARRAY VISUALIZER</h1>
            <p className="text-xs text-[#94A3B8]">Fixed-Capacity Sequential Storage &amp; Zero-Based Indexing</p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-[#94A3B8]">Occupied:</span>
          <span className="font-bold text-[#EAF2FF] bg-[#0B1018] px-2.5 py-1 rounded border border-[#1E3A5F]">
            {array.length} / {arrayCapacity}
          </span>
        </div>
      </div>

      {/* Capacity Confirmation Alert */}
      {confirmCapChange !== null && (
        <div className="p-4 rounded-lg bg-[#1A1118] border border-[#EF4444]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-[#EF4444]">
            <ShieldAlert size={18} />
            <span>
              Reducing capacity to {confirmCapChange} will discard {array.length - confirmCapChange} elements. Confirm?
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={confirmCapacityChange}
              className="px-3 py-1.5 rounded bg-[#EF4444] text-white font-bold"
            >
              Confirm Resize
            </button>
            <button
              onClick={() => setConfirmCapChange(null)}
              className="px-3 py-1.5 rounded bg-[#15243D] text-[#94A3B8]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Controls & Visualizer */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Controls Deck (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          {/* Capacity Settings */}
          <div className="terminal-panel p-4 space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] font-semibold block">
              Set Array Capacity
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max="20"
                value={capacityInput}
                onChange={(e) => setCapacityInput(e.target.value)}
                placeholder="Capacity (1-20)"
                className="flex-1 bg-[#05070B] border border-[#1E3A5F] px-3 py-2 rounded font-mono text-sm text-[#EAF2FF] focus:outline-none focus:border-[#2563EB]"
              />
              <button
                onClick={handleSetCapacity}
                className="px-4 py-2 rounded font-mono text-xs font-semibold uppercase bg-[#15243D] text-[#EAF2FF] hover:bg-[#2563EB] border border-[#1E3A5F] transition-colors"
              >
                Initialize
              </button>
            </div>
            <p className="text-[11px] font-mono text-[#94A3B8]">
              Fixed index positions [0 to {Math.max(0, arrayCapacity - 1)}] are reserved.
            </p>
          </div>

          {/* Sequential Insertion & Clear */}
          <div className="terminal-panel p-4 space-y-4">
            <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] font-semibold block">
              Insert Next Element
            </label>

            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={valInput}
                  onChange={(e) => setValInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter integer value..."
                  className="flex-1 bg-[#05070B] border border-[#1E3A5F] px-3 py-2 rounded font-mono text-sm text-[#EAF2FF] focus:outline-none focus:border-[#2563EB]"
                />
                <button
                  onClick={handleInsert}
                  disabled={isFull}
                  className={`px-4 py-2 rounded font-mono text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                    isFull
                      ? 'bg-[#0B1018] text-[#94A3B8] cursor-not-allowed border border-[#1E3A5F]'
                      : 'bg-[#2563EB] hover:bg-[#3B82F6] text-white shadow-md'
                  }`}
                >
                  <Plus size={14} /> Insert
                </button>
              </div>
              <p className="text-[11px] font-mono text-[#94A3B8]">
                {isFull ? (
                  <span className="text-[#EF4444] font-semibold">Array is full. Clear the array or initialize a larger capacity.</span>
                ) : (
                  <span>Inserts into next available position: <strong>[index {array.length}]</strong></span>
                )}
              </p>
            </div>

            <div className="pt-2 border-t border-[#1E3A5F]">
              <button
                onClick={handleClear}
                disabled={isEmpty}
                className="w-full py-2 px-3 rounded font-mono text-xs text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#15243D] border border-[#1E3A5F] disabled:opacity-40 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 size={13} /> Clear Array
              </button>
            </div>
          </div>

          {/* Status Message */}
          <div className="p-3.5 rounded-lg bg-[#0B1018] border border-[#1E3A5F] flex items-center gap-3">
            {isFull ? (
              <ShieldAlert className="text-[#EF4444] shrink-0" size={18} />
            ) : isEmpty ? (
              <AlertTriangle className="text-[#94A3B8] shrink-0" size={18} />
            ) : (
              <CheckCircle2 className="text-[#22C55E] shrink-0" size={18} />
            )}
            <div className="font-mono text-xs text-[#EAF2FF] truncate flex-1">
              {statusMsg}
            </div>
          </div>
        </div>

        {/* Visualizer Column (7 cols) - Fixed Array Cells */}
        <div className="md:col-span-7">
          <div className="terminal-panel p-6 rounded-lg flex flex-col justify-between min-h-[360px] bg-[#0B1018]">
            <div className="w-full flex justify-between items-center text-xs font-mono text-[#94A3B8] border-b border-[#1E3A5F] pb-2 mb-4">
              <span>Array Memory Cells</span>
              <span>Capacity: {arrayCapacity} | Occupied: {array.length}</span>
            </div>

            {/* Row of Fixed-Capacity Cells */}
            <div className="flex-1 flex flex-col justify-center my-auto">
              <div className="overflow-x-auto p-4 border-2 border-dashed border-[#1E3A5F] rounded-lg bg-[#05070B] flex items-center justify-start gap-2.5">
                {Array.from({ length: arrayCapacity }).map((_, index) => {
                  const isOccupied = index < array.length;
                  const elem = isOccupied ? array[index] : null;
                  const isJustInserted = lastInsertedIndex === index;

                  return (
                    <div
                      key={index}
                      className={`relative shrink-0 flex flex-col items-center justify-center w-16 h-22 rounded-md font-mono transition-all duration-200 border ${
                        isJustInserted
                          ? 'bg-[#102A1E] text-[#22C55E] border-2 border-[#22C55E] anim-highlight-green'
                          : isOccupied
                          ? 'bg-[#0D1626] text-[#EAF2FF] border-[#2563EB] shadow-sm'
                          : 'bg-[#05070B] text-[#94A3B8] border-[#1E3A5F] opacity-60'
                      }`}
                    >
                      {/* Fixed Index Header */}
                      <span className="text-[10px] text-[#94A3B8] mb-1">
                        [{index}]
                      </span>

                      {/* Cell Value or Empty Placeholder */}
                      <span className={`text-base font-bold ${isOccupied ? 'text-white' : 'text-[#94A3B8]'}`}>
                        {isOccupied && elem ? elem.value : '_'}
                      </span>

                      {/* Status Tag */}
                      <span className="text-[9px] text-[#94A3B8] mt-1">
                        {isOccupied ? 'occupied' : 'empty'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="w-full flex justify-between items-center text-[10px] font-mono text-[#94A3B8] border-t border-[#1E3A5F] pt-2 mt-4">
              <span>START [Index 0]</span>
              <span>END [Index {arrayCapacity - 1}]</span>
            </div>
          </div>
        </div>
      </div>

      {/* Code in 3 Languages & Complexity Reference */}
      <CodeComplexityPanel
        operationName={`Array ${activeOp === 'insert' ? 'Insert at Next Available Position' : 'Clear'}`}
        timeComplexity={currentOpInfo.time}
        spaceComplexity={currentOpInfo.space}
        complexityNote={currentOpInfo.note}
        codeSnippets={currentOpInfo.snippets}
        fullImplementation={ARRAY_FULL_CODE}
      />
    </div>
  );
};
