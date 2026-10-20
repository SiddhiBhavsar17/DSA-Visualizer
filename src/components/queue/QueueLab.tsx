import React, { useState } from 'react';
import { useDSA } from '../../context/DSAContext';
import {
  Package,
  ArrowRight,
  ArrowLeft,
  Eye,
  Trash2,
  Dices,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';
import { CodeComplexityPanel, CodeSnippets } from '../common/CodeComplexityPanel';
import { QUEUE_FULL_CODE } from '../../data/dsaCodeRepository';

type QueueOperation = 'enqueue' | 'dequeue' | 'peek';

export const QueueLab: React.FC = () => {
  const {
    queue,
    queueMaxSize,
    lastQueueMessage,
    isQueuePeekingFront,
    setQueueSize,
    enqueue,
    dequeue,
    peekFront,
    clearQueue,
    animationsEnabled,
  } = useDSA();

  const [sizeInput, setSizeInput] = useState<string>(queueMaxSize.toString());
  const [valInput, setValInput] = useState<string>('');
  const [activeOp, setActiveOp] = useState<QueueOperation>('enqueue');
  const [statusMsg, setStatusMsg] = useState<string>(lastQueueMessage);

  const handleSetSize = () => {
    const val = parseInt(sizeInput);
    if (isNaN(val) || val < 1) {
      setQueueSize(5);
      setSizeInput('5');
    } else {
      setQueueSize(Math.min(20, Math.max(1, val)));
    }
    setStatusMsg(`Queue capacity set to ${Math.min(20, Math.max(1, val || 5))}`);
  };

  const handleEnqueue = () => {
    setActiveOp('enqueue');
    const numericVal = valInput.trim() !== '' ? parseInt(valInput) : undefined;
    const ok = enqueue(numericVal);
    if (ok) {
      setValInput('');
      setStatusMsg(`Enqueued ${numericVal ?? 'random value'} at the rear.`);
    } else {
      setStatusMsg('Queue Overflow! Queue has reached maximum capacity.');
    }
  };

  const handleRandomEnqueue = () => {
    setActiveOp('enqueue');
    const randVal = Math.floor(Math.random() * 100);
    const ok = enqueue(randVal);
    if (ok) {
      setStatusMsg(`Enqueued random value ${randVal} at the rear.`);
    } else {
      setStatusMsg('Queue Overflow! Queue has reached maximum capacity.');
    }
  };

  const handleDequeue = () => {
    setActiveOp('dequeue');
    const dequeued = dequeue();
    if (dequeued !== null) {
      setStatusMsg(`Dequeued ${dequeued} from the front of the queue.`);
    } else {
      setStatusMsg('Queue Underflow! Cannot dequeue from an empty queue.');
    }
  };

  const handlePeek = () => {
    setActiveOp('peek');
    const front = peekFront();
    if (front !== null) {
      setStatusMsg(`Front element is ${front}.`);
    } else {
      setStatusMsg('Queue is empty. Nothing to peek.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleEnqueue();
    }
  };

  const isFull = queue.length >= queueMaxSize;
  const isEmpty = queue.length === 0;

  // Code snippets for Queue operations in C++, Python, and Java
  const codeSnippetsMap: Record<QueueOperation, { snippets: CodeSnippets; time: string; space: string; note: string }> = {
    enqueue: {
      time: 'O(1)',
      space: 'O(1) auxiliary',
      note: 'Constant time insertion directly at the rear pointer index.',
      snippets: {
        cpp: `void enqueue(int value) {
    if (rear >= capacity - 1) {
        cout << "Queue Overflow!\\n";
        return;
    }
    if (front == -1) front = 0;
    rear++;
    queue[rear] = value;
}`,
        python: `def enqueue(self, value):
    if len(self.queue) >= self.capacity:
        raise OverflowError("Queue Overflow!")
    self.queue.append(value)`,
        java: `public void enqueue(int value) {
    if (rear >= capacity - 1) {
        System.out.println("Queue Overflow!");
        return;
    }
    if (front == -1) front = 0;
    queue[++rear] = value;
}`,
      },
    },
    dequeue: {
      time: 'O(1)',
      space: 'O(1) auxiliary',
      note: 'Constant time removal from the front pointer position.',
      snippets: {
        cpp: `int dequeue() {
    if (front == -1 || front > rear) {
        cout << "Queue Underflow!\\n";
        return -1;
    }
    int removed = queue[front];
    front++;
    return removed;
}`,
        python: `def dequeue(self):
    if not self.queue:
        raise IndexError("Queue Underflow!")
    return self.queue.pop(0)`,
        java: `public int dequeue() {
    if (front == -1 || front > rear) {
        System.out.println("Queue Underflow!");
        return -1;
    }
    return queue[front++];
}`,
      },
    },
    peek: {
      time: 'O(1)',
      space: 'O(1) auxiliary',
      note: 'Direct index access to inspect the front element without removal.',
      snippets: {
        cpp: `int peek() {
    if (front == -1 || front > rear) {
        cout << "Queue is empty!\\n";
        return -1;
    }
    return queue[front];
}`,
        python: `def peek(self):
    if not self.queue:
        raise IndexError("Queue is empty!")
    return self.queue[0]`,
        java: `public int peek() {
    if (front == -1 || front > rear) {
        System.out.println("Queue is empty!");
        return -1;
    }
    return queue[front];
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
            <Package size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono text-white">QUEUE VISUALIZER</h1>
            <p className="text-xs text-[#94A3B8]">First In, First Out (FIFO) Data Structure</p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-[#94A3B8]">Occupied:</span>
          <span className="font-bold text-[#EAF2FF] bg-[#0B1018] px-2.5 py-1 rounded border border-[#1E3A5F]">
            {queue.length} / {queueMaxSize}
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
              Queue Capacity
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
              Queue Controls
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
                onClick={handleRandomEnqueue}
                title="Random value"
                className="px-3 py-2 rounded bg-[#15243D] text-[#94A3B8] hover:text-white border border-[#1E3A5F] transition-colors"
              >
                <Dices size={16} />
              </button>
            </div>

            {/* Core Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleEnqueue}
                disabled={isFull}
                className={`py-2 px-3 rounded font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-1 ${
                  isFull
                    ? 'bg-[#0B1018] text-[#94A3B8] cursor-not-allowed border border-[#1E3A5F]'
                    : 'bg-[#2563EB] hover:bg-[#3B82F6] text-white shadow-md'
                }`}
              >
                <ArrowRight size={14} /> Enqueue
              </button>

              <button
                onClick={handleDequeue}
                disabled={isEmpty}
                className={`py-2 px-3 rounded font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-1 ${
                  isEmpty
                    ? 'bg-[#0B1018] text-[#94A3B8] cursor-not-allowed border border-[#1E3A5F]'
                    : 'bg-[#15243D] hover:bg-[#1E3A5F] text-[#EAF2FF] border border-[#1E3A5F]'
                }`}
              >
                <ArrowLeft size={14} /> Dequeue
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
                onClick={clearQueue}
                disabled={isEmpty}
                className="w-full py-2 px-3 rounded font-mono text-xs text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#15243D] border border-[#1E3A5F] disabled:opacity-40 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 size={13} /> Clear Queue
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
          <div className="terminal-panel p-6 rounded-lg flex flex-col justify-between min-h-[360px] relative overflow-hidden bg-[#0B1018]">
            <div className="w-full flex justify-between items-center text-xs font-mono text-[#94A3B8] border-b border-[#1E3A5F] pb-2 mb-4">
              <span>Queue Rail</span>
              <span>Capacity: {queueMaxSize}</span>
            </div>

            {/* Direction markers */}
            <div className="flex items-center justify-between text-[11px] font-mono text-[#94A3B8] mb-2 px-2">
              <span className="text-[#3B82F6] font-semibold">◀ DEQUEUE (FRONT)</span>
              <span className="text-[#3B82F6] font-semibold">ENQUEUE (REAR) ◀</span>
            </div>

            {isEmpty && (
              <div className="flex-1 flex flex-col items-center justify-center text-[#94A3B8] py-16">
                <Package size={40} className="opacity-20 mb-2" />
                <span className="font-mono text-xs uppercase">Queue is Empty</span>
              </div>
            )}

            {!isEmpty && (
              <div className="flex-1 flex items-center overflow-x-auto p-4 my-auto border-2 border-dashed border-[#1E3A5F] rounded-lg bg-[#05070B] gap-2.5 min-h-[140px]">
                {queue.map((elem, index) => {
                  const isFront = index === 0;
                  const isRear = index === queue.length - 1;
                  const peeking = isFront && isQueuePeekingFront;

                  return (
                    <div
                      key={elem.id}
                      className={`relative shrink-0 flex flex-col items-center justify-center w-18 h-20 rounded font-mono font-bold transition-all ${
                        animationsEnabled ? 'anim-enqueue' : ''
                      } ${
                        peeking
                          ? 'bg-[#102A1E] text-[#22C55E] border-2 border-[#22C55E] anim-highlight-green'
                          : isFront || isRear
                          ? 'bg-[#2563EB] text-white border border-[#3B82F6]'
                          : 'bg-[#0D1626] text-[#EAF2FF] border border-[#1E3A5F]'
                      }`}
                    >
                      {isFront && (
                        <span className="absolute -top-5 text-[9px] font-bold text-[#EAF2FF] bg-[#15243D] px-1.5 rounded border border-[#1E3A5F]">
                          FRONT
                        </span>
                      )}

                      {isRear && (
                        <span className="absolute -bottom-5 text-[9px] font-bold text-[#EAF2FF] bg-[#15243D] px-1.5 rounded border border-[#1E3A5F]">
                          REAR
                        </span>
                      )}

                      <span className="text-[10px] text-[#94A3B8]">[{index}]</span>
                      <span className="text-base font-extrabold my-0.5">{elem.value}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="w-full flex justify-between items-center text-[10px] font-mono text-[#94A3B8] border-t border-[#1E3A5F] pt-2 mt-4">
              <span>FRONT [Index 0]</span>
              <span>REAR [Index {queue.length > 0 ? queue.length - 1 : 0}]</span>
            </div>
          </div>
        </div>
      </div>

      {/* Code in 3 Languages & Complexity Reference */}
      <CodeComplexityPanel
        operationName={`Queue ${activeOp.toUpperCase()}`}
        timeComplexity={currentOpInfo.time}
        spaceComplexity={currentOpInfo.space}
        complexityNote={currentOpInfo.note}
        codeSnippets={currentOpInfo.snippets}
        fullImplementation={QUEUE_FULL_CODE}
      />
    </div>
  );
};
