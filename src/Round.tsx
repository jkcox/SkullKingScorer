import React, { FunctionComponent, useState } from 'react';
import PlayerRound from './PlayerRound';
import RoundInfo from './RoundInfo';
import RoundModes from './RoundModes';
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

  return (
    <tr className="Round">
       <td key='cardCount'>{cardCount}</td>
       {players.map(p => 
       <PlayerRound cardCount={cardCount} prevRoundScore={0} roundMode={roundMode} player={p}></PlayerRound>
       )}
       { roundMode === RoundModes.Bidding &&
       <button onClick={ () => {setRoundMode(RoundModes.Playing)}}>Start Round</button>}
       { roundMode === RoundModes.Playing &&
       <button onClick={() => { roundCompleteAction()}}>Round done</button>}
    </tr>
  );
}

export default Round;
