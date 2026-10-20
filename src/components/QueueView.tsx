import React, { useState } from 'react';

interface QueueViewProps {
  onBack: () => void;
}

export const QueueView: React.FC<QueueViewProps> = ({ onBack }) => {
  const [maxSize, setMaxSize] = useState<number>(5);
  const [sizeInput, setSizeInput] = useState<string>('5');
  const [queue, setQueue] = useState<number[]>([]);
  const [valueInput, setValueInput] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [showPseudo, setShowPseudo] = useState<boolean>(false);

  const pseudocode = `#include <iostream>
using namespace std;
int n, front = -1, rear = -1;
int queue[100];
void enqueue(int value) {
    if (rear == n - 1) {
        cout << "Queue Overflow!";
    } else {
        if (front == -1) front = 0;
        rear++;
        queue[rear] = value;
        cout << "Inserted " << value;
    }
}
void dequeue() {
    if (front == -1 || front > rear) {
        cout << "Queue Underflow!";
    } else {
        cout << "Removed element: " << queue[front];
        front++;
    }
}
void display() {
    if (front == -1) {
        cout << "Queue is Empty!";
    } else {
        for (int i = front; i <= rear; i++) {
            cout << queue[i] << " ";
        }
    }
}`;

  const handleSetSize = () => {
    const parsed = parseInt(sizeInput);
    const validSize = isNaN(parsed) || parsed < 1 ? 5 : parsed;
    setMaxSize(validSize);
    setQueue([]);
    setMessage('Queue size set to ' + validSize);
  };

  const handleEnqueue = () => {
    if (queue.length >= maxSize) {
      setMessage('⚠️ Queue Overflow!');
      return;
    }
    const val = valueInput !== '' ? parseInt(valueInput) : Math.floor(Math.random() * 100);
    setQueue((prev) => [...prev, val]);
    setMessage('✅ Enqueued ' + val);
    setValueInput('');
  };

  const handleDequeue = () => {
    if (queue.length === 0) {
      setMessage('⚠️ Queue Underflow!');
      return;
    }
    const removed = queue[0];
    setQueue((prev) => prev.slice(1));
    setMessage('🗑️ Dequeued ' + removed);
  };

  const handleDisplay = () => {
    if (queue.length === 0) {
      setMessage('⚠️ Queue is Empty!');
    } else {
      setMessage('📦 Queue: ' + queue.join(', '));
    }
  };

  const btnStyle: React.CSSProperties = {
    margin: '5px',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    background: '#006699',
    color: 'white',
    fontSize: '14px',
  };

  return (
    <div
      style={{
        background: '#e6f7ff',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
      }}
    >
      <h1 style={{ color: '#006699' }}>Queue Visualization</h1>

      {/* Queue size input */}
      <label htmlFor="queueSize">Enter queue size: </label>
      <input
        type="number"
        id="queueSize"
        value={sizeInput}
        min="1"
        max="20"
        onChange={(e) => setSizeInput(e.target.value)}
        style={{ padding: '6px', margin: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <button
        onClick={handleSetSize}
        style={btnStyle}
        onMouseOver={(e) => (e.currentTarget.style.background = '#004466')}
        onMouseOut={(e) => (e.currentTarget.style.background = '#006699')}
      >
        Set Size
      </button>

      <div
        id="queue"
        className="queue-container"
        style={{
          margin: '20px auto',
          width: '90%',
          maxWidth: '500px',
          minHeight: '100px',
          border: '2px solid #006699',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
          padding: '10px',
          background: 'white',
          overflowX: 'auto',
        }}
      >
        {queue.map((item, index) => (
          <div
            key={index}
            className="element fade-in"
            style={{
              width: '60px',
              height: '60px',
              margin: '5px',
              background: '#006699',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '5px',
              flexShrink: 0,
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Value input before buttons */}
      <input
        type="number"
        id="queueValue"
        placeholder="Enter value"
        value={valueInput}
        onChange={(e) => setValueInput(e.target.value)}
        style={{ padding: '6px', margin: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <button
        onClick={handleEnqueue}
        style={btnStyle}
        onMouseOver={(e) => (e.currentTarget.style.background = '#004466')}
        onMouseOut={(e) => (e.currentTarget.style.background = '#006699')}
      >
        Enqueue
      </button>
      <button
        onClick={handleDequeue}
        style={btnStyle}
        onMouseOver={(e) => (e.currentTarget.style.background = '#004466')}
        onMouseOut={(e) => (e.currentTarget.style.background = '#006699')}
      >
        Dequeue
      </button>
      <button
        onClick={handleDisplay}
        style={btnStyle}
        onMouseOver={(e) => (e.currentTarget.style.background = '#004466')}
        onMouseOut={(e) => (e.currentTarget.style.background = '#006699')}
      >
        Display
      </button>
      <button
        onClick={() => setShowPseudo(!showPseudo)}
        style={btnStyle}
        onMouseOver={(e) => (e.currentTarget.style.background = '#004466')}
        onMouseOut={(e) => (e.currentTarget.style.background = '#006699')}
      >
        Show Pseudocode
      </button>
      <button
        onClick={onBack}
        style={btnStyle}
        onMouseOver={(e) => (e.currentTarget.style.background = '#004466')}
        onMouseOut={(e) => (e.currentTarget.style.background = '#006699')}
      >
        🏠 Back to Home
      </button>

      <div id="message" style={{ margin: '15px', fontWeight: 'bold' }}>
        {message}
      </div>

      {showPseudo && (
        <pre
          id="pseudocode"
          style={{
            textAlign: 'left',
            background: '#1e1e1e',
            color: '#dcdcdc',
            padding: '15px',
            borderRadius: '10px',
            overflowX: 'auto',
            maxWidth: '90%',
            margin: '20px auto',
            display: 'block',
            whiteSpace: 'pre-wrap',
          }}
        >
          {pseudocode}
        </pre>
      )}
    </div>
  );
};
