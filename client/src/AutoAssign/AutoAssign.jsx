import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import "./AutoAssign.css";

const AutoAssign = () => {
  const [ roomid, setRoomid ] = useState(null);
  const playerNumber = Math.floor(Math.random() * 100000);
  const handleJoinButtonClick = () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    fetch('http://localhost:4000/assignroom', options)
      .then(response => response.json())
      .then(data => setRoomid(data.room));
  };

  return (
    <div className="home-container">
      <button className="enter-room-button" onClick={handleJoinButtonClick}>
        Join Room
      </button>
      {roomid &&
        <Redirect to={`/demographic/${roomid}/${playerNumber}`} />
      }
    </div>
  );
};

export default AutoAssign;
