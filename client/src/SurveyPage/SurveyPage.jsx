import React from "react";
import { useHistory } from "react-router-dom";
import { Form, Button, Row, Card } from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';
import CardConfig from '../CardConfig.json';

import "./SurveyPage.css";

const SurveyPage = (props) => {
  let history = useHistory();
  const { roomId, playerNumber } = props.match.params;

  let gameNum = parseInt(props.location.state.game);
  let round = props.location.state.round;
  let cardMessage = props.location.state.card;
  let finalGame = props.location.state.finalGame;
  console.log(`game number: ${gameNum}`)

  const [ q1, setQ1 ] = React.useState(0);
  const [ q2, setQ2 ] = React.useState(0);
  const cards = CardConfig.cards;

  const handleSubmit = (event) => {
    event.preventDefault();
    let request = {
      "roomid": roomId,
      "game_num": gameNum,
      "round_num": round,
      "player_num": "Player " + playerNumber,
      "q1_res": q1,
      "q2_res": q2
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    };
    fetch('http://127.0.0.1:5000/survey', options)
      .then(response => response.json())
      .then(data => console.log(data));

    console.log(request);
    if(!finalGame) {
      history.push(`/room/${roomId}/${playerNumber}?game=${gameNum + 1}`);
    } else {
      history.push('/thanks');
    }
  };

  return (
    <div className="box">
      <Form>
        <Row>
          <Card body style={{ width: '40%', left: '25%', height: '200px', backgroundColor: '#31a24c', color: "white", }}>{cardMessage}</Card>
        </Row>
        <Form.Label>Please enter your opinion about the card above</Form.Label>
        <Form.Group className="mb-3" controlId="q1">
          <Form.Label>How novel was the information provided by this card?</Form.Label><br/>
          <RangeSlider
            value={q1}
            onChange={e => setQ1(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="q2">
          <Form.Label>How useful was the information provided by this card?</Form.Label><br/>
          <RangeSlider
            value={q2}
            onChange={e => setQ2(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={(e) => handleSubmit(e)}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default SurveyPage;
