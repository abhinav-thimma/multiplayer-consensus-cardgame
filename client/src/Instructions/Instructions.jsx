import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import "./Instructions.css";

const Instructions = (props) => {
  const [ moveToLobby, setMoveToLobby ] = useState(false);
  const { roomId, playerNumber } = props.match.params;

  const handleJoinButtonClick = () => {
    setMoveToLobby(true);
  };

  return (
    <div className="main-container">
      <div>
        <p style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '35px' }}>Instructions for the game</p>
        <br />
        <ul>
          <li>You will be playing a card game where there will be multiple players and multiple games.</li>
          <li>Each game will further be divided into multiple rounds</li>
          <li>In each round you are required to select one of the cards which is available with you to share information to all the players in your room.</li>
          <li>You will be allowed to play just one card per round</li>
          <li>After all the players play their cards for a round, a Survey page would be shown asking questions about your card choice</li>
          <li>At the end of each game there would be additional questions regarding the entire game.</li>
        </ul>
      </div >
      <div style={{margin: 'auto'}}>
        <button className="enter-room-button" onClick={handleJoinButtonClick}>
          Join Lobby
        </button>
      </div>
      {moveToLobby &&
        <Redirect to={`/room/${roomId}/${playerNumber}?game=1`} />
      }
    </div>
  );
};

export default Instructions;
