import React from 'react';
import './App.css';
import Sheet from './Sheet';

function App() {
  let players = ['Lada', 'Kuzya', 'Craig', 'Devlin'];

  return (
    <div className="App">
      <div className="App-body">
      <h1>Skull King Scoresheet</h1>
        <Sheet players={players}></Sheet>
      </div>
    </div>
  );
}

export default App;
