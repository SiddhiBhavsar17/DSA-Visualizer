import React, { useState } from 'react';
import { useDSA } from '../../context/DSAContext';
import {
  Layers,
  ArrowDown,
  ArrowUp,
  Eye,
  Trash2,
  Dices,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';
import { CodeComplexityPanel, CodeSnippets } from '../common/CodeComplexityPanel';
import { STACK_FULL_CODE } from '../../data/dsaCodeRepository';

type StackOperation = 'push' | 'pop' | 'peek';

export const StackLab: React.FC = () => {
  const {
    stack,
    stackMaxSize,
    lastStackMessage,
    isStackPeeking,
    setStackSize,
    push,
    pop,
    peekStack,
    clearStack,
    animationsEnabled,
  } = useDSA();

  const [sizeInput, setSizeInput] = useState<string>(stackMaxSize.toString());
  const [valInput, setValInput] = useState<string>('');
  const [activeOp, setActiveOp] = useState<StackOperation>('push');
  const [statusMsg, setStatusMsg] = useState<string>(lastStackMessage);

  const handleSetSize = () => {
    const val = parseInt(sizeInput);
    if (isNaN(val) || val < 1) {
      setStackSize(5);
      setSizeInput('5');
    } else {
      setStackSize(Math.min(20, Math.max(1, val)));
    }
    setStatusMsg(`Stack capacity set to ${Math.min(20, Math.max(1, val || 5))}`);
  };

  const handlePush = () => {
    setActiveOp('push');
    const numericVal = valInput.trim() !== '' ? parseInt(valInput) : undefined;
    const ok = push(numericVal);
    if (ok) {
      setValInput('');
      setStatusMsg(`Inserted ${numericVal ?? 'random value'} onto the stack.`);
    } else {
      setStatusMsg('Stack Overflow! Stack has reached its maximum capacity.');
    }
  };

  const handleRandomPush = () => {
    setActiveOp('push');
    const randVal = Math.floor(Math.random() * 100);
    const ok = push(randVal);
    if (ok) {
      setStatusMsg(`Inserted random value ${randVal} onto the stack.`);
    } else {
      setStatusMsg('Stack Overflow! Stack has reached its maximum capacity.');
    }
  };

  const handlePop = () => {
    setActiveOp('pop');
    const popped = pop();
    if (popped !== null) {
      setStatusMsg(`Popped ${popped} from the top of the stack.`);
    } else {
      setStatusMsg('Stack Underflow! Cannot pop from an empty stack.');
    }
  };

  const handlePeek = () => {
    setActiveOp('peek');
    const top = peekStack();
    if (top !== null) {
      setStatusMsg(`Top element is ${top} (at slot ${stack.length - 1}).`);
    } else {
      setStatusMsg('Stack is empty. Nothing to peek.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePush();
    }
  };

  const isFull = stack.length >= stackMaxSize;
  const isEmpty = stack.length === 0;

  // Code snippets for Stack operations in C++, Python, and Java
  const codeSnippetsMap: Record<StackOperation, { snippets: CodeSnippets; time: string; space: string; note: string }> = {
    push: {
      time: 'O(1)',
      space: 'O(1) auxiliary',
      note: 'Constant time insertion directly at the top pointer index.',
      snippets: {
        cpp: `void push(int value) {
    if (top >= capacity - 1) {
        cout << "Stack Overflow!\\n";
        return;
    }
    top++;
    stack[top] = value;
}`,
        python: `def push(self, value):
    if len(self.stack) >= self.capacity:
        raise OverflowError("Stack Overflow!")
    self.stack.append(value)`,
        java: `public void push(int value) {
    if (top >= capacity - 1) {
        System.out.println("Stack Overflow!");
        return;
    }
    stack[++top] = value;
}`,
      },
    },
    pop: {
      time: 'O(1)',
      space: 'O(1) auxiliary',
      note: 'Constant time removal by decrementing the top pointer.',
      snippets: {
        cpp: `int pop() {
    if (top < 0) {
        cout << "Stack Underflow!\\n";
        return -1;
    }
    int removed = stack[top];
    top--;
    return removed;
}`,
        python: `def pop(self):
    if not self.stack:
        raise IndexError("Stack Underflow!")
    return self.stack.pop()`,
        java: `public int pop() {
    if (top < 0) {
        System.out.println("Stack Underflow!");
        return -1;
    }
    return stack[top--];
}`,
      },
    },
    peek: {
      time: 'O(1)',
      space: 'O(1) auxiliary',
      note: 'Direct index access to inspect the top value without removal.',
      snippets: {
        cpp: `int peek() {
    if (top < 0) {
        cout << "Stack is empty!\\n";
        return -1;
    }
    return stack[top];
}`,
        python: `def peek(self):
    if not self.stack:
        raise IndexError("Stack is empty!")
    return self.stack[-1]`,
        java: `public int peek() {
    if (top < 0) {
        System.out.println("Stack is empty!");
        return -1;
    }
    return stack[top];
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
            <Layers size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono text-white">STACK VISUALIZER</h1>
            <p className="text-xs text-[#94A3B8]">Last In, First Out (LIFO) Data Structure</p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-[#94A3B8]">Occupied:</span>
          <span className="font-bold text-[#EAF2FF] bg-[#0B1018] px-2.5 py-1 rounded border border-[#1E3A5F]">
            {stack.length} / {stackMaxSize}
          </span>
        </div>
      </div>

      {/* Main Grid: Controls & Visualizer */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Controls Deck (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          {/* Capacity Settings */}
          <div className="terminal-panel p-4 space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] font-semibold block">
              Stack Capacity
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max="20"
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                className="flex-1 bg-[#05070B] border border-[#1E3A5F] px-3 py-2 rounded font-mono text-sm text-[#EAF2FF] focus:outline-none focus:border-[#2563EB]"
              />
              <button
                onClick={handleSetSize}
                className="px-4 py-2 rounded font-mono text-xs font-semibold uppercase bg-[#15243D] text-[#EAF2FF] hover:bg-[#2563EB] border border-[#1E3A5F] transition-colors"
              >
                Set
              </button>
            </div>
          </div>

          {/* Value Input & Actions */}
          <div className="terminal-panel p-4 space-y-4">
            <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] font-semibold block">
              Stack Controls
            </label>

            <div className="flex gap-2">
              <input
                type="number"
                value={valInput}
                onChange={(e) => setValInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter value..."
                className="flex-1 bg-[#05070B] border border-[#1E3A5F] px-3 py-2 rounded font-mono text-sm text-[#EAF2FF] focus:outline-none focus:border-[#2563EB]"
              />
              <button
                onClick={handleRandomPush}
                title="Random value"
                className="px-3 py-2 rounded bg-[#15243D] text-[#94A3B8] hover:text-white border border-[#1E3A5F] transition-colors"
              >
                <Dices size={16} />
              </button>
            </div>

            {/* Core Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handlePush}
                disabled={isFull}
                className={`py-2 px-3 rounded font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-1 ${
                  isFull
                    ? 'bg-[#0B1018] text-[#94A3B8] cursor-not-allowed border border-[#1E3A5F]'
                    : 'bg-[#2563EB] hover:bg-[#3B82F6] text-white shadow-md'
                }`}
              >
                <ArrowDown size={14} /> Push
              </button>

              <button
                onClick={handlePop}
                disabled={isEmpty}
                className={`py-2 px-3 rounded font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-1 ${
                  isEmpty
                    ? 'bg-[#0B1018] text-[#94A3B8] cursor-not-allowed border border-[#1E3A5F]'
                    : 'bg-[#15243D] hover:bg-[#1E3A5F] text-[#EAF2FF] border border-[#1E3A5F]'
                }`}
              >
                <ArrowUp size={14} /> Pop
              </button>

              <button
                onClick={handlePeek}
                disabled={isEmpty}
                className={`py-2 px-3 rounded font-mono text-xs font-semibold uppercase transition-all flex items-center justify-center gap-1 ${
                  isEmpty
                    ? 'bg-[#0B1018] text-[#94A3B8] cursor-not-allowed border border-[#1E3A5F]'
                    : 'bg-[#15243D] text-[#3B82F6] hover:bg-[#1E3A5F] border border-[#1E3A5F]'
                }`}
              >
                <Eye size={14} /> Peek
              </button>
            </div>

            <div className="pt-2 border-t border-[#1E3A5F]">
              <button
                onClick={clearStack}
                disabled={isEmpty}
                className="w-full py-2 px-3 rounded font-mono text-xs text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#15243D] border border-[#1E3A5F] disabled:opacity-40 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 size={13} /> Clear Stack
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

        {/* Visualizer Column (7 cols) */}
        <div className="md:col-span-7">
          <div className="terminal-panel p-6 rounded-lg flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden bg-[#0B1018]">
            <div className="w-full flex justify-between items-center text-xs font-mono text-[#94A3B8] border-b border-[#1E3A5F] pb-2 mb-4">
              <span>Stack Visualization</span>
              <span>Capacity: {stackMaxSize}</span>
            </div>

            {isEmpty && (
              <div className="flex flex-col items-center justify-center text-[#94A3B8] py-16">
                <Layers size={40} className="opacity-20 mb-2" />
                <span className="font-mono text-xs uppercase">Stack is Empty</span>
              </div>
            )}

            {!isEmpty && (
              <div className="relative w-full max-w-[260px] flex flex-col-reverse justify-start items-center p-3 rounded-lg border-2 border-dashed border-[#1E3A5F] bg-[#05070B]">
                {stack.map((elem, index) => {
                  const isTop = index === stack.length - 1;
                  const peeking = isTop && isStackPeeking;

                  return (
                    <div
                      key={elem.id}
                      className={`relative w-full my-1 p-2.5 rounded font-mono font-bold text-center transition-all ${
                        animationsEnabled ? 'anim-push' : ''
                      } ${
                        peeking
                          ? 'bg-[#102A1E] text-[#22C55E] border-2 border-[#22C55E] anim-highlight-green'
                          : isTop
                          ? 'bg-[#2563EB] text-white border border-[#3B82F6]'
                          : 'bg-[#0D1626] text-[#EAF2FF] border border-[#1E3A5F]'
                      }`}
                    >
                      {isTop && (
                        <div className="absolute -left-18 top-1/2 -translate-y-1/2 flex items-center gap-1 font-mono text-[11px] text-[#3B82F6] font-bold bg-[#0D1626] px-1.5 py-0.5 rounded border border-[#1E3A5F]">
                          <span>TOP</span>
                          <span>➔</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between px-2 text-xs">
                        <span className="text-[10px] text-[#94A3B8]">[{index}]</span>
                        <span className="text-sm font-extrabold">{elem.value}</span>
                        <span className="text-[10px] text-transparent">_</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="w-full flex justify-between items-center text-[10px] font-mono text-[#94A3B8] border-t border-[#1E3A5F] pt-2 mt-4">
              <span>BOTTOM [Index 0]</span>
              <span>TOP [Index {stack.length > 0 ? stack.length - 1 : 0}]</span>
            </div>
          </div>
        </div>
      </div>

      {/* Code in 3 Languages & Complexity Reference */}
      <CodeComplexityPanel
        operationName={`Stack ${activeOp.toUpperCase()}`}
        timeComplexity={currentOpInfo.time}
        spaceComplexity={currentOpInfo.space}
        complexityNote={currentOpInfo.note}
        codeSnippets={currentOpInfo.snippets}
        fullImplementation={STACK_FULL_CODE}
      />
    </div>
  );
};
