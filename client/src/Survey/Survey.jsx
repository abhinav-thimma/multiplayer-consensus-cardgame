import React, { useEffect, useState } from "react";
import { Form, Button, Row, Card } from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';
import CardConfig from '../CardConfig.json';

import "./Survey.css";

const Survey = (props) => {
  let { setPrevroundAndResetTimer, round, cardMessage, roomId, playerNumber, gameNum, feedbackQuestions } = props
  const [show, setShow] = useState(false);
  const [ q1, setQ1 ] = React.useState(0);
  const [ q2, setQ2 ] = React.useState(0);
  const cards = CardConfig.cards;

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 5000);
  }, [setShow]);

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

    setPrevroundAndResetTimer(round);
  };

  if (!show) return null;

  return (
    <div className="box">
      <Form>
        <Row>
          <Card body style={{ width: '40%', left: '25%', height: '200px', backgroundColor: '#31a24c', color: "white", }}>{cardMessage}</Card>
        </Row>
        <Form.Label>Please enter your opinion about the card above</Form.Label>
        <Form.Group className="mb-3" controlId="q1">
          <Form.Label>{feedbackQuestions[0]}</Form.Label><br/>
          <RangeSlider
            value={q1}
            onChange={e => setQ1(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="q2">
          <Form.Label>{feedbackQuestions[1]}</Form.Label><br/>
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

export default Survey;
