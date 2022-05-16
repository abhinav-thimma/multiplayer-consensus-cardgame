import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

import "./Demographic.css";

const Demographic = (props) => {
  let history = useHistory();
  const { roomId, playerNumber } = props.match.params;
  const [ validated, setValidated ] = useState(false);

  const [dob, setDob] = useState();
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState("female");
  const [nativespeaker, setNativeSpeaker] = useState("1");
  const [firstLan, setFirstLan] = useState("");
  const [engAcqAge, setEngAcqAge] = useState(0);
  const [hispOrLatino, setHispOrLatino] = useState("2");
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

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      let ethn = ethnicity;
      console.log(hispOrLatino);
      if(hispOrLatino === "1") {
        ethn = "Hispanic or Latino";
      }
      let request = {
        "roomid": roomId,
        "player_num":  "Player " + playerNumber,
        "dob": dob,
        "age": parseInt(age),
        "gender": gender,
        "native_eng": parseInt(nativespeaker),
        "first_lan": firstLan,
        "eng_acq_age": parseInt(engAcqAge),
        "ethnicity": ethn
      };

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      };
      fetch('http://127.0.0.1:5000/demographic', options)
        .then(response => response.json())
        .then(data => console.log(data));

      console.log(request);
      history.push(`/room/${roomId}/${playerNumber}`);
    }

    setValidated(true);
  };

  return (
    <div className="demo-container">
      <h2> Demographic information </h2>

      <br/>
      <h4>Please answer the following questions:</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="Form.ControlInput1">
          <Form.Label>Date of birth: </Form.Label>
          <Form.Control type="date" name='date_of_birth'  onChange={handleDobChange} required/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="Form.ControlInput2">
          <Form.Label>Age: </Form.Label>
          <Form.Control type="number" name='age' onChange={handleAgeChange} required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="Form.ControlInput3">
          <Form.Label>Gender: </Form.Label>
          <Form.Select aria-label="Gender select" value={gender} onChange={handleGenderChange} required>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="Form.ControlInput3">
          <Form.Label>Are you a native english speaker? </Form.Label>
          <Form.Select aria-label="English select" onChange={handleNativeSpeakerChange} value={nativespeaker} required>
            <option value="1">Yes</option>
            <option value="2">No</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="Form.ControlInput2">
          <Form.Label>What is your first language? </Form.Label>
          <Form.Control type="text" name='first_lan'  onChange={handleFirstLanChange} required/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="Form.ControlInput2">
          <Form.Label>What age did you begin to acquire English? </Form.Label>
          <Form.Control type="number" name='age_eng' onChange={handleEngAcqAgeChange} required/>
        </Form.Group>


        <Form.Group className="mb-3" controlId="Form.ControlInput3">
          <Form.Label>Are you a Hispanic or Latino? </Form.Label>
          <Form.Select aria-label="Hispanic select" onChange={handleHispOrLatinoChange} value={hispOrLatino} required>
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
        <Button type="submit">Submit form</Button>


      </Form>
    </div>
  );
};

export default Demographic;
