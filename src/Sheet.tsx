import React, { FunctionComponent, useState } from 'react';
import Round from './Round';
import RoundInfo from './RoundInfo';
//import './Sheet.css';


interface SheetProps {
  players: string[];
}
const Sheet: FunctionComponent<SheetProps> = ({players}) => {
  let [scoreInfo] = useState([] as RoundInfo[]);  

  return (
    <table>
      <thead>
        <tr>
        <th>Round</th>
        {
          players.map(p => <th key={p}>{p}</th>)
        }
        </tr>
      </thead>
      <tbody>
    { [1,2,3,4,5,6,7,8,9,10].map(n =>
         <Round key={n} cardCount={n} players={players} prevRoundScores={scoreInfo[n]} scoreInfo={scoreInfo[n]}/>
      )
    }
    </tbody>
    </table>
  );
}

export default Sheet;
