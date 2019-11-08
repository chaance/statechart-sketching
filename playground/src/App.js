import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
    </div>
  );
}

function Listbox() {
  return (
    <div
      role="listbox"
      tabIndex={0}
      id="listbox1"
      aria-labelledby="listbox1label"
      //onClick={handleClick}
      //onKeyDown={handleKeyDown}
      aria-activedescendant="listbox1-1"
    >
      {[
        { label: 'Green' },
        { label: 'Orange' },
        { label: 'Red' },
        { label: 'Blue' },
        { label: 'Violet' },
        { label: 'Periwinkle' }
      ].map(({ label }, index) => {
        const isActive = selectedIndex === index;
        return (
          <div
            key={`listbox-opt-${index}`}
            role="option"
            id={`listbox1-${index + 1}`}
            className={isActive && 'selected'}
            aria-selected={isActive}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
}

export default App;
