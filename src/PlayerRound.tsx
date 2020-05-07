import React, { FunctionComponent, useState, useEffect } from 'react';
import RoundModes from './RoundModes';
//import './PlayerRound.css';

interface PlayerRoundProps {
  cardCount: number;
  prevRoundScore: number;
  roundMode: RoundModes;
  player: string;
  recordBid: (player: string, bid: number) => void;
  recordScore: (player: string, score: number) => void;
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
const PlayerRound: FunctionComponent<PlayerRoundProps> = ( {cardCount, prevRoundScore, roundMode, player, recordBid, recordScore } ) => {
  let [bids, setBids] = useState(0);
  let [tricks, setTricks] = useState(0);
  let bonus: number = 0;
  let trickNums = [...Array(cardCount + 1).keys()];

  let recordPlayerBid = (bid: number) => {
    setBids(bid);
    recordBid(player, bid);
  }

  let [score, setScore] = useState(0);
  useEffect(() => {
    if (roundMode === RoundModes.Completed) {
      let score = calculatePlayerScoreForRound(cardCount, bids, tricks, bonus);
      recordScore(player, score + prevRoundScore);
      setScore(score);
    }
  }, [roundMode])

  return (
    <td className='PlayerRound'>
    {roundMode === RoundModes.Bidding && 
    <div>
      {trickNums.map(n => 
      <>&nbsp;
        <input key={player + n} type='radio' name={player} id={player+n} value={n} onClick={() => {recordPlayerBid(n)}}/>
        <label key={player + n + 'L'} htmlFor={player + n}>{n}</label>&nbsp;
        </>
      )}
    </div>}
    { (roundMode === RoundModes.Completed || roundMode === RoundModes.Playing) &&
        <>
        <span>B: {bids} </span>
        <span>W: {tricks} </span>
        { roundMode === RoundModes.Playing && <button onClick={() => {setTricks(tricks + 1)}}>Add Trick</button>}
    </>}
    { roundMode === RoundModes.Completed &&
    <>
    <span>+: {bonus}</span>
    <div>score: {score}</div>
    <div>Total: {score + prevRoundScore}</div>
    </>
    }
    </td>
  );
}

export default PlayerRound;
