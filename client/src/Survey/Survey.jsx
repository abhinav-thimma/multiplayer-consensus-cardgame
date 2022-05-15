import React, { useEffect, useState } from "react";
import { Form, Button, Row, Card } from 'react-bootstrap';
import CardConfig from '../CardConfig.json';

import "./Survey.css";

const Survey = (props) => {
  let { setPrevRound, round, cardMessage } = props
  const [show, setShow] = useState(false);
  const cards = CardConfig.cards;

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 5000);
  }, [setShow]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setPrevRound(round);
  };

  if (!show) return null;

  return (
    <div className="box">
      <Form>
        <Row>
          <Card body style={{ width: '40%', left: '25%', height: '200px', backgroundColor: '#31a24c', color: "white", }}>{cardMessage}</Card>
        </Row>
        <Form.Label>Please enter your opinion about the card above</Form.Label>
        <Form.Group className="mb-3" controlId="d1">
          <Form.Label>How novel was the information provided by this card?</Form.Label>
          <Form.Range />
        </Form.Group>
        <Form.Group className="mb-3" controlId="d2">
          <Form.Label>How useful was the information provided by this card?</Form.Label>
          <Form.Range />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={(e) => handleSubmit(e)}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default Survey;
