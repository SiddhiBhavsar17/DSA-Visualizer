export interface StackElement {
  id: string;
  value: number;
  timestamp: number;
  isNew?: boolean;
  isPeeking?: boolean;
}

export interface QueueElement {
  id: string;
  value: number;
  timestamp: number;
  isNew?: boolean;
  isPeekingFront?: boolean;
  isPeekingRear?: boolean;
}

export interface ArrayElement {
  id: string;
  value: number;
  isHighlighted?: boolean;
  isSearching?: boolean;
  isSuccess?: boolean;
}

export interface LinkedListNode {
  id: string;
  value: number;
  isHead?: boolean;
  isCurrent?: boolean;
  isSearching?: boolean;
  isSuccess?: boolean;
}

export type LogType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
export type StructureType = 'STACK' | 'QUEUE' | 'ARRAY' | 'LINKED_LIST' | 'SYSTEM';

export interface OperationLog {
  id: string;
  timestamp: string;
  rawTime: number;
  type: LogType;
  structure: StructureType;
  operation: string;
  details: string;
}

export interface OperationMetrics {
  totalOperations: number;
  // Stack
  pushCount: number;
  popCount: number;
  peekStackCount: number;
  // Queue
  enqueueCount: number;
  dequeueCount: number;
  peekQueueCount: number;
  // Array
  arrayInsertCount: number;
  arrayDeleteCount: number;
  arrayAccessCount: number;
  arrayUpdateCount: number;
  arraySearchCount: number;
  // Linked List
  llInsertHeadCount: number;
  llInsertTailCount: number;
  llInsertIndexCount: number;
  llDeleteHeadCount: number;
  llDeleteTailCount: number;
  llDeleteIndexCount: number;
  llSearchCount: number;
  llTraverseCount: number;
  // General
  clearCount: number;
}

export type ActiveModule = 'dashboard' | 'stack' | 'queue' | 'array' | 'linkedlist';
