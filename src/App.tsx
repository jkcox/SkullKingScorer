import React, { useState } from 'react';
import './App.css';
import Sheet from './Sheet';

function App() {
  let previousPlayersJson = localStorage.getItem('players');
  let initialPlayers = ['Player 1', 'Player 2', 'Player 3'];
  if (previousPlayersJson) {
    initialPlayers = JSON.parse(previousPlayersJson);
  }
  let [players, setPlayers] = useState(initialPlayers);
  let [newPlayerName, setNewPlayerName] = useState('');
  let [newPlayerFieldShown, setNewPlayerFieldShown] = useState(false);
  let [gameStarted, setGameStarted] = useState(false);
  let [legendaryExpansionInPlay, setLegendaryExpansionInPlay] = useState(localStorage.getItem('legendaryExpansionInPlay') === 'true');

  const newPlayerNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPlayerName(event.target.value);
  }

  const addPlayer = () => {
    players.push(newPlayerName);
    setPlayers(players);
    setNewPlayerFieldShown(false);
    localStorage.setItem('players', JSON.stringify(players));
  }
  const deletePlayer = (player: string) => {
    setPlayers(players.filter(p => p !== player));
    localStorage.setItem('players', JSON.stringify(players.filter(p => p !== player)));
  }
  const legendaryExpansionInPlayChanged = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLegendaryExpansionInPlay(!legendaryExpansionInPlay);
    localStorage.setItem('legendaryExpansionInPlay', String(!legendaryExpansionInPlay));
  };
  const startGame = () => {
    setGameStarted(true);
  }

  return (
    <div className="App">
      <div className="App-body">
        { !newPlayerFieldShown && !gameStarted &&
          <div>
            <input id='legendary_expansion_cb' type='checkbox' checked={legendaryExpansionInPlay}
             onChange={legendaryExpansionInPlayChanged} title='Adds support for the Kraken and Harry the Giant cards'/>
             <label htmlFor={'legendary_expansion_cb'}>Use Legendary Expansion</label>
            <button onClick={() => {setNewPlayerFieldShown(true)}}>Add player</button>
          </div>
        }
        { newPlayerFieldShown && <>
          <input type='text' placeholder='name' onChange={newPlayerNameChanged}></input>
          <button onClick={addPlayer}>OK</button>
          </>
        }
        <Sheet players={players} deletePlayerAction={deletePlayer} startGameAction={startGame} legendaryExpansionInPlay={legendaryExpansionInPlay}></Sheet>
        <br/>
        <div className="d-none">
        © 2020 Craig Fisher <a href="https://twitter.com/craigfis" target='_blank' rel="noopener noreferrer">@craigfis</a><br/>
        <a href="https://github.com/Craigfis/SkullKingScorer" target='_blank' rel="noopener noreferrer">https://github.com/Craigfis/SkullKingScorer</a>
        <br/>
        <a href="https://www.grandpabecksgames.com/products-skull-king" target='_blank' rel="noopener noreferrer">What is Skull King?</a>
        </div>
      </div>
    </div>
  );
}

export default App;
