import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Card as BootstrapCard } from 'react-bootstrap';

import useChat from "../useChat";
import Card from "../Card/Card.jsx";
import Survey from "../Survey/Survey";

import "./Room.css";


// const timeout = (delay) => {
//   return new Promise( res => setTimeout(res, delay) );
// };

// let prevRound = 1;
const Room = (props) => {
  
  const { roomId } = props.match.params;
  const [ prevRound, setPrevRound ] = useState(1);
  const { messages, round, members, player_number, sendMessage } = useChat(roomId);
  const cards = [{ "name": "Card 1" }, { "name": "Card 2" }, { "name": "Card 3" }];
  // if(prevRound != round) {
  //   console.log(round);
  //   prevRound = round;
  //   flag = true;
  //   // return (<Redirect to="/" />);
  // } else {
  //   flag = false;
  // }

  const handleSendMessage = (cardName) => {
      sendMessage(cardName + " was shared", round);
  };

  const goToSurveyPage = () => {
    console.log(messages);
    setTimeout(() => {} , 1000);
    return <Survey setPrevRound={setPrevRound} round = {round}/>
  };

  return (
    <div>
      <Row>
        <Col>
          <h2 className="title">Room: {roomId}</h2>
          <h2 className="title">Round: {round}</h2>
          <h2 className="title">Player: {player_number}</h2>
          {prevRound !== round && goToSurveyPage()}
        </Col>
        <Col>
          <Row><h3 className="title">Members:</h3></Row>
          <Row>
            <BootstrapCard  style={{ width: '300px', zIndex: -1}}>
              <ul>
                {members.map((member, i) => (
                  <li>{'Player' + member['number']}</li>
                ))}
              </ul>
            </BootstrapCard>
          </Row>
        </Col>
      </Row>

      <div className="chat-room-container">
        <div className="messages-container">
          <ol className="messages-list">
            {messages && messages.map((message, i) => (
              <Card key={i} owner={message.ownedByCurrentUser} body = {message.body}/>
            ))}
          </ol>
        </div>
        <div className="user-card-view">
          <div className="curr-round-card-holder">
          <ul className="hor-messages-list">
            {messages.slice(Math.max(messages.length - 4, 0)).map((message, i) => (
              <div>
                <Card key={i} owner={message.ownedByCurrentUser} body = {message.body}/>
              </div>
            ))}
          </ul>
          </div>
          <div className="card-container">
            <h2>My Cards</h2>
            {
              cards.map((card) => (
                <button onClick={() => handleSendMessage(card.name)} className="send-message-button">
                  {card.name}
                </button>
              ))
            }
          </div>
        </div>

      </div>
    </div>
  );
};

export default Room;
