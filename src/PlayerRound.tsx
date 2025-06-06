import React, { FunctionComponent, useState, useEffect } from 'react';
import RoundModes from './RoundModes';

import './PlayerRound.css';

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
  legendaryExpansionInPlay: boolean;
}

const calculatePlayerScoreForRound = (cardsInRound: number, tricksBid: number, tricksWon: number, bonusPoints: number, bet: number) => {
  let betBonus: number = 0;
  if (bet > 0) {
    if (tricksBid === tricksWon) {
      betBonus = bet;
    } else {
      betBonus = -bet;
    }
  }
  if (tricksBid === 0) {
    if (tricksWon === 0) {
      return 10 * cardsInRound + betBonus;
    }
      return -10 * cardsInRound + betBonus;
  }

  if (tricksBid !== tricksWon) {
    return -Math.abs(tricksBid - tricksWon) * 10 + betBonus;
  }
  return tricksWon * 20 + bonusPoints + betBonus;
}

const PlayerRound: FunctionComponent<PlayerRoundProps> = ( {cardCount, prevRoundScore, roundMode, player,
  recordBid, recordScore, trickPlayedAction, tricksPlayed, winning, startingPlayer, legendaryExpansionInPlay } ) => {
  let [bid, setBid] = useState(0);
  let [tricks, setTricks] = useState(0);
  let [bonus, setBonus] = useState(0);
  let trickNums = [...Array(cardCount + 1).keys()];

  const recordPlayerBid = (newbid: number): void => {
    setBid(newbid);
    recordBid(player, newbid);
  };

  let [bet, setBet] = useState(0);
  const placeRascalOfRoatanBet = (betAmount: number) => {
    setBet(betAmount);
  };

  let [score, setScore] = useState(0);
  useEffect(() => {
    if (roundMode === RoundModes.Completed) {
      let score = calculatePlayerScoreForRound(cardCount, bid, tricks, bonus, bet);
      recordScore(player, score + prevRoundScore);
      setScore(score);
    }
  }, [roundMode, bid, bonus, player, score, prevRoundScore, recordScore, cardCount, tricks, bet]);

  const trickPlayed = (): void => {
    setTricks(tricks + 1);
    trickPlayedAction();
  };

  const bonusEntered = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setBonus(Number(event.target.value));
  };

  const adjustBid = (bidChange: number): void => {
    setBid(Math.max(0,Math.min(bid + bidChange, cardCount)));
  };

  let backgroundColor =  winning ? 'table-success' : ((startingPlayer && roundMode === RoundModes.Bidding) ? 'table-primary' : '');
  return (
    <td className={`PlayerRound ${backgroundColor}`} key={player+cardCount}>
    {roundMode === RoundModes.Bidding && 
    <div key={player} title={startingPlayer ? 'Starts round' : ''}>
      {trickNums.map(n => (
        <React.Fragment key={player + n}>
          <input className="btn-check" type='radio' name={player} id={player+n} value={n} onClick={() => {recordPlayerBid(n)}}/>
          <label className="btn btn-outline-primary" htmlFor={player + n}>{n}</label>&nbsp;<br/>
        </React.Fragment>
      ))}
    </div>}

    { (roundMode === RoundModes.Completed || roundMode === RoundModes.Playing) &&
        <>
        <span>Bid: {bid} </span>
        <span>Won: {tricks} </span>
        { bet > 0 && <div>Bet: {bet}</div>}
        { roundMode === RoundModes.Playing &&
          <div>
            { tricksPlayed < cardCount &&
             <button className='btn btn-secondary' onClick={() => {trickPlayed()}}>Add Trick</button>
            }
            { legendaryExpansionInPlay && tricks > 0 &&
            <div className='dropdown'>
              <button type="button" className="btn">
                <img style={{backgroundColor: 'white'}} alt={'Pirate played'} width={32} src={process.env.PUBLIC_URL+'/Skull-And-Crossbones-Remix.svg'}/>
              </button>
              <div className='dropdown-content'>
                <div>Use Harry the Giant</div>
                <div className='dropdown-option' onClick={() => adjustBid(1)}>Raise bid by 1</div>
                <div className='dropdown-option' onClick={() => adjustBid(-1)}>Lower bid by 1</div>
                <div>Use Rascal of Roatan </div>
                <div className='dropdown-option' onClick={() => placeRascalOfRoatanBet(10)}>Bet 10 points</div>
                <div className='dropdown-option' onClick={() => placeRascalOfRoatanBet(20)}>Bet 20 points</div>
             </div>
            </div>
            }
          </div>
        }
        { roundMode === RoundModes.Playing && tricksPlayed === cardCount && bid === tricks && 
          <div>
            <input placeholder='Bonus' type='number' style={{width: 48}} min='0' step='10' onChange={bonusEntered}/>
          </div>
        }
    </>}
    { roundMode === RoundModes.Completed && [
      bonus > 0 ? <div key="bonus">Bonus: {bonus}</div> : null,
      <div key="score">Score: {score}</div>,
      <div key="total">Total: {score + prevRoundScore}</div>,
      (() => { localStorage.setItem('scores', JSON.stringify(score + prevRoundScore)); return null; })()
    ]}
    </td>
  );
}

export default PlayerRound;
