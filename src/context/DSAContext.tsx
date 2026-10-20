import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  StackElement,
  QueueElement,
  ArrayElement,
  LinkedListNode,
  OperationLog,
  OperationMetrics,
  LogType,
  StructureType,
} from '../types/dsa';

interface DSAContextType {
  // Stack state
  stack: StackElement[];
  stackMaxSize: number;
  lastStackMessage: string;
  isStackPeeking: boolean;
  setStackSize: (size: number) => void;
  push: (value?: number) => boolean;
  pop: () => number | null;
  peekStack: () => number | null;
  clearStack: () => void;
  displayStack: () => string;

  // Queue state
  queue: QueueElement[];
  queueMaxSize: number;
  lastQueueMessage: string;
  isQueuePeekingFront: boolean;
  isQueuePeekingRear: boolean;
  setQueueSize: (size: number) => void;
  enqueue: (value?: number) => boolean;
  dequeue: () => number | null;
  peekFront: () => number | null;
  peekRear: () => number | null;
  clearQueue: () => void;
  displayQueue: () => string;

  // Array state
  array: ArrayElement[];
  arrayCapacity: number;
  lastArrayMessage: string;
  activeArrayIndex: number | null;
  arraySearchActive: number | null;
  arraySearchFound: number | null;
  setArrayCapacity: (cap: number) => void;
  insertAtArray: (index: number, value: number) => boolean;
  accessArray: (index: number) => number | null;
  updateArray: (index: number, value: number) => boolean;
  deleteFromArray: (index: number) => number | null;
  searchArray: (value: number) => Promise<number | null>;
  clearArray: () => void;
  initArray: (elements: number[]) => void;

  // Linked List state
  linkedList: LinkedListNode[];
  lastLLMessage: string;
  activeLLIndex: number | null;
  llSearchActive: number | null;
  llSearchFound: number | null;
  insertHeadLL: (value: number) => void;
  insertTailLL: (value: number) => void;
  insertAtLL: (index: number, value: number) => boolean;
  deleteHeadLL: () => number | null;
  deleteTailLL: () => number | null;
  deleteAtLL: (index: number) => number | null;
  searchLL: (value: number) => Promise<number | null>;
  traverseLL: () => Promise<number[]>;
  accessLL: (index: number) => number | null;
  clearLL: () => void;
  initLL: (elements: number[]) => void;

  // Logs & Metrics
  logs: OperationLog[];
  metrics: OperationMetrics;
  clearLogs: () => void;
  loadSampleData: (target: 'stack' | 'queue' | 'array' | 'linkedlist' | 'all') => void;
  resetAll: (resetHistory?: boolean) => void;

  // Settings
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const STORAGE_KEY = 'dsa_platform_state_v2';

const initialMetrics: OperationMetrics = {
  totalOperations: 0,
  pushCount: 0,
  popCount: 0,
  peekStackCount: 0,
  enqueueCount: 0,
  dequeueCount: 0,
  peekQueueCount: 0,
  arrayInsertCount: 0,
  arrayDeleteCount: 0,
  arrayAccessCount: 0,
  arrayUpdateCount: 0,
  arraySearchCount: 0,
  llInsertHeadCount: 0,
  llInsertTailCount: 0,
  llInsertIndexCount: 0,
  llDeleteHeadCount: 0,
  llDeleteTailCount: 0,
  llDeleteIndexCount: 0,
  llSearchCount: 0,
  llTraverseCount: 0,
  clearCount: 0,
};

const DSAContext = createContext<DSAContextType | null>(null);

function formatTime(date: Date = new Date()): string {
  return date.toTimeString().split(' ')[0];
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36);
}

