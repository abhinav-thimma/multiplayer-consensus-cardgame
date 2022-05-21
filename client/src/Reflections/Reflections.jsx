import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import RangeSlider from 'react-bootstrap-range-slider';

import "./Reflections.css";

const Reflections = (props) => {
  let history = useHistory();
  let members = props.location.state.members;
  let currentPlayer = props.location.state.currentPlayer;

  const [ validated, setValidated ] = useState(false);

  const [ descisionQues, setDescisionQues ] = useState();
  const [ playerSelect, setPlayerSelect ] = useState(0);
  const [ otherGrp, setOtherGrp ] = React.useState(0);
  const [ judgement, setJudgement ] = React.useState(0);
  const [ originalDec, setOriginalDec ] = React.useState(0);
  const [ teamwork, setTeamwork ] = React.useState(0);

  const handleDescisionQuesChange = (event) => {
    setDescisionQues(event.target.value);
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {

    }
    setValidated(true);
    history.push('/thanks');
  };

  return (
    <div className="demo-container">
      <h2> Reflections Questionnaire </h2>

      <br />
      <h4>Please answer the following questions:</h4>
      <Form onSubmit={handleSubmit}>

        <Form.Group className="mb-3" controlId="Form.ControlInput3">
          <Form.Label>Which of the following players do you find trustworthy? </Form.Label>
          <Form.Select aria-label="Player select" onChange={e => setPlayerSelect(e.target.value)} value={playerSelect} required>
            { members.map((member, index) => {
                if (member['number'] !== currentPlayer) {
                  return (
                    <option key={index} value={member.player_num}>
                      {'Player ' + member['number']}
                    </option>
                  );
                }
              }
            )}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="q1">
          <Form.Label>How did you find the information you learned from other group members helpful? (0 = not at all, 100 = very much)</Form.Label><br />
          <span style={{ display: "inline-block" }}>
            <span style={{ display: "inline-block" }}>0</span>
            <span style={{ display: "inline-block", margin: "10px" }}>
              <RangeSlider
                value={otherGrp}
                onChange={e => setOtherGrp(e.target.value)}
              />
            </span>
            <span style={{ display: "inline-block" }}>100</span>
          </span>
        </Form.Group>

        <Form.Group className="mb-3" controlId="q1">
          <Form.Label>How much did you rely on the information you are having rather than the information you received from others to make the judgment? (0 = completely self, 100 = completely others)</Form.Label><br />
          <span style={{ display: "inline-block" }}>
            <span style={{ display: "inline-block" }}>0</span>
            <span style={{ display: "inline-block", margin: "10px" }}>
              <RangeSlider
                value={judgement}
                onChange={e => setJudgement(e.target.value)}
              />
            </span>
            <span style={{ display: "inline-block" }}>100</span>
          </span>
        </Form.Group>

        <Form.Group className="mb-3" controlId="q1">
          <Form.Label>How much did you change your original decisions based on the information you learned? (0 = not at all, 100 = very much)</Form.Label><br />
          <span style={{ display: "inline-block" }}>
            <span style={{ display: "inline-block" }}>0</span>
            <span style={{ display: "inline-block", margin: "10px" }}>
              <RangeSlider
                value={originalDec}
                onChange={e => setOriginalDec(e.target.value)}
              />
            </span>
            <span style={{ display: "inline-block" }}>100</span>
          </span>
        </Form.Group>

        <Form.Group className="mb-3" controlId="q1">
          <Form.Label>How did you find the teamwork successful? (0 = not at all, 10 = very much)</Form.Label><br />
          <span style={{ display: "inline-block" }}>
            <span style={{ display: "inline-block" }}>0</span>
            <span style={{ display: "inline-block", margin: "10px" }}>
              <RangeSlider
                value={teamwork}
                onChange={e => setTeamwork(e.target.value)}
              />
            </span>
            <span style={{ display: "inline-block" }}>100</span>
          </span>
        </Form.Group>

        <Form.Group className="mb-3" controlId="Form.ControlInput2">
          <Form.Label>Please share with us how you make the final decision? </Form.Label>
          <Form.Control as="textarea" rows={3} name='decision_q' onChange={handleDescisionQuesChange} required />
        </Form.Group>

        <Button type="submit">Submit form</Button>
      </Form>
    </div >
  );
};

export default Reflections;
