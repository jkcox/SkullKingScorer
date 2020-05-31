import React, { FunctionComponent, useState, useEffect } from 'react';
import Round from './Round';
import './Sheet.css';
import NumberDictionary from './NumberDictionary';
import ReactGA from 'react-ga';

interface SheetProps {
  players: string[];
  deletePlayerAction: (player: string) => void;
  startGameAction: () => void;
  legendaryExpansionInPlay: boolean;
}

ReactGA.initialize('UA-166808776-1');

const Sheet: FunctionComponent<SheetProps> = ({players, deletePlayerAction, startGameAction, legendaryExpansionInPlay}) => {
  let [currentRound, setCurrentRound] = useState(1);
  let [scores, setScores] = useState([] as NumberDictionary[]);
  let [winningPlayers, setWinningPlayers] = useState([] as string[]);

  let nextRound = (roundScores: NumberDictionary) => {
    if (currentRound === 1) {
      startGameAction();
    }
    scores[currentRound] = roundScores;
    setScores(scores);
    if (currentRound === 10) {
      ReactGA.event({
        'action': 'game_completed', 
        'category': 'game_activity',
        'label': 'Winners: ' + winningPlayers + ' Scores: ' + scores[currentRound],
      });
    } else {
      setCurrentRound(currentRound+1);
    }
  }

  let [startingPlayerNum, setStartingPlayerNum] = useState(0);
  const selectStartingPlayer = (p: string): void => {
    if (currentRound === 1) {
      let playerNumber = 0;
      let playerpos: NumberDictionary = {};
      players.forEach(p => {
        playerpos[p] = playerNumber++;
      });
      setStartingPlayerNum(playerpos[p]);
    }
  };

  useEffect(() => {
    let highestScore = 0;
    if (currentRound > 1) {
      let prevRound = currentRound - 1;
      for (const player in scores[prevRound]) {
        if (scores[prevRound][player] > highestScore) {
          winningPlayers = [player];
          highestScore = scores[prevRound][player];
        } else if (scores[prevRound][player] === highestScore) {
          winningPlayers.push(player);
        }
      }
      setWinningPlayers(winningPlayers);
    }
  }, [scores, currentRound]);

  return (
    <>
    <table>
      <thead>
        <tr>
        <th>Round</th>
        {
          players.map(p => 
          <th key={p} title={currentRound === 1 ?'Click here to make this the starting player':''} onClick={() => selectStartingPlayer(p)}>{p}&nbsp; 
          { currentRound === 1 && <button onClick={() => {deletePlayerAction(p)}}>&#10007;</button>}
          </th>)
        }
        </tr>
      </thead>
      <tbody>
    { [1,2,3,4,5,6,7,8,9,10].map(n =>
         <Round key={n} cardCount={n} players={players} prevRoundScores={n > 1 ? scores[n-1] : null}
          currentRound={currentRound} roundCompleteAction={nextRound} winningPlayers={winningPlayers}
          startingPlayer={players[(startingPlayerNum + n-1) % players.length]} legendaryExpansionInPlay={legendaryExpansionInPlay}/>
      )
    }
    </tbody>
    </table>
    </>
  );
}

export default Sheet;
