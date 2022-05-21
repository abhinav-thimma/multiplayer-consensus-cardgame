import React from "react";
import { useHistory } from "react-router-dom";
import { Form, Button, Row, Card } from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';
import "./SurveyPage.css";

const SurveyPage = (props) => {
  let history = useHistory();
  const { roomId, playerNumber } = props.match.params;

  let gameNum = parseInt(props.location.state.game);
  let round = props.location.state.round;
  let cardMessage = props.location.state.card;
  let finalGame = props.location.state.finalGame;
  let feedbackQuestions = props.location.state.feedbackQuestions;
  let gameEndQuestions = props.location.state.gameEndQuestions;
  console.log(`game number: ${gameNum}`)

  const [q1, setQ1] = React.useState(0);
  const [q2, setQ2] = React.useState(0);
  const [geq1, setGEQ1] = React.useState(0);
  const [geq2, setGEQ2] = React.useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    const sendSurveyData = (req) => {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req),
      };
      fetch('http://127.0.0.1:5000/survey', options)
        .then(response => response.json())
        .then(data => console.log(data));
    };

    let request = {
      "roomid": roomId,
      "game_num": gameNum,
      "round_num": round,
      "player_num": "Player " + playerNumber,
      "q1_res": q1,
      "q2_res": q2,
      "game_end": false
    };
    sendSurveyData(request);

    request = {
      "roomid": roomId,
      "game_num": gameNum,
      "round_num": round,
      "player_num": "Player " + playerNumber,
      "q1_res": geq1,
      "q2_res": geq2,
      "game_end": true
    };
    sendSurveyData(request);

    console.log(request);
    if (!finalGame) {
      history.push(`/room/${roomId}/${playerNumber}?game=${gameNum + 1}`);
    } else {
      history.push('/thanks');
    }
  };

  return (
    <div style={{ justifyContent: "center", alignItems: "center" }}>
      <div className="center-div">
        <h3>Please share you opinion on the last round and the game</h3>
      </div>
      <div className="box">
        <Form>
          <Row>
            <Card body style={{ width: '40%', left: '25%', height: '200px', backgroundColor: '#31a24c', color: "white", }}>{cardMessage}</Card>
          </Row>
          <Form.Label>Please enter your opinion about the card above</Form.Label>
          <Form.Group className="mb-3" controlId="q1">
            <Form.Label>{feedbackQuestions[0]}</Form.Label><br />
            <span style={{ display: "inline-block" }}>
              <span style={{ display: "inline-block" }}>0</span>
              <span style={{ display: "inline-block", margin: "10px" }}>
                <RangeSlider
                  value={q1}
                  onChange={e => setQ1(e.target.value)}
                />
              </span>
              <span style={{ display: "inline-block" }}>100</span>
            </span>
          </Form.Group>
          <Form.Group className="mb-3" controlId="q2">
            <Form.Label>{feedbackQuestions[1]}</Form.Label><br />
            <span style={{ display: "inline-block" }}>
              <span style={{ display: "inline-block" }}>0</span>
              <span style={{ display: "inline-block", margin: "10px" }}>
                <RangeSlider
                  value={q2}
                  onChange={e => setQ2(e.target.value)}
                />
              </span>
              <span style={{ display: "inline-block" }}>100</span>
            </span>
          </Form.Group>
        </Form>
      </div>
      <div className="box">
        <Form>
          <Form.Label>Please enter your opinion about the Game</Form.Label>
          <Form.Group className="mb-3" controlId="q1">
            <Form.Label>{gameEndQuestions[0]}</Form.Label><br />
            <span style={{ display: "inline-block" }}>
              <span style={{ display: "inline-block" }}>0</span>
              <span style={{ display: "inline-block", margin: "10px" }}>
                <RangeSlider
                  value={geq1}
                  onChange={e => setGEQ1(e.target.value)}
                />
              </span>
              <span style={{ display: "inline-block" }}>100</span>
            </span>
          </Form.Group>
          <Form.Group className="mb-3" controlId="q2">
            <Form.Label>{gameEndQuestions[1]}</Form.Label><br />
            <span style={{ display: "inline-block" }}>
              <span style={{ display: "inline-block" }}>0</span>
              <span style={{ display: "inline-block", margin: "10px" }}>
                <RangeSlider
                  value={geq2}
                  onChange={e => setGEQ2(e.target.value)}
                />
              </span>
              <span style={{ display: "inline-block" }}>100</span>
            </span>
          </Form.Group>
        </Form>
      </div>
      <div className="center-div">
        <Button variant="primary" type="submit" onClick={(e) => handleSubmit(e)}>
          Submit Responses
        </Button>
      </div>
    </div>
  );
};

export default SurveyPage;