export const DSAProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Stack State
  const [stack, setStack] = useState<StackElement[]>(() => [
    { id: 'stk-1', value: 10, timestamp: Date.now() - 3000 },
    { id: 'stk-2', value: 25, timestamp: Date.now() - 2000 },
    { id: 'stk-3', value: 42, timestamp: Date.now() - 1000 },
  ]);
  const [stackMaxSize, setStackMaxSize] = useState<number>(5);
  const [lastStackMessage, setLastStackMessage] = useState<string>('Stack initialized.');
  const [isStackPeeking, setIsStackPeeking] = useState<boolean>(false);

  // Queue State
  const [queue, setQueue] = useState<QueueElement[]>(() => [
    { id: 'que-1', value: 15, timestamp: Date.now() - 3000 },
    { id: 'que-2', value: 30, timestamp: Date.now() - 2000 },
    { id: 'que-3', value: 65, timestamp: Date.now() - 1000 },
  ]);
  const [queueMaxSize, setQueueMaxSize] = useState<number>(5);
  const [lastQueueMessage, setLastQueueMessage] = useState<string>('Queue initialized.');
  const [isQueuePeekingFront, setIsQueuePeekingFront] = useState<boolean>(false);
  const [isQueuePeekingRear, setIsQueuePeekingRear] = useState<boolean>(false);

  // Array State
  const [array, setArray] = useState<ArrayElement[]>(() => [
    { id: 'arr-0', value: 14 },
    { id: 'arr-1', value: 28 },
    { id: 'arr-2', value: 42 },
    { id: 'arr-3', value: 56 },
    { id: 'arr-4', value: 70 },
  ]);
  const [arrayCapacity, setArrayCapacityState] = useState<number>(8);
  const [lastArrayMessage, setLastArrayMessage] = useState<string>('Array initialized with 5 elements.');
  const [activeArrayIndex, setActiveArrayIndex] = useState<number | null>(null);
  const [arraySearchActive, setArraySearchActive] = useState<number | null>(null);
  const [arraySearchFound, setArraySearchFound] = useState<number | null>(null);

  // Linked List State
  const [linkedList, setLinkedList] = useState<LinkedListNode[]>(() => [
    { id: 'll-0', value: 12, isHead: true },
    { id: 'll-1', value: 24 },
    { id: 'll-2', value: 36 },
    { id: 'll-3', value: 48 },
  ]);
  const [lastLLMessage, setLastLLMessage] = useState<string>('Linked List initialized with 4 nodes.');
  const [activeLLIndex, setActiveLLIndex] = useState<number | null>(null);
  const [llSearchActive, setLLSearchActive] = useState<number | null>(null);
  const [llSearchFound, setLLSearchFound] = useState<number | null>(null);

  // Settings
  const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // Logs
  const [logs, setLogs] = useState<OperationLog[]>(() => [
    {
      id: 'log-boot',
      timestamp: formatTime(),
      rawTime: Date.now(),
      type: 'INFO',
      structure: 'SYSTEM',
      operation: 'SYSTEM_BOOT',
      details: 'DSA Computing Workstation online. 4 modules registered: Stack, Queue, Array, Linked List.',
    },
  ]);

  // Metrics
  const [metrics, setMetrics] = useState<OperationMetrics>(() => ({
    ...initialMetrics,
    totalOperations: 4,
    pushCount: 3,
    enqueueCount: 3,
    arrayInsertCount: 5,
    llInsertHeadCount: 4,
  }));

  // Audio tone helper
  const playTone = useCallback((freq: number, type: OscillatorType = 'sine', duration: number = 0.08) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not permitted or failed
    }
  }, [soundEnabled]);

  // Log helper
  const addLog = useCallback(
    (type: LogType, structure: StructureType, operation: string, details: string) => {
      const newEntry: OperationLog = {
        id: generateId(),
        timestamp: formatTime(),
        rawTime: Date.now(),
        type,
        structure,
        operation,
        details,
      };
      setLogs((prev) => [newEntry, ...prev.slice(0, 99)]);
    },
    []
  );

  // Load state from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.stack)) setStack(parsed.stack);
        if (typeof parsed.stackMaxSize === 'number') setStackMaxSize(parsed.stackMaxSize);
        if (Array.isArray(parsed.queue)) setQueue(parsed.queue);
        if (typeof parsed.queueMaxSize === 'number') setQueueMaxSize(parsed.queueMaxSize);
        if (Array.isArray(parsed.array)) setArray(parsed.array);
        if (typeof parsed.arrayCapacity === 'number') setArrayCapacityState(parsed.arrayCapacity);
        if (Array.isArray(parsed.linkedList)) setLinkedList(parsed.linkedList);
        if (Array.isArray(parsed.logs)) setLogs(parsed.logs);
        if (parsed.metrics) setMetrics(parsed.metrics);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          stack,
          stackMaxSize,
          queue,
          queueMaxSize,
          array,
          arrayCapacity,
          linkedList,
          logs: logs.slice(0, 100),
          metrics,
        })
      );
    } catch {
      // ignore
    }
  }, [stack, stackMaxSize, queue, queueMaxSize, array, arrayCapacity, linkedList, logs, metrics]);

  // ==================== STACK OPERATIONS ====================
  const setStackSize = useCallback((size: number) => {
    const validSize = Math.max(1, Math.min(20, isNaN(size) ? 5 : size));
    setStackMaxSize(validSize);
    setStack([]);
    const msg = `Stack size set to ${validSize}`;
    setLastStackMessage(msg);
    addLog('INFO', 'STACK', 'SET_SIZE', `Capacity adjusted to ${validSize}. Buffer cleared.`);
    setMetrics((m) => ({ ...m, totalOperations: m.totalOperations + 1 }));
    playTone(440, 'triangle');
  }, [addLog, playTone]);

  const push = useCallback((value?: number): boolean => {
    if (stack.length >= stackMaxSize) {
      const msg = '⚠️ Stack Overflow!';
      setLastStackMessage(msg);
      addLog('ERROR', 'STACK', 'OVERFLOW', `Push rejected: capacity limit (${stackMaxSize}) reached.`);
      setMetrics((m) => ({ ...m, totalOperations: m.totalOperations + 1 }));
      playTone(220, 'sawtooth', 0.15);
      return false;
    }

    const val = typeof value === 'number' && !isNaN(value) ? value : Math.floor(Math.random() * 100);
    const newElem: StackElement = {
      id: generateId(),
      value: val,
      timestamp: Date.now(),
      isNew: true,
    };

    setStack((prev) => [...prev, newElem]);
    const msg = `✅ Inserted ${val}`;
    setLastStackMessage(msg);
    addLog('SUCCESS', 'STACK', 'PUSH', `Value ${val} pushed to TOP (slot ${stack.length}). New depth: ${stack.length + 1}/${stackMaxSize}.`);
    setMetrics((m) => ({
      ...m,
      totalOperations: m.totalOperations + 1,
      pushCount: m.pushCount + 1,
    }));
    playTone(587.33, 'sine', 0.1);
    return true;
  }, [stack.length, stackMaxSize, addLog, playTone]);

  const pop = useCallback((): number | null => {
    if (stack.length === 0) {
      const msg = '⚠️ Stack Underflow!';
      setLastStackMessage(msg);
      addLog('WARNING', 'STACK', 'UNDERFLOW', 'Pop aborted: Stack is completely empty.');
      setMetrics((m) => ({ ...m, totalOperations: m.totalOperations + 1 }));
      playTone(220, 'sawtooth', 0.15);
      return null;
    }

    const popped = stack[stack.length - 1];
    setStack((prev) => prev.slice(0, -1));
    const msg = `🗑️ Removed ${popped.value}`;
    setLastStackMessage(msg);
    addLog('SUCCESS', 'STACK', 'POP', `Value ${popped.value} popped from TOP. Remaining depth: ${stack.length - 1}.`);
    setMetrics((m) => ({
      ...m,
      totalOperations: m.totalOperations + 1,
      popCount: m.popCount + 1,
    }));
    playTone(493.88, 'sine', 0.1);
    return popped.value;
  }, [stack, addLog, playTone]);

  const peekStack = useCallback((): number | null => {
    if (stack.length === 0) {
      const msg = '⚠️ Stack is Empty!';
      setLastStackMessage(msg);
      addLog('WARNING', 'STACK', 'PEEK', 'Peek failed: Stack is empty.');
      setMetrics((m) => ({ ...m, totalOperations: m.totalOperations + 1 }));
      return null;
    }

    const topElem = stack[stack.length - 1];
    setIsStackPeeking(true);
    setTimeout(() => setIsStackPeeking(false), 1200);

    const msg = `👁️ TOP Element: ${topElem.value} (slot ${stack.length - 1})`;
    setLastStackMessage(msg);
    addLog('INFO', 'STACK', 'PEEK', `Inspected TOP element: ${topElem.value} at slot [${stack.length - 1}].`);
    setMetrics((m) => ({
      ...m,
      totalOperations: m.totalOperations + 1,
      peekStackCount: m.peekStackCount + 1,
    }));
    playTone(659.25, 'sine', 0.12);
    return topElem.value;
  }, [stack, addLog, playTone]);

  const clearStack = useCallback(() => {
    const prevCount = stack.length;
    setStack([]);
    const msg = '🧹 Stack cleared.';
    setLastStackMessage(msg);
    addLog('INFO', 'STACK', 'CLEAR', `Cleared ${prevCount} elements from stack.`);
    setMetrics((m) => ({
      ...m,
      totalOperations: m.totalOperations + 1,
      clearCount: m.clearCount + 1,
    }));
    playTone(330, 'triangle', 0.12);
  }, [stack.length, addLog, playTone]);

  const displayStack = useCallback((): string => {
    if (stack.length === 0) {
      const msg = '⚠️ Stack is Empty!';
      setLastStackMessage(msg);
      return msg;
    }
    const elementsStr = stack.map((e) => e.value).join(', ');
    const msg = `📦 Stack: ${elementsStr}`;
    setLastStackMessage(msg);
    addLog('INFO', 'STACK', 'DISPLAY', `Stack contents: [${elementsStr}].`);
    setMetrics((m) => ({ ...m, totalOperations: m.totalOperations + 1 }));
    return msg;
  }, [stack, addLog]);

  // ==================== QUEUE OPERATIONS ====================
  const setQueueSize = useCallback((size: number) => {
    const validSize = Math.max(1, Math.min(20, isNaN(size) ? 5 : size));
    setQueueMaxSize(validSize);
    setQueue([]);
    const msg = `Queue size set to ${validSize}`;
    setLastQueueMessage(msg);
    addLog('INFO', 'QUEUE', 'SET_SIZE', `Capacity adjusted to ${validSize}. Queue cleared.`);
    setMetrics((m) => ({ ...m, totalOperations: m.totalOperations + 1 }));
    playTone(440, 'triangle');
  }, [addLog, playTone]);

  const enqueue = useCallback((value?: number): boolean => {
    if (queue.length >= queueMaxSize) {
      const msg = '⚠️ Queue Overflow!';
      setLastQueueMessage(msg);
      addLog('ERROR', 'QUEUE', 'OVERFLOW', `Enqueue rejected: capacity limit (${queueMaxSize}) reached.`);
      setMetrics((m) => ({ ...m, totalOperations: m.totalOperations + 1 }));
      playTone(220, 'sawtooth', 0.15);
      return false;
    }

    const val = typeof value === 'number' && !isNaN(value) ? value : Math.floor(Math.random() * 100);
    const newElem: QueueElement = {
      id: generateId(),
      value: val,
      timestamp: Date.now(),
      isNew: true,
    };

    setQueue((prev) => [...prev, newElem]);
    const msg = `✅ Enqueued ${val}`;
    setLastQueueMessage(msg);
    addLog('SUCCESS', 'QUEUE', 'ENQUEUE', `Value ${val} enqueued at REAR (slot ${queue.length}). New depth: ${queue.length + 1}/${queueMaxSize}.`);
    setMetrics((m) => ({
      ...m,
      totalOperations: m.totalOperations + 1,
      enqueueCount: m.enqueueCount + 1,
    }));
    playTone(523.25, 'sine', 0.1);
    return true;
  }, [queue.length, queueMaxSize, addLog, playTone]);

  const dequeue = useCallback((): number | null => {
    if (queue.length === 0) {
      const msg = '⚠️ Queue Underflow!';
      setLastQueueMessage(msg);
      addLog('WARNING', 'QUEUE', 'UNDERFLOW', 'Dequeue aborted: Queue is empty.');
      setMetrics((m) => ({ ...m, totalOperations: m.totalOperations + 1 }));
      playTone(220, 'sawtooth', 0.15);
      return null;
    }

    const removed = queue[0];
    setQueue((prev) => prev.slice(1));
    const msg = `🗑️ Dequeued ${removed.value}`;
    setLastQueueMessage(msg);
    addLog('SUCCESS', 'QUEUE', 'DEQUEUE', `Value ${removed.value} dequeued from FRONT. Remaining size: ${queue.length - 1}.`);
    setMetrics((m) => ({
      ...m,
      totalOperations: m.totalOperations + 1,
      dequeueCount: m.dequeueCount + 1,
    }));
    playTone(392, 'sine', 0.1);
    return removed.value;
  }, [queue, addLog, playTone]);

  const peekFront = useCallback((): number | null => {
    if (queue.length === 0) {
      const msg = '⚠️ Queue is Empty!';
      setLastQueueMessage(msg);
      addLog('WARNING', 'QUEUE', 'PEEK_FRONT', 'Inspection aborted: Queue is empty.');
      setMetrics((m) => ({ ...m, totalOperations: m.totalOperations + 1 }));
      return null;
    }

    const frontElem = queue[0];
    setIsQueuePeekingFront(true);
    setTimeout(() => setIsQueuePeekingFront(false), 1200);

    const msg = `👁️ FRONT Element: ${frontElem.value}`;
    setLastQueueMessage(msg);
    addLog('INFO', 'QUEUE', 'PEEK_FRONT', `FRONT element inspected: ${frontElem.value}.`);
    setMetrics((m) => ({
      ...m,
      totalOperations: m.totalOperations + 1,
      peekQueueCount: m.peekQueueCount + 1,
    }));
    playTone(659.25, 'sine', 0.12);
    return frontElem.value;
  }, [queue, addLog, playTone]);

  const peekRear = useCallback((): number | null => {
    if (queue.length === 0) {
      const msg = '⚠️ Queue is Empty!';
      setLastQueueMessage(msg);
      addLog('WARNING', 'QUEUE', 'PEEK_REAR', 'Inspection aborted: Queue is empty.');
      setMetrics((m) => ({ ...m, totalOperations: m.totalOperations + 1 }));
      return null;
    }

    const rearElem = queue[queue.length - 1];
    setIsQueuePeekingRear(true);
    setTimeout(() => setIsQueuePeekingRear(false), 1200);

    const msg = `👁️ REAR Element: ${rearElem.value}`;
    setLastQueueMessage(msg);
    addLog('INFO', 'QUEUE', 'PEEK_REAR', `REAR element inspected: ${rearElem.value}.`);
    setMetrics((m) => ({
      ...m,
      totalOperations: m.totalOperations + 1,
      peekQueueCount: m.peekQueueCount + 1,
    }));
    playTone(698.46, 'sine', 0.12);
    return rearElem.value;
  }, [queue, addLog, playTone]);

  const clearQueue = useCallback(() => {
    const prevCount = queue.length;
    setQueue([]);
    const msg = '🧹 Queue cleared.';
    setLastQueueMessage(msg);
    addLog('INFO', 'QUEUE', 'CLEAR', `Cleared ${prevCount} elements from queue.`);
    setMetrics((m) => ({
      ...m,
      totalOperations: m.totalOperations + 1,
      clearCount: m.clearCount + 1,
    }));
    playTone(330, 'triangle', 0.12);
  }, [queue.length, addLog, playTone]);

  const displayQueue = useCallback((): string => {
    if (queue.length === 0) {
      const msg = '⚠️ Queue is Empty!';
      setLastQueueMessage(msg);
      return msg;
    }
    const elementsStr = queue.map((e) => e.value).join(', ');
    const msg = `📦 Queue: ${elementsStr}`;
    setLastQueueMessage(msg);
    addLog('INFO', 'QUEUE', 'DISPLAY', `Queue contents: [${elementsStr}].`);
    setMetrics((m) => ({ ...m, totalOperations: m.totalOperations + 1 }));
    return msg;
  }, [queue, addLog]);

  // ==================== ARRAY OPERATIONS ====================
  const setArrayCapacity = useCallback((cap: number) => {
    const validCap = Math.max(1, Math.min(20, isNaN(cap) ? 8 : cap));
    setArrayCapacityState(validCap);
    if (array.length > validCap) {
      setArray((prev) => prev.slice(0, validCap));
    }
    const msg = `Array capacity set to ${validCap}`;
    setLastArrayMessage(msg);
    addLog('INFO', 'ARRAY', 'SET_CAPACITY', `Array capacity configured to ${validCap}.`);
    setMetrics((m) => ({ ...m, totalOperations: m.totalOperations + 1 }));
  }, [array.length, addLog]);

  const insertAtArray = useCallback((index: number, value: number): boolean => {
    if (array.length >= arrayCapacity) {
      const msg = `⚠️ Array Overflow! Capacity is ${arrayCapacity}.`;
      setLastArrayMessage(msg);
      addLog('ERROR', 'ARRAY', 'OVERFLOW', `Insertion rejected: Array reached maximum capacity (${arrayCapacity}).`);
      setMetrics((m) => ({ ...m, totalOperations: m.totalOperations + 1 }));
      playTone(220, 'sawtooth', 0.15);
      return false;
    }

    if (index < 0 || index > array.length) {
      const msg = `⚠️ Index ${index} out of bounds! Valid range: [0, ${array.length}].`;
      setLastArrayMessage(msg);
      addLog('ERROR', 'ARRAY', 'OUT_OF_BOUNDS', `Insert index ${index} is invalid for length ${array.length}.`);
      setMetrics((m) => ({ ...m, totalOperations: m.totalOperations + 1 }));
      playTone(220, 'sawtooth', 0.15);
      return false;
    }

    const newElem: ArrayElement = { id: generateId(), value, isHighlighted: true };
    const nextArr = [...array];
    nextArr.splice(index, 0, newElem);
    setArray(nextArr);
    setActiveArrayIndex(index);

    const msg = `✅ Inserted ${value} at index [${index}]. Elements shifted right.`;
    setLastArrayMessage(msg);
    addLog('SUCCESS', 'ARRAY', 'INSERT', `Inserted value ${value} at index [${index}]. Shift cost: ${array.length - index} elements.`);
    setMetrics((m) => ({
      ...m,
      totalOperations: m.totalOperations + 1,
      arrayInsertCount: m.arrayInsertCount + 1,
    }));
    playTone(523.25, 'sine', 0.1);
    setTimeout(() => setActiveArrayIndex(null), 1500);
    return true;
  }, [array, arrayCapacity, addLog, playTone]);

  const accessArray = useCallback((index: number): number | null => {
    if (index < 0 || index >= array.length) {
      const msg = `⚠️ Index ${index} out of bounds! Valid range: [0, ${Math.max(0, array.length - 1)}].`;
      setLastArrayMessage(msg);
      addLog('ERROR', 'ARRAY', 'ACCESS_OOB', `Index ${index} is invalid for access.`);
      setMetrics((m) => ({ ...m, totalOperations: m.totalOperations + 1 }));
      playTone(220, 'sawtooth', 0.15);
      return null;
    }

    const val = array[index].value;
    setActiveArrayIndex(index);
    const msg = `👁️ Accessed index [${index}] ➔ Value: ${val} (O(1) Direct Lookup)`;
    setLastArrayMessage(msg);
    addLog('SUCCESS', 'ARRAY', 'ACCESS', `Retrieved value ${val} at index [${index}] in O(1) time.`);
    setMetrics((m) => ({
      ...m,
      totalOperations: m.totalOperations + 1,
      arrayAccessCount: m.arrayAccessCount + 1,
    }));
    playTone(659.25, 'sine', 0.12);
    setTimeout(() => setActiveArrayIndex(null), 1500);
    return val;
  }, [array, addLog, playTone]);

  const updateArray = useCallback((index: number, value: number): boolean => {
    if (index < 0 || index >= array.length) {
      const msg = `⚠️ Index ${index} out of bounds! Cannot update non-existent element.`;
      setLastArrayMessage(msg);
      addLog('ERROR', 'ARRAY', 'UPDATE_OOB', `Update index ${index} out of bounds.`);
      setMetrics((m) => ({ ...m, totalOperations: m.totalOperations + 1 }));
      playTone(220, 'sawtooth', 0.15);
      return false;
    }

    const prevVal = array[index].value;
    const nextArr = [...array];
    nextArr[index] = { ...nextArr[index], value, isHighlighted: true };
    setArray(nextArr);
    setActiveArrayIndex(index);

    const msg = `✅ Updated index [${index}]: ${prevVal} ➔ ${value}`;
    setLastArrayMessage(msg);
    addLog('SUCCESS', 'ARRAY', 'UPDATE', `Overwrote element at [${index}] with value ${value} in O(1) time.`);
    setMetrics((m) => ({
      ...m,
      totalOperations: m.totalOperations + 1,
      arrayUpdateCount: m.arrayUpdateCount + 1,
    }));
    playTone(587.33, 'sine', 0.1);
    setTimeout(() => setActiveArrayIndex(null), 1500);
    return true;
  }, [array, addLog, playTone]);

  const deleteFromArray = useCallback((index: number): number | null => {
    if (array.length === 0) {
      const msg = '⚠️ Array is empty! Nothing to delete.';
      setLastArrayMessage(msg);
      addLog('WARNING', 'ARRAY', 'UNDERFLOW', 'Delete aborted: Array is empty.');
      setMetrics((m) => ({ ...m, totalOperations: m.totalOperations + 1 }));
      playTone(220, 'sawtooth', 0.15);
      return null;
    }

    if (index < 0 || index >= array.length) {
      const msg = `⚠️ Index ${index} out of bounds! Valid range: [0, ${array.length - 1}].`;
      setLastArrayMessage(msg);
      addLog('ERROR', 'ARRAY', 'DELETE_OOB', `Delete index ${index} out of bounds.`);
      setMetrics((m) => ({ ...m, totalOperations: m.totalOperations + 1 }));
      playTone(220, 'sawtooth', 0.15);
      return null;
    }

    const removedVal = array[index].value;
    const nextArr = [...array];
    nextArr.splice(index, 1);
    setArray(nextArr);

    const msg = `🗑️ Deleted element ${removedVal} from index [${index}]. Elements shifted left.`;
    setLastArrayMessage(msg);
    addLog('SUCCESS', 'ARRAY', 'DELETE', `Removed value ${removedVal} at [${index}]. Left shift cost: ${array.length - 1 - index}.`);
    setMetrics((m) => ({
      ...m,
      totalOperations: m.totalOperations + 1,
      arrayDeleteCount: m.arrayDeleteCount + 1,
    }));
    playTone(493.88, 'sine', 0.1);
    return removedVal;
  }, [array, addLog, playTone]);

  const searchArray = useCallback(async (targetVal: number): Promise<number | null> => {
    if (array.length === 0) {
      const msg = '⚠️ Array is empty! Cannot search.';
      setLastArrayMessage(msg);
      addLog('WARNING', 'ARRAY', 'SEARCH_EMPTY', 'Linear search aborted: Array is empty.');
      setMetrics((m) => ({ ...m, totalOperations: m.totalOperations + 1 }));
      return null;
    }

    setLastArrayMessage(`🔍 Linear searching for value ${targetVal}...`);

    for (let i = 0; i < array.length; i++) {
      setArraySearchActive(i);
      playTone(440 + i * 20, 'sine', 0.05);
      // Brief pause for visual step-by-step scan
      await new Promise((res) => setTimeout(res, 220));

      if (array[i].value === targetVal) {
        setArraySearchActive(null);
        setArraySearchFound(i);
        const msg = `✅ Target ${targetVal} FOUND at index [${i}] in ${i + 1} comparison(s)!`;
        setLastArrayMessage(msg);
        addLog('SUCCESS', 'ARRAY', 'SEARCH_FOUND', `Linear search found target ${targetVal} at index [${i}] after ${i + 1} step(s).`);
        setMetrics((m) => ({
          ...m,
          totalOperations: m.totalOperations + 1,
          arraySearchCount: m.arraySearchCount + 1,
        }));
        playTone(784, 'sine', 0.18);
        setTimeout(() => setArraySearchFound(null), 2500);
        return i;
      }
    }

    setArraySearchActive(null);
    const msg = `❌ Target ${targetVal} NOT FOUND in array after ${array.length} comparisons.`;
    setLastArrayMessage(msg);
    addLog('INFO', 'ARRAY', 'SEARCH_NOT_FOUND', `Target ${targetVal} not present in array after ${array.length} steps.`);
    setMetrics((m) => ({
      ...m,
      totalOperations: m.totalOperations + 1,
      arraySearchCount: m.arraySearchCount + 1,
    }));
    playTone(260, 'triangle', 0.15);
    return -1;
  }, [array, addLog, playTone]);

  const clearArray = useCallback(() => {
    const count = array.length;
    setArray([]);
    const msg = '🧹 Array cleared.';
    setLastArrayMessage(msg);
    addLog('INFO', 'ARRAY', 'CLEAR', `Cleared ${count} elements from array.`);
    setMetrics((m) => ({
      ...m,
      totalOperations: m.totalOperations + 1,
      clearCount: m.clearCount + 1,
    }));
    playTone(330, 'triangle', 0.12);
  }, [array.length, addLog, playTone]);

  const initArray = useCallback((elements: number[]) => {
    const valid = elements.slice(0, arrayCapacity).map((val) => ({ id: generateId(), value: val }));
    setArray(valid);
    const msg = `Initialized array with ${valid.length} elements.`;
    setLastArrayMessage(msg);
    addLog('INFO', 'ARRAY', 'INIT', `Initialized array buffer with ${valid.length} items.`);
    setMetrics((m) => ({ ...m, totalOperations: m.totalOperations + 1 }));
    playTone(523.25, 'sine', 0.1);
  }, [arrayCapacity, addLog, playTone]);

  // ==================== LINKED LIST OPERATIONS ====================
  const insertHeadLL = useCallback((value: number) => {
    if (linkedList.length >= 15) {
      setLastLLMessage('⚠️ List size limit reached (15 nodes maximum for visualizer).');
      return;
    }
    const newNode: LinkedListNode = { id: generateId(), value, isHead: true, isCurrent: true };
    const nextList = [newNode, ...linkedList.map((n) => ({ ...n, isHead: false }))];
    setLinkedList(nextList);
    setActiveLLIndex(0);

    const msg = `✅ Inserted ${value} at HEAD in O(1) time.`;
    setLastLLMessage(msg);
    addLog('SUCCESS', 'LINKED_LIST', 'INSERT_HEAD', `Inserted node ${value} at HEAD (O(1)).`);
    setMetrics((m) => ({
      ...m,
      totalOperations: m.totalOperations + 1,
      llInsertHeadCount: m.llInsertHeadCount + 1,
    }));
    playTone(587.33, 'sine', 0.1);
    setTimeout(() => setActiveLLIndex(null), 1200);
  }, [linkedList, addLog, playTone]);

  const insertTailLL = useCallback((value: number) => {
    if (linkedList.length >= 15) {
      setLastLLMessage('⚠️ List size limit reached (15 nodes maximum for visualizer).');
      return;
    }
    const newNode: LinkedListNode = { id: generateId(), value, isCurrent: true };
    const nextList = [...linkedList, newNode];
    if (nextList.length === 1) nextList[0].isHead = true;
    setLinkedList(nextList);
    setActiveLLIndex(nextList.length - 1);

    const msg = `✅ Inserted ${value} at TAIL (position ${nextList.length - 1}).`;
    setLastLLMessage(msg);
    addLog('SUCCESS', 'LINKED_LIST', 'INSERT_TAIL', `Inserted node ${value} at TAIL. List length is now ${nextList.length}.`);
    setMetrics((m) => ({
      ...m,
      totalOperations: m.totalOperations + 1,
      llInsertTailCount: m.llInsertTailCount + 1,
    }));
    playTone(523.25, 'sine', 0.1);
    setTimeout(() => setActiveLLIndex(null), 1200);
  }, [linkedList, addLog, playTone]);

  const insertAtLL = useCallback((index: number, value: number): boolean => {
    if (linkedList.length >= 15) {
      setLastLLMessage('⚠️ List size limit reached (15 nodes maximum).');
      return false;
    }
    if (index < 0 || index > linkedList.length) {
      const msg = `⚠️ Index ${index} out of bounds! Valid range: [0, ${linkedList.length}].`;
      setLastLLMessage(msg);
      addLog('ERROR', 'LINKED_LIST', 'INSERT_OOB', `Index ${index} is invalid for list length ${linkedList.length}.`);
      setMetrics((m) => ({ ...m, totalOperations: m.totalOperations + 1 }));
      playTone(220, 'sawtooth', 0.15);
      return false;
    }

    if (index === 0) {
      insertHeadLL(value);
      return true;
    }
    if (index === linkedList.length) {
      insertTailLL(value);
      return true;
    }

    const newNode: LinkedListNode = { id: generateId(), value, isCurrent: true };
    const nextList = [...linkedList];
    nextList.splice(index, 0, newNode);
    setLinkedList(nextList);
    setActiveLLIndex(index);

    const msg = `✅ Inserted ${value} at index [${index}]. Pointer reassignment complete.`;
    setLastLLMessage(msg);
    addLog('SUCCESS', 'LINKED_LIST', 'INSERT_AT', `Inserted node ${value} at index [${index}] by adjusting pointers.`);
    setMetrics((m) => ({
      ...m,
      totalOperations: m.totalOperations + 1,
      llInsertIndexCount: m.llInsertIndexCount + 1,
    }));
    playTone(587.33, 'sine', 0.1);
    setTimeout(() => setActiveLLIndex(null), 1200);
    return true;
  }, [linkedList, insertHeadLL, insertTailLL, addLog, playTone]);

  const deleteHeadLL = useCallback((): number | null => {
    if (linkedList.length === 0) {
      const msg = '⚠️ Linked List is empty! Underflow.';
      setLastLLMessage(msg);
      addLog('WARNING', 'LINKED_LIST', 'UNDERFLOW', 'Delete HEAD aborted: List is empty.');
      setMetrics((m) => ({ ...m, totalOperations: m.totalOperations + 1 }));
      playTone(220, 'sawtooth', 0.15);
      return null;
    }

    const removed = linkedList[0].value;
    const nextList = linkedList.slice(1);
    if (nextList.length > 0) nextList[0].isHead = true;
    setLinkedList(nextList);

    const msg = `🗑️ Deleted HEAD node ${removed} in O(1) time.`;
    setLastLLMessage(msg);
    addLog('SUCCESS', 'LINKED_LIST', 'DELETE_HEAD', `Removed HEAD node ${removed}. Remaining nodes: ${nextList.length}.`);
    setMetrics((m) => ({
      ...m,
      totalOperations: m.totalOperations + 1,
      llDeleteHeadCount: m.llDeleteHeadCount + 1,
    }));
    playTone(440, 'sine', 0.1);
    return removed;
  }, [linkedList, addLog, playTone]);

  const deleteTailLL = useCallback((): number | null => {
    if (linkedList.length === 0) {
      const msg = '⚠️ Linked List is empty! Underflow.';
      setLastLLMessage(msg);
      addLog('WARNING', 'LINKED_LIST', 'UNDERFLOW', 'Delete TAIL aborted: List is empty.');
      setMetrics((m) => ({ ...m, totalOperations: m.totalOperations + 1 }));
      playTone(220, 'sawtooth', 0.15);
      return null;
    }

    const removed = linkedList[linkedList.length - 1].value;
    const nextList = linkedList.slice(0, -1);
    setLinkedList(nextList);

    const msg = `🗑️ Deleted TAIL node ${removed} (O(n) predecessor traversal).`;
    setLastLLMessage(msg);
    addLog('SUCCESS', 'LINKED_LIST', 'DELETE_TAIL', `Removed TAIL node ${removed}.`);
    setMetrics((m) => ({
      ...m,
      totalOperations: m.totalOperations + 1,
      llDeleteTailCount: m.llDeleteTailCount + 1,
    }));
    playTone(440, 'sine', 0.1);
    return removed;
  }, [linkedList, addLog, playTone]);

  const deleteAtLL = useCallback((index: number): number | null => {
    if (linkedList.length === 0) {
      const msg = '⚠️ Linked List is empty! Underflow.';
      setLastLLMessage(msg);
      return null;
    }

    if (index < 0 || index >= linkedList.length) {
      const msg = `⚠️ Index ${index} out of bounds! Valid range: [0, ${linkedList.length - 1}].`;
      setLastLLMessage(msg);
      addLog('ERROR', 'LINKED_LIST', 'DELETE_OOB', `Delete index ${index} out of bounds.`);
      setMetrics((m) => ({ ...m, totalOperations: m.totalOperations + 1 }));
      playTone(220, 'sawtooth', 0.15);
      return null;
    }

    if (index === 0) return deleteHeadLL();
    if (index === linkedList.length - 1) return deleteTailLL();

    const removed = linkedList[index].value;
    const nextList = [...linkedList];
    nextList.splice(index, 1);
    setLinkedList(nextList);

    const msg = `🗑️ Deleted node ${removed} at index [${index}].`;
    setLastLLMessage(msg);
    addLog('SUCCESS', 'LINKED_LIST', 'DELETE_AT', `Removed node ${removed} at index [${index}].`);
    setMetrics((m) => ({
      ...m,
      totalOperations: m.totalOperations + 1,
      llDeleteIndexCount: m.llDeleteIndexCount + 1,
    }));
    playTone(440, 'sine', 0.1);
    return removed;
  }, [linkedList, deleteHeadLL, deleteTailLL, addLog, playTone]);

  const searchLL = useCallback(async (targetVal: number): Promise<number | null> => {
    if (linkedList.length === 0) {
      const msg = '⚠️ Linked List is empty! Cannot search.';
      setLastLLMessage(msg);
      addLog('WARNING', 'LINKED_LIST', 'SEARCH_EMPTY', 'Search aborted: List is empty.');
      setMetrics((m) => ({ ...m, totalOperations: m.totalOperations + 1 }));
      return null;
    }

    setLastLLMessage(`🔍 Traversing pointers to search for node ${targetVal}...`);

    for (let i = 0; i < linkedList.length; i++) {
      setLLSearchActive(i);
      playTone(390 + i * 25, 'sine', 0.05);
      await new Promise((res) => setTimeout(res, 240));

      if (linkedList[i].value === targetVal) {
        setLLSearchActive(null);
        setLLSearchFound(i);
        const msg = `✅ Target node ${targetVal} FOUND at node [${i}] in ${i + 1} pointer hop(s)!`;
        setLastLLMessage(msg);
        addLog('SUCCESS', 'LINKED_LIST', 'SEARCH_FOUND', `Found node ${targetVal} at index [${i}] after ${i + 1} pointer hops.`);
        setMetrics((m) => ({
          ...m,
          totalOperations: m.totalOperations + 1,
          llSearchCount: m.llSearchCount + 1,
        }));
        playTone(784, 'sine', 0.18);
        setTimeout(() => setLLSearchFound(null), 2500);
        return i;
      }
    }

    setLLSearchActive(null);
    const msg = `❌ Target node ${targetVal} NOT FOUND after traversing to NULL.`;
    setLastLLMessage(msg);
    addLog('INFO', 'LINKED_LIST', 'SEARCH_NOT_FOUND', `Target node ${targetVal} not present in list.`);
    setMetrics((m) => ({
      ...m,
      totalOperations: m.totalOperations + 1,
      llSearchCount: m.llSearchCount + 1,
    }));
    playTone(260, 'triangle', 0.15);
    return -1;
  }, [linkedList, addLog, playTone]);

  const traverseLL = useCallback(async (): Promise<number[]> => {
    if (linkedList.length === 0) {
      const msg = '⚠️ Linked List is empty: HEAD ➔ NULL';
      setLastLLMessage(msg);
      return [];
    }

    const values: number[] = [];
    setLastLLMessage('🚀 Initiating sequential traversal from HEAD...');

    for (let i = 0; i < linkedList.length; i++) {
      setLLSearchActive(i);
      values.push(linkedList[i].value);
      playTone(440 + i * 20, 'sine', 0.05);
      await new Promise((res) => setTimeout(res, 180));
    }

    setLLSearchActive(null);
    const msg = `📋 Traversal: HEAD ➔ ${values.join(' ➔ ')} ➔ NULL`;
    setLastLLMessage(msg);
    addLog('INFO', 'LINKED_LIST', 'TRAVERSE', `Traversed ${values.length} nodes from HEAD to NULL.`);
    setMetrics((m) => ({
      ...m,
      totalOperations: m.totalOperations + 1,
      llTraverseCount: m.llTraverseCount + 1,
    }));
    return values;
  }, [linkedList, addLog, playTone]);

  const accessLL = useCallback((index: number): number | null => {
    if (index < 0 || index >= linkedList.length) {
      const msg = `⚠️ Index ${index} out of bounds! Valid: [0, ${Math.max(0, linkedList.length - 1)}].`;
      setLastLLMessage(msg);
      return null;
    }

    const val = linkedList[index].value;
    setActiveLLIndex(index);
    const msg = `👁️ Traversed ${index} pointers ➔ Node [${index}] value: ${val} (O(n) cost)`;
    setLastLLMessage(msg);
    addLog('INFO', 'LINKED_LIST', 'ACCESS', `Accessed node [${index}] after traversing ${index} links.`);
    setMetrics((m) => ({ ...m, totalOperations: m.totalOperations + 1 }));
    playTone(659.25, 'sine', 0.12);
    setTimeout(() => setActiveLLIndex(null), 1500);
    return val;
  }, [linkedList, addLog, playTone]);

  const clearLL = useCallback(() => {
    const count = linkedList.length;
    setLinkedList([]);
    const msg = '🧹 Linked List cleared. HEAD ➔ NULL';
    setLastLLMessage(msg);
    addLog('INFO', 'LINKED_LIST', 'CLEAR', `Cleared ${count} nodes from list.`);
    setMetrics((m) => ({
      ...m,
      totalOperations: m.totalOperations + 1,
      clearCount: m.clearCount + 1,
    }));
    playTone(330, 'triangle', 0.12);
  }, [linkedList.length, addLog, playTone]);

  const initLL = useCallback((elements: number[]) => {
    const nodes: LinkedListNode[] = elements.slice(0, 15).map((val, idx) => ({
      id: generateId(),
      value: val,
      isHead: idx === 0,
    }));
    setLinkedList(nodes);
    const msg = `Initialized linked list with ${nodes.length} nodes.`;
    setLastLLMessage(msg);
    addLog('INFO', 'LINKED_LIST', 'INIT', `Initialized list with ${nodes.length} nodes.`);
    setMetrics((m) => ({ ...m, totalOperations: m.totalOperations + 1 }));
    playTone(523.25, 'sine', 0.1);
  }, [addLog, playTone]);

  // ==================== GENERAL / BENCHMARK ====================
  const loadSampleData = useCallback((target: 'stack' | 'queue' | 'array' | 'linkedlist' | 'all') => {
    if (target === 'stack' || target === 'all') {
      const samples = [88, 54, 21, 93];
      const newStack = samples.slice(0, stackMaxSize).map((val, idx) => ({
        id: generateId() + idx,
        value: val,
        timestamp: Date.now() + idx,
      }));
      setStack(newStack);
      setLastStackMessage(`Loaded ${newStack.length} sample elements into Stack.`);
    }

    if (target === 'queue' || target === 'all') {
      const samples = [17, 34, 72, 89];
      const newQueue = samples.slice(0, queueMaxSize).map((val, idx) => ({
        id: generateId() + idx,
        value: val,
        timestamp: Date.now() + idx,
      }));
      setQueue(newQueue);
      setLastQueueMessage(`Loaded ${newQueue.length} sample elements into Queue.`);
    }

    if (target === 'array' || target === 'all') {
      const samples = [10, 25, 45, 60, 85];
      const newArr = samples.map((val) => ({ id: generateId(), value: val }));
      setArray(newArr);
      setLastArrayMessage(`Loaded ${newArr.length} sample elements into Array.`);
    }

    if (target === 'linkedlist' || target === 'all') {
      const samples = [15, 30, 45, 60];
      const newLL = samples.map((val, idx) => ({ id: generateId(), value: val, isHead: idx === 0 }));
      setLinkedList(newLL);
      setLastLLMessage(`Loaded ${newLL.length} sample nodes into Linked List.`);
    }

    addLog('SUCCESS', 'SYSTEM', 'LOAD_DATASET', `Benchmark sample dataset loaded into ${target.toUpperCase()}.`);
    setMetrics((m) => ({ ...m, totalOperations: m.totalOperations + 1 }));
    playTone(550, 'sine', 0.15);
  }, [stackMaxSize, queueMaxSize, addLog, playTone]);

  const clearLogs = useCallback(() => {
    setLogs([]);
    playTone(300, 'triangle', 0.08);
  }, [playTone]);

  const resetAll = useCallback((resetHistory: boolean = false) => {
    setStack([]);
    setQueue([]);
    setArray([]);
    setLinkedList([]);
    setLastStackMessage('Stack reset to empty.');
    setLastQueueMessage('Queue reset to empty.');
    setLastArrayMessage('Array reset to empty.');
    setLastLLMessage('Linked List reset to empty.');

    if (resetHistory) {
      setLogs([]);
      setMetrics(initialMetrics);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    } else {
      addLog('WARNING', 'SYSTEM', 'RESET', 'Data structures cleared to zero elements.');
      setMetrics((m) => ({ ...m, totalOperations: m.totalOperations + 1 }));
    }
    playTone(370, 'triangle', 0.15);
  }, [addLog, playTone]);

  return (
    <DSAContext.Provider
      value={{
        stack,
        stackMaxSize,
        lastStackMessage,
        isStackPeeking,
        setStackSize,
        push,
        pop,
        peekStack,
        clearStack,
        displayStack,

        queue,
        queueMaxSize,
        lastQueueMessage,
        isQueuePeekingFront,
        isQueuePeekingRear,
        setQueueSize,
        enqueue,
        dequeue,
        peekFront,
        peekRear,
        clearQueue,
        displayQueue,

        array,
        arrayCapacity,
        lastArrayMessage,
        activeArrayIndex,
        arraySearchActive,
        arraySearchFound,
        setArrayCapacity,
        insertAtArray,
        accessArray,
        updateArray,
        deleteFromArray,
        searchArray,
        clearArray,
        initArray,

        linkedList,
        lastLLMessage,
        activeLLIndex,
        llSearchActive,
        llSearchFound,
        insertHeadLL,
        insertTailLL,
        insertAtLL,
        deleteHeadLL,
        deleteTailLL,
        deleteAtLL,
        searchLL,
        traverseLL,
        accessLL,
        clearLL,
        initLL,

        logs,
        metrics,
        clearLogs,
        loadSampleData,
        resetAll,

        animationsEnabled,
        setAnimationsEnabled,
        soundEnabled,
        setSoundEnabled,
      }}
    >
      {children}
    </DSAContext.Provider>
  );
};

export const useDSA = () => {
  const context = useContext(DSAContext);
  if (!context) {
    throw new Error('useDSA must be used within a DSAProvider');
  }
  return context;
};
