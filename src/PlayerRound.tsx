import React, { FunctionComponent } from 'react';
//import './PlayerRound.css';

interface PlayerRoundProps {
  cardCount: number;
  prevRoundScore: number;
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

const PlayerRound: FunctionComponent<PlayerRoundProps> = ( {cardCount, prevRoundScore} ) => {
  let bids: number = 0;
  let tricks: number = 0;
  let bonus: number = 0;

  return (
    <td className='PlayerRound'>
      b: {bids} t: {tricks} +: {bonus}
      sc: {calculatePlayerScoreForRound(cardCount, bids, tricks, bonus)}
    </td>
  );
}

export default PlayerRound;
