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
  trickPlayedAction: () => void;
  tricksPlayed: number;
  winning: boolean;
  startingPlayer: boolean;
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
const PlayerRound: FunctionComponent<PlayerRoundProps> = ( {cardCount, prevRoundScore, roundMode, player,
  recordBid, recordScore, trickPlayedAction, tricksPlayed, winning, startingPlayer } ) => {
  let [bids, setBids] = useState(0);
  let [tricks, setTricks] = useState(0);
  let [bonus, setBonus] = useState(0);
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
  }, [roundMode, bids, bonus, player, score, prevRoundScore, recordScore, cardCount, tricks])

  let trickPlayed = () => {
    setTricks(tricks + 1);
    trickPlayedAction();
  }

  let bonusEntered = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBonus(Number(event.target.value));
  }
  let backgroundColor =  winning ? 'rgba(255,215,0,0.6)'
    : ((startingPlayer && roundMode === RoundModes.Bidding) ? 'rgba(25,25,200,0.6)' : '');
  return (
    <td className='PlayerRound' style={{width: 160, backgroundColor: backgroundColor}} key={player+cardCount}>
    {roundMode === RoundModes.Bidding && 
    <div title={startingPlayer ? 'Starts round' : ''}>
      {trickNums.map(n => 
      <>&nbsp;
        <input key={player + n} type='radio' name={player} id={player+n} value={n} onClick={() => {recordPlayerBid(n)}}/>
        <label key={player + n + 'L'} htmlFor={player + n}>{n}</label>&nbsp;<br></br>
        </>
      )}
    </div>}
    { (roundMode === RoundModes.Completed || roundMode === RoundModes.Playing) &&
        <>
        <span>Bid: {bids} </span>
        <span>Won: {tricks} </span>
        { roundMode === RoundModes.Playing && tricksPlayed < cardCount &&
        <div><button onClick={() => {trickPlayed()}}>Add Trick</button></div>}
        { roundMode === RoundModes.Playing && tricksPlayed === cardCount &&
        <div>
        <input placeholder='Bonus' type='number' style={{width: 44}} onChange={bonusEntered}/></div>}
    </>}
    { roundMode === RoundModes.Completed &&
    <>
      { bonus > 0 && <div>Bonus: {bonus}</div>}
    <div>Score: {score}</div>
    <div>Total: {score + prevRoundScore}</div>
    </>
    }
    </td>
  );
}

export default PlayerRound;
