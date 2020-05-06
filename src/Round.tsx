import React, { FunctionComponent, useState, useEffect } from 'react';
import PlayerRound from './PlayerRound';
import RoundInfo from './RoundInfo';
import RoundModes from './RoundModes';
import NumberDictionary from './NumberDictionary';
//import './Round.css';

interface RoundProps {
  cardCount: number;
  players: string[];
  scoreInfo: RoundInfo;
  prevRoundScores: RoundInfo;
  currentRound: number;
  roundCompleteAction: () => void;
}

const Round: FunctionComponent<RoundProps> = ( {cardCount, players, scoreInfo, prevRoundScores,
  currentRound, roundCompleteAction } ) => {
  const [roundMode, setRoundMode] = useState(currentRound < cardCount ?
    RoundModes.NotYet : (currentRound === cardCount ? RoundModes.Bidding : RoundModes.Completed));

  let roundComplete = () => {
    setRoundMode(RoundModes.Completed);
    roundCompleteAction();
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
  
  useEffect(() => {
    setRoundMode(currentRound < cardCount ?
      RoundModes.NotYet : (currentRound === cardCount ? RoundModes.Bidding : RoundModes.Completed));
  }, [cardCount, currentRound]);

  return (
    <tr className="Round">
       <td key='cardCount'>{cardCount}{cardCount === currentRound && '*'}</td>
       {players.map(p => 
       <PlayerRound cardCount={cardCount} prevRoundScore={0} roundMode={roundMode} player={p} recordBid={recordBid}></PlayerRound>
       )}
       { roundMode === RoundModes.Bidding && bidsComplete &&
       <button onClick={ () => {startRound()}}>Start Round</button>}
       { roundMode === RoundModes.Playing &&
       <button onClick={() => { roundComplete()}}>Round done</button>}
    </tr>
  );
}

export default Round;
