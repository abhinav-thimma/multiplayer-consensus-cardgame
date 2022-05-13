import React, {useState} from "react";
import {Link} from "react-router-dom";
import { Form } from "react-bootstrap";

import "./Demographic.css";

const Demographic = (props) => {
  const { roomId, playerNumber } = props.match.params;

  const [dob, setDob] = useState();
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState("1");
  const [nativespeaker, setNativeSpeaker] = useState("1");
  const [firstLan, setFirstLan] = useState("");
  const [engAcqAge, setEngAcqAge] = useState(0);
  const [hispOrLatino, setHispOrLatino] = useState("1");
  const [ethnicity, setEthnicity] = useState("Native American/Alaska Native");

  const handleDobChange = (event) => {
    setDob(event.target.value);
  };
  const handleAgeChange = (event) => {
    setAge(event.target.value);
  };
  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };
  const handleNativeSpeakerChange = (event) => {
    setNativeSpeaker(event.target.value);
  };
  const handleFirstLanChange = (event) => {
    setFirstLan(event.target.value);
  };
  const handleEngAcqAgeChange = (event) => {
    setEngAcqAge(event.target.value);
  };
  const handleHispOrLatinoChange = (event) => {
    setHispOrLatino(event.target.value);
  };
  const handleEthnicityChange = (event) => {
    setEthnicity(event.target.value);
  };
  const handleJoinRoom = (e) => {
    e.preventDefault();
    console.log(dob);
    console.log(age);
    console.log(gender);
    console.log(nativespeaker);
    console.log(firstLan);
    console.log(engAcqAge);
    console.log(hispOrLatino);
    console.log(ethnicity);
  }

  return (
    <div className="demo-container">
      <h2> Demographic information </h2>

      <br/>
      <h4>Please answer the following questions:</h4>
      <Form>
        <Form.Group className="mb-3" controlId="Form.ControlInput1">
          <Form.Label>Date of birth: </Form.Label>
          <Form.Control type="date" name='date_of_birth'  onChange={handleDobChange}/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="Form.ControlInput2">
          <Form.Label>Age: </Form.Label>
          <Form.Control type="number" name='age' onChange={handleAgeChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="Form.ControlInput3">
          <Form.Label>Gender: </Form.Label>
          <Form.Select aria-label="Gender select" value={gender} onChange={handleGenderChange}>
            <option value="1">Female</option>
            <option value="2">Male</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="Form.ControlInput3">
          <Form.Label>Are you a native english speaker? </Form.Label>
          <Form.Select aria-label="English select" onChange={handleNativeSpeakerChange} value={nativespeaker}>
            <option value="1">Yes</option>
            <option value="2">No</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="Form.ControlInput2">
          <Form.Label>What is your first language? </Form.Label>
          <Form.Control type="text" name='first_lan'  onChange={handleFirstLanChange}/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="Form.ControlInput2">
          <Form.Label>What age did you begin to acquire English? </Form.Label>
          <Form.Control type="number" name='age_eng' onChange={handleEngAcqAgeChange} />
        </Form.Group>


        <Form.Group className="mb-3" controlId="Form.ControlInput3">
          <Form.Label>Are you a Hispanic or Latino? </Form.Label>
          <Form.Select aria-label="Hispanic select" onChange={handleHispOrLatinoChange} value={hispOrLatino}>
            <option value="1">Yes</option>
            <option value="2">No</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="Form.ControlInput3">
          <Form.Label>Please check one of the following ethnic or racial categories that best describe you: </Form.Label>
          <Form.Select aria-label="Ethnicity select" onChange={handleEthnicityChange} value={ethnicity}>
            <option value="Native American/Alaska Native">Native American/Alaska Native</option>
            <option value="Asian">Asian</option>
            <option value="Native Hawaiian or Other Pacific Islander">Native Hawaiian or Other Pacific Islander</option>
            <option value="Black or African American">Black or African American</option>
            <option value="White or Caucasian">White or Caucasian</option>
            <option value="Multiple categories">Multiple categories</option>
          </Form.Select>
        </Form.Group>
        <br/>

      <Link to={`/room/${roomId}/${playerNumber}`}  className="enter-room-button">
        Join room
      </Link>

      </Form>
    </div>
  );
};

export default Demographic;
