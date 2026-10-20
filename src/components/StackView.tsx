import React, { useState } from 'react';

interface StackViewProps {
  onBack: () => void;
}

export const StackView: React.FC<StackViewProps> = ({ onBack }) => {
  const [maxSize, setMaxSize] = useState<number>(5);
  const [sizeInput, setSizeInput] = useState<string>('5');
  const [stack, setStack] = useState<number[]>([]);
  const [valueInput, setValueInput] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [showPseudo, setShowPseudo] = useState<boolean>(false);

  const pseudocode = `#include <iostream>
using namespace std;
int n;
int top = -1;
int stack[100];
void push(int value) {
    if (top >= n - 1) {
        cout << "Stack overflowed!!";
    } else {
        top++;
        stack[top] = value;
        cout << "Inserted " << value;
    }
}
void pop() {
    if (top <= -1) {
        cout << "Stack underflowed!!";
    } else {
        cout << "Removed element: " << stack[top];
        top--;
    }
}
void display() {
    if (top >= 0) {
        for (int i = top; i >= 0; i--) {
            cout << stack[i] << " ";
        }
    } else {
        cout << "Stack is empty!!";
    }
}`;

  const handleSetSize = () => {
    const parsed = parseInt(sizeInput);
    const validSize = isNaN(parsed) || parsed < 1 ? 5 : parsed;
    setMaxSize(validSize);
    setStack([]);
    setMessage('Stack size set to ' + validSize);
  };

  const handlePush = () => {
    if (stack.length >= maxSize) {
      setMessage('⚠️ Stack Overflow!');
      return;
    }
    const val = valueInput !== '' ? parseInt(valueInput) : Math.floor(Math.random() * 100);
    setStack((prev) => [...prev, val]);
    setMessage('✅ Inserted ' + val);
    setValueInput('');
  };

  const handlePop = () => {
    if (stack.length === 0) {
      setMessage('⚠️ Stack Underflow!');
      return;
    }
    const removed = stack[stack.length - 1];
    setStack((prev) => prev.slice(0, -1));
    setMessage('🗑️ Removed ' + removed);
  };

  const handleDisplay = () => {
    if (stack.length === 0) {
      setMessage('⚠️ Stack is Empty!');
    } else {
      setMessage('📦 Stack: ' + stack.join(', '));
    }
  };

  const btnStyle: React.CSSProperties = {
    margin: '5px',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    background: '#e60073',
    color: 'white',
    fontSize: '14px',
  };

  return (
    <div
      style={{
        background: '#ffe6f0',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
      }}
    >
      <h1 style={{ color: '#e60073' }}>Stack Visualization</h1>

      {/* Stack size input */}
      <label htmlFor="stackSize">Enter stack size: </label>
      <input
        type="number"
        id="stackSize"
        value={sizeInput}
        min="1"
        max="20"
        onChange={(e) => setSizeInput(e.target.value)}
        style={{ padding: '6px', margin: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <button
        onClick={handleSetSize}
        style={btnStyle}
        onMouseOver={(e) => (e.currentTarget.style.background = '#cc0052')}
        onMouseOut={(e) => (e.currentTarget.style.background = '#e60073')}
      >
        Set Size
      </button>

      <div
        id="stack"
        className="stack-container"
        style={{
          margin: '20px auto',
          width: '200px',
          minHeight: '300px',
          border: '2px solid #e60073',
          display: 'flex',
          flexDirection: 'column-reverse',
          alignItems: 'center',
          padding: '10px',
          background: 'white',
        }}
      >
        {stack.map((item, index) => (
          <div
            key={index}
            className="element fade-in"
            style={{
              width: '150px',
              height: '40px',
              margin: '5px',
              background: '#e60073',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '5px',
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Value input before buttons */}
      <input
        type="number"
        id="stackValue"
        placeholder="Enter value"
        value={valueInput}
        onChange={(e) => setValueInput(e.target.value)}
        style={{ padding: '6px', margin: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <button
        onClick={handlePush}
        style={btnStyle}
        onMouseOver={(e) => (e.currentTarget.style.background = '#cc0052')}
        onMouseOut={(e) => (e.currentTarget.style.background = '#e60073')}
      >
        Push
      </button>
      <button
        onClick={handlePop}
        style={btnStyle}
        onMouseOver={(e) => (e.currentTarget.style.background = '#cc0052')}
        onMouseOut={(e) => (e.currentTarget.style.background = '#e60073')}
      >
        Pop
      </button>
      <button
        onClick={handleDisplay}
        style={btnStyle}
        onMouseOver={(e) => (e.currentTarget.style.background = '#cc0052')}
        onMouseOut={(e) => (e.currentTarget.style.background = '#e60073')}
      >
        Display
      </button>
      <button
        onClick={() => setShowPseudo(!showPseudo)}
        style={btnStyle}
        onMouseOver={(e) => (e.currentTarget.style.background = '#cc0052')}
        onMouseOut={(e) => (e.currentTarget.style.background = '#e60073')}
      >
        Show Pseudocode
      </button>
      <button
        onClick={onBack}
        style={btnStyle}
        onMouseOver={(e) => (e.currentTarget.style.background = '#cc0052')}
        onMouseOut={(e) => (e.currentTarget.style.background = '#e60073')}
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
