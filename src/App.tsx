import React, { useState } from 'react';
import './App.css';
import Sheet from './Sheet';

function App() {
  let [players, setPlayers] = useState(['Player 1', 'Player 2', 'Player 3']);
  let [newPlayerName, setNewPlayerName] = useState('');
  let [newPlayerFieldShown, setNewPlayerFieldShown] = useState(false);
  let [gameStarted, setGameStarted] = useState(false);

  let newPlayerNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPlayerName(event.target.value);
  }

  let addPlayer = () => {
    players.push(newPlayerName);
    setPlayers(players);
    setNewPlayerFieldShown(false);
  }
  let deletePlayer = (player: string) => {
    setPlayers(players.filter(p => p !== player));
  }
  let startGame = () => {
    setGameStarted(true);
  }

  return (
    <div className="App">
      <div className="App-body">
      <h1>Skull King Scoresheet</h1>
        { !newPlayerFieldShown && !gameStarted &&
        <button onClick={() => {setNewPlayerFieldShown(true)}}>Add player</button>}
        { newPlayerFieldShown && <>
          <input type='text' placeholder='name' onChange={newPlayerNameChanged}></input>
          <button onClick={addPlayer}>OK</button>
          </>}
        <Sheet players={players} deletePlayerAction={deletePlayer} startGameAction={startGame}></Sheet>
      </div>
    </div>
  );
}

export default App;
