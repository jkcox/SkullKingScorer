import React, { FunctionComponent } from 'react';
import PlayerRound from './PlayerRound';
import NumberDictionary from './NumberDictionary';
import RoundInfo from './RoundInfo';
//import './Round.css';

interface RoundProps {
  cardCount: number;
  players: string[];
  scoreInfo: RoundInfo;
  prevRoundScores: RoundInfo;
}

let calculatePlayerScoreForRound = (cardsInRound: number, tricksBid: number, tricksWon: number, bonusPoints: number) => {
  if (tricksBid === 0 && tricksWon === 0) {
    return 10 * cardsInRound;
  }
  if (tricksBid !== tricksWon) {
    return -Math.abs(tricksBid - tricksWon) * 10;
  }
  return tricksWon * 20 + bonusPoints;
}

const Round: FunctionComponent<RoundProps> = ( {cardCount, players, scoreInfo, prevRoundScores} ) => {

  return (
    <tr className="Round">
       <td key='cardCount'>{cardCount}</td>
       {players.map(p => 
       <PlayerRound cardCount={cardCount} prevRoundScore={0}></PlayerRound>
       )}
    </tr>
  );
}

export default Round;
