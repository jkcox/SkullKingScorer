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

  return (
    <tr className="Round">
       <td key='cardCount'>{cardCount}{cardCount === currentRound && '*'}</td>
       {players.map(p => 
       <PlayerRound key={p} cardCount={cardCount} prevRoundScore={prevRoundScores && prevRoundScores[p] ? prevRoundScores[p] : 0}
        roundMode={roundMode} player={p} recordBid={recordBid} recordScore={recordPlayerScore}></PlayerRound>
       )}
       { roundMode === RoundModes.Bidding && bidsComplete &&
       <button onClick={ () => {startRound()}}>Start Round</button>}
       { roundMode === RoundModes.Playing &&
       <button onClick={() => { roundComplete()}}>Round done</button>}
    </tr>
  );
}

export default Round;
