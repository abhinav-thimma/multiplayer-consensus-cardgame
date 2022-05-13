import React from "react";
import {Link} from "react-router-dom";

import "./Home.css";

const Home = () => {
  const [roomName, setRoomName] = React.useState("");
  const playerNumber = Math.floor(Math.random() * 100000);

  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value);
  };

  return (
    <div className="home-container">
      <input
        type="text"
        placeholder="Room"
        value={roomName}
        onChange={handleRoomNameChange}
        className="text-input-field"
      />
      <Link to={`/demographic/${roomName}/${playerNumber}`}  className="enter-room-button">
        Join room
      </Link>
    </div>
  );
};

export default Home;
