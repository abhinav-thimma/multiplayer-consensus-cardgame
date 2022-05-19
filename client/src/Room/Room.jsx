import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, Card as BootstrapCard } from 'react-bootstrap';
import Countdown, { zeroPad, CountdownApi } from "react-countdown";

import CardConfig from '../CardConfig.json';

import useChat from "../useChat";
import Card from "../Card/Card.jsx";
import Survey from "../Survey/Survey";

import "./Room.css";


const DEFAULT_CONFIG = {
  PLAYER_LIMIT_PER_ROOM: 4,
  ROUND_LIMIT: 2,
  GAME_LIMIT: 1,
  COUNTDOWN_DURATION: 60000
};
const COUNTDOWN_DURATION = 60000; // milliseconds
const countdownRenderer = ({ hours, minutes, seconds, completed }) => {
  return (
    <span>
      {zeroPad(minutes)}:{zeroPad(seconds)}
    </span>
  );
};

const Room = (props) => {
  let history = useHistory();

  let gameText = window.location.href.match(/game=\d/)[0];
  const gameNum = gameText.match(/\d/)[0];

  const { roomId, playerNumber } = props.match.params;
  const { messages, round, members, player_number, gameEnd, roomEnd, sendMessage } = useChat(roomId, playerNumber);
  const cards = CardConfig.cards;

  const [ CONFIG_MAP, setConfigMap ] = useState(null);
  let configMap = CONFIG_MAP ? CONFIG_MAP: DEFAULT_CONFIG;
  const [ prevRound, setPrevRound ] = useState(1);
  const [ countdownDuration, setCountdownDuration ] = useState(Date.now() + COUNTDOWN_DURATION);
  const [ resetCountdown, setResetCountdown ] = useState(false);

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    console.log(`config map: ${CONFIG_MAP}`)
    if (CONFIG_MAP == null) {
      fetch(`http://127.0.0.1:5000/roomConfig?roomId=${roomId}`, options)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          return data;
        })
        .then(data => setConfigMap(data));
    }
  }, [roomId])

  
  let countdownApi = null;
  const setCountdownRef = (countdown) => {
    if (countdown) {
      countdownApi = countdown.getApi();
    }
  };

  const handleCountdownEnd = () => {
    console.log('Sending default message');
    handleSendMessage(cards[0].name);
  };

  const setPrevroundAndResetTimer = (round) =>  { 
    setCountdownDuration(Date.now() + COUNTDOWN_DURATION);
    setPrevRound(round);
  }

  const handleSendMessage = (cardName) => {
    if(countdownApi) {
      countdownApi.pause();
    }
    const timeSpent = parseInt((COUNTDOWN_DURATION - countdownDuration + Date.now()) / 1000);
    let request = {
      "roomid": roomId,
      "game_num": gameNum,
      "round_num": round,
      "player_num": "Player " + playerNumber,
      "card_selected": cardName,
      "time_spent": timeSpent
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    };
    
    fetch('http://127.0.0.1:5000/moves', options)
      .then(response => response.json())
      .then(data => console.log(data));

    sendMessage(cardName + " was shared", round);
  };

  const goToSurveyPage = () => {
    console.log(messages);
    const message = messages[messages.length - 1].body.substring(0, 6);
    return (
      <div className="popup-box">
        <Survey setPrevroundAndResetTimer={setPrevroundAndResetTimer} round={round} cardMessage={message} roomId={roomId} playerNumber={playerNumber} gameNum = {gameNum}/>
      </div>
    );
  };

  if (roomEnd) {
    console.log('roomEnd');
    const message = messages[messages.length - 1].body.substring(0, 6);
    history.push(`/surveypage/${roomId}/${playerNumber}/?game=${gameNum}`, {"game": gameNum, "card": message, "round": round, finalGame: true});
  }

  if (gameEnd) {
    console.log('gameEnd');
    const message = messages[messages.length - 1].body.substring(0, 6);
    history.push(`/surveypage/${roomId}/${playerNumber}/?game=${gameNum}`, {"game": gameNum, "card": message, "round": round, finalGame: false});
  }

  let renderContent = (<div></div>);
  if (members.length < configMap.PLAYER_LIMIT_PER_ROOM) {
    renderContent = (
      <div className="member-lobby">
        <h2>Waiting for more players...</h2>
        <Col >
          <Row><h3 className="title">Members:</h3></Row>
          <Row>
            <BootstrapCard style={{ width: '400px', zIndex: -1 }}>
              <ul style={{padding: '10px'}}>
                {members.map((member, i) => (
                  <li>{'Player' + member['number']}</li>
                ))}
              </ul>
            </BootstrapCard>
          </Row>
        </Col>
      </div>
    );
  } else {

    if(resetCountdown === false) {
      setCountdownDuration(Date.now() + COUNTDOWN_DURATION);
      setResetCountdown(true);
    }
    renderContent = (
      <div>
        <Row>
          <Col>
            <h2 className="title">Room: {roomId}</h2>
            <h2 className="title">Round: {round}</h2>
            <h2 className="title">Player: {player_number}</h2>
            <h2 className="title">Game: {gameNum}</h2>
            <div>
              <h2 className="title">Time:
                <Countdown ref={setCountdownRef} date={countdownDuration} key={countdownDuration} renderer={countdownRenderer} onComplete={handleCountdownEnd} />
              </h2>
            </div>
            {prevRound !== round && goToSurveyPage()}
          </Col>
          <Col>
            <Row><h3 className="title">Members:</h3></Row>
            <Row>
              <BootstrapCard style={{ width: '300px', zIndex: -1 }}>
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
                <Card key={i} owner={message.ownedByCurrentUser} body={message.body} />
              ))}
            </ol>
          </div>
          <div className="user-card-view">
            <div className="curr-round-card-holder">
              <ul className="hor-messages-list">
                {messages.slice(Math.max(messages.length - configMap.PLAYER_LIMIT_PER_ROOM, 0)).map((message, i) => (
                  <div>
                    <Card key={i} owner={message.ownedByCurrentUser} body={message.body} />
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
  }

  return renderContent;
};

export default Room;
