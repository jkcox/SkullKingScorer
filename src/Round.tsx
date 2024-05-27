import React, { FunctionComponent, useState, useEffect } from 'react';
import PlayerRound from './PlayerRound';
import RoundModes from './RoundModes';
import NumberDictionary from './NumberDictionary';
//import ReactGA from 'react-ga';
//import './Round.css';

interface RoundProps {
  cardCount: number;
  players: string[];
  prevRoundScores: NumberDictionary | null;
  currentRound: number;
  roundCompleteAction: (scores: NumberDictionary) => void;
  winningPlayers: string[];
  startingPlayer: string;
  legendaryExpansionInPlay: boolean;
}

//ReactGA.initialize('UA-166808776-1');

const Round: FunctionComponent<RoundProps> = ( {cardCount, players, prevRoundScores,
  currentRound, roundCompleteAction, winningPlayers, startingPlayer, legendaryExpansionInPlay } ) => {
  const [roundMode, setRoundMode] = useState(currentRound < cardCount ?
    RoundModes.NotYet : (currentRound === cardCount ? RoundModes.Bidding : RoundModes.Completed));

  let roundComplete = () => {
    setRoundMode(RoundModes.Completed);
    roundCompleteAction(scores);
  }
  let startRound = () => {
    setRoundMode(RoundModes.Playing);
    if (currentRound === 1) {
      // ReactGA.event({
      //   'action': 'game_started', 
      //   'category': 'game_activity',
      //   'label': 'Players: ' + players,
      // });
    }
  }

  let [bids,setBids] = useState({} as NumberDictionary);
  let [bidsComplete, setBidsComplete] = useState(false);
  let [totalTricksBid, setTotalTricksBid] = useState(0);
  let recordBid = (player: string, bid: number) => {
    bids[player] = bid;
    setBids(bids);
    let allBidsIn = true;
    let totalOfBids = 0;
    players.forEach(p => {
      if (bids[p] === undefined) {
        allBidsIn = false;
      } else {
        totalOfBids += bids[p];
      }
    });
    setBidsComplete(allBidsIn);
    setTotalTricksBid(totalOfBids);
  }

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
       <td key='cardCount'>{cardCount}{!bidsComplete && currentRound === cardCount && <div>Enter bids</div>}</td>

       {players.map(p => 
       <PlayerRound key={p+cardCount} cardCount={cardCount} trickPlayedAction={addToTrickCount} tricksPlayed={tricksPlayedCount}
        prevRoundScore={prevRoundScores && prevRoundScores[p] ? prevRoundScores[p] : 0}
        roundMode={roundMode} player={p} recordBid={recordBid} recordScore={recordPlayerScore}
        winning={winningPlayers.includes(p) && cardCount === currentRound - 1} startingPlayer={startingPlayer === p}
        legendaryExpansionInPlay={legendaryExpansionInPlay}
        />
       )}

       <td style={{width: 50, border: 'none'}}>
        { roundMode === RoundModes.Bidding && bidsComplete &&
        <>
        <button type="button" className="btn btn-success" onClick={ () => {startRound()}}>Start Round</button>
        <div style={{width: 100}}>
        { totalTricksBid === cardCount ? 'Bids at par' :
          (totalTricksBid < cardCount ? 'Bids ' + (cardCount - totalTricksBid) + ' under'
          : 'Bids ' + (totalTricksBid - cardCount) + ' over')
        }
        </div>
        </>
        }
        { roundMode === RoundModes.Playing && tricksPlayedCount < cardCount && !krakenPlayed && legendaryExpansionInPlay &&
          <button type="button" className="btn btn-danger" onClick={() => { recordKrakenPlayed()}}>Kraken Played</button>
        }

        { roundMode === RoundModes.Playing && tricksPlayedCount === cardCount &&
          <button type="button" className="btn btn-warning" onClick={() => { roundComplete()}}>Round done</button>
        }
       </td>
    </tr>
  );
}

export default Round;
