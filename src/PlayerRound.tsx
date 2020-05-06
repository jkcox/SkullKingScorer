import React, { FunctionComponent, useState } from 'react';
import RoundModes from './RoundModes';
//import './PlayerRound.css';

interface PlayerRoundProps {
  cardCount: number;
  prevRoundScore: number;
  roundMode: RoundModes;
  player: string;
  recordBid: (player: string, bid: number) => void;
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

const PlayerRound: FunctionComponent<PlayerRoundProps> = ( {cardCount, prevRoundScore, roundMode, player, recordBid } ) => {
  let [bids, setBids] = useState(0);
  let [tricks, setTricks] = useState(0);
  let bonus: number = 0;
  let trickNums = [...Array(cardCount + 1).keys()];

  let recordPlayerBid = (bid: number) => {
    setBids(bid);
    recordBid(player, bid);
  }
  return (
    <td className='PlayerRound'>
    {roundMode === RoundModes.Bidding && 
    <div>
      {trickNums.map(n => 
      <>&nbsp;
        <input type='radio' name={player} id={player+n} value={n} onClick={() => {recordPlayerBid(n)}}/>
        <label htmlFor={player + n}>{n}</label>&nbsp;
        </>
      )}
    </div>}
    { (roundMode === RoundModes.Completed || roundMode === RoundModes.Playing) &&
        <>
        <span>b: {bids} </span>
        <span>t: {tricks} </span>
        { roundMode === RoundModes.Playing && <button onClick={() => {setTricks(tricks + 1)}}>Add Trick</button>}
    </>}
    { roundMode === RoundModes.Completed &&
    <>
    <span>+: {bonus}</span>
    <div>sc: {calculatePlayerScoreForRound(cardCount, bids, tricks, bonus)}</div>
    </>
    }
    </td>
  );
}

export default PlayerRound;
