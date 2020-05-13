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
      <h1>Ye New Skull King Scoresheet</h1>
        { !newPlayerFieldShown && !gameStarted &&
        <button onClick={() => {setNewPlayerFieldShown(true)}}>Add player</button>}
        { newPlayerFieldShown && <>
          <input type='text' placeholder='name' onChange={newPlayerNameChanged}></input>
          <button onClick={addPlayer}>OK</button>
          </>}
        <Sheet players={players} deletePlayerAction={deletePlayer} startGameAction={startGame}></Sheet>
        <br/>
        <div style={{fontSize: 11}}>
        Copyright (c) 2020 Craig Fisher <a href="https://twitter.com/craigfis">@craigfis</a><br/>
        <a href="https://github.com/Craigfis/SkullKingScorer">https://github.com/Craigfis/SkullKingScorer</a>
        </div>
      </div>
    </div>
  );
}

export default App;
