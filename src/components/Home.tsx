import React, { useState } from 'react';

interface HomeProps {
  onNavigate: (view: 'home' | 'stack' | 'queue') => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [showCode, setShowCode] = useState(false);

  const referenceCode = `----- Stack Pseudocode -----
push(value):
  if stack is full -> overflow
  else -> top++, stack[top] = value

pop():
  if stack empty -> underflow
  else -> top--

display():
  print elements from top to bottom


----- Queue Pseudocode -----
enqueue(value):
  if queue full -> overflow
  else -> rear++, queue[rear] = value

dequeue():
  if queue empty -> underflow
  else -> front++

display():
  print elements from front to rear`;

  return (
    <div
      style={{
        background: '#f9f0ff',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
      }}
    >
      <h1 style={{ color: '#6600cc', marginTop: '30px' }}>
        Stack &amp; Queue Visualization
      </h1>
      <p style={{ color: '#333' }}>
        Welcome! Choose an option below to explore animations and pseudocode:
      </p>

      <div style={{ margin: '20px' }}>
        <button
          onClick={() => onNavigate('stack')}
          style={{
            margin: '10px',
            padding: '15px 30px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            background: '#6600cc',
            color: 'white',
            fontSize: '16px',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#4b0099')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#6600cc')}
        >
          📚 Stack
        </button>
        <button
          onClick={() => onNavigate('queue')}
          style={{
            margin: '10px',
            padding: '15px 30px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            background: '#6600cc',
            color: 'white',
            fontSize: '16px',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#4b0099')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#6600cc')}
        >
          📦 Queue
        </button>
      </div>

      <button
        onClick={() => setShowCode(!showCode)}
        style={{
          margin: '10px',
          padding: '15px 30px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          background: '#6600cc',
          color: 'white',
          fontSize: '16px',
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = '#4b0099')}
        onMouseOut={(e) => (e.currentTarget.style.background = '#6600cc')}
      >
        📄 Show Reference Codes
      </button>

      {showCode && (
        <pre
          id="refCode"
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
          {referenceCode}
        </pre>
      )}
    </div>
  );
};
