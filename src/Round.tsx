import React, { FunctionComponent, useState, useEffect } from 'react';
import PlayerRound from './PlayerRound';
import RoundModes from './RoundModes';
import NumberDictionary from './NumberDictionary';
//import './Round.css';

interface RoundProps {
  cardCount: number;
  players: string[];
  prevRoundScores: NumberDictionary | null;
  currentRound: number;
  roundCompleteAction: (scores: NumberDictionary) => void;
}

const Round: FunctionComponent<RoundProps> = ( {cardCount, players, prevRoundScores,
  currentRound, roundCompleteAction } ) => {
  const [roundMode, setRoundMode] = useState(currentRound < cardCount ?
    RoundModes.NotYet : (currentRound === cardCount ? RoundModes.Bidding : RoundModes.Completed));

  let roundComplete = () => {
    setRoundMode(RoundModes.Completed);
    roundCompleteAction(scores);
  }
  let startRound = () => {
    setRoundMode(RoundModes.Playing);
  }
  let [bids,setBids] = useState({} as NumberDictionary);
  let recordBid = (player: string, bid: number) => {
    bids[player] = bid;
    setBids(bids);
    let allBidsIn = true;
    players.forEach(p => {
      if (bids[p] === undefined) {
        allBidsIn = false;
      }
    });
    setBidsComplete(allBidsIn);
  }
  let [bidsComplete, setBidsComplete] = useState(false);
  
  let [scores, setScores] = useState({} as NumberDictionary);
  let recordPlayerScore = (player: string, score: number) => {
    scores[player] = score;
    setScores(scores);
  };

  useEffect(() => {
    setRoundMode(currentRound < cardCount ?
      RoundModes.NotYet : (currentRound === cardCount ? RoundModes.Bidding : RoundModes.Completed));
  }, [cardCount, currentRound]);

  let [tricksPlayedCount, setTricksPlayedCount] = useState(0);
  let addToTrickCount = () => {
    setTricksPlayedCount(tricksPlayedCount + 1);
  }

  let [krakenPlayed, setKrakenPlayed] = useState(false);
  let recordKrakenPlayed = () => {
    setKrakenPlayed(true);
    addToTrickCount();
  }

  return (
    <tr className="Round">
       <td key='cardCount'>{cardCount}</td>
       {players.map(p => 
       <PlayerRound key={p} cardCount={cardCount} trickPlayedAction={addToTrickCount} tricksPlayed={tricksPlayedCount}
        prevRoundScore={prevRoundScores && prevRoundScores[p] ? prevRoundScores[p] : 0}
        roundMode={roundMode} player={p} recordBid={recordBid} recordScore={recordPlayerScore}></PlayerRound>
       )}
       <td style={{width: 50, border: 'none'}}>
        { roundMode === RoundModes.Bidding && bidsComplete &&
        <button onClick={ () => {startRound()}}>Start Round</button>}
        { roundMode === RoundModes.Playing && tricksPlayedCount < cardCount && !krakenPlayed &&
        <button onClick={() => { recordKrakenPlayed()}}>Kraken Played</button>}
        { roundMode === RoundModes.Playing && tricksPlayedCount === cardCount &&
        <button onClick={() => { roundComplete()}}>Round done</button>}
       </td>
    </tr>
  );
}

export default Round;
