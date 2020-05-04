import React from 'react';
import './App.css';
import Sheet from './Sheet';

function App() {
  let players = ['Lada', 'Kuzya', 'Craig', 'Devlin'];

  return (
    <div className="App">
      <header className="App-header">
        <Sheet players={players}></Sheet>
      </header>
    </div>
  );
}

export default App;
