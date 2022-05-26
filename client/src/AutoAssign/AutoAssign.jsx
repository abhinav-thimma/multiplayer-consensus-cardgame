import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import "./AutoAssign.css";

const AutoAssign = () => {
  const [roomid, setRoomid] = useState(null);
  const playerNumber = Math.floor(Math.random() * 100000);
  const handleJoinButtonClick = () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    fetch('http://localhost:4000/assignroom', options)
      .then(response => response.json())
      .then(data => setRoomid(data.room));
  };

  return (
    <div className="main-container">
      <div>
        <p style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '35px' }}>Making Health Decisions with Artificial Intelligent Aids</p>
        <br />
        <p>Welcome to participate in a voluntary research study. The purpose of this study is to understand how people make health decisions with the assistance of artificial intelligence (AI) aids. Participating in this study will involve filling out surveys about your demographic information, make health decisions with AI aids, and fill out surveys about your thoughts about the AI aids. Your participation will last 60 to 80 minutes. Risks related to this research include minor fatigue; benefits related to this research include advancing our understandings about the use of AI aids for health decision making.</p>
        <br />

        <p>Principal Investigator Name and Title: Jessie Chin, Assistant Professor </p>
        <p>Department and Institution: Information Sciences, University of Illinois at Urbana-Champaign </p>
        <p>Contact Information: chin5@illinois.edu </p>

        <p style={{ fontWeight: 'bold' }}>What procedures are involved? </p><br />
        <p>The study procedure includes filling out online surveys, and participating in an online experiment to make health decisions based on given health information and decision-making aids. The study will last 60 to 80 minutes.</p>

        <p style={{ fontWeight: 'bold' }}>Will my study-related information be kept confidential? </p><br />
        <p>Faculty, students, and staff who may see your information will maintain confidentiality to the extent of laws and university policies. Personal identifiers will not be published or presented. </p><br />

        <p style={{ fontWeight: 'bold' }}>Will I be reimbursed for any expenses or paid for my participation in this research? </p><br />
        <p>After the completions of the study procedures, you will be paid with $15.  </p><br />

        <p style={{ fontWeight: 'bold' }}>Can I withdraw or be removed from the study? </p> <br />
        <p>If you decide to participate, you are free to withdraw your consent and discontinue participation at any time. Your participation in this research is voluntary. Your decision whether or not to participate, or to withdraw after beginning participation, will not affect your current or future dealings with the University of Illinois at Urbana-Champaign.  </p><br />

        <p style={{ fontWeight: 'bold' }}>Will data collected from me be used for any other research? </p><br />
        <p>Your personal information will not be used or distributed for future use, even if identifiers are removed. The de-identified transcript of the study could be used in the aggregate format for future research without additional informed consent. </p><br />

        <p style={{ fontWeight: 'bold' }}>Who should I contact if I have questions? </p><br />
        <p>Contact the researchers Jessie Chin, Assistant Professor in Information Sciences, at 217-333-0125 or chin5@illinois.edu if you have any questions about this study or your part in it, or if you have concerns or complaints about the research. </p><br />


        <p style={{ fontWeight: 'bold' }}>What are my rights as a research subject?  </p><br />
        <p>If you have any questions about your rights as a research subject, including concerns, complaints, or to offer input, you may call the Office for the Protection of Research Subjects (OPRS) at 217-333-2670 or e-mail OPRS at irb@illinois.edu. If you would like to complete a brief survey to provide OPRS feedback about your experiences as a research participant, please follow the link here or through a link on the OPRS website: https://oprs.research.illinois.edu/. You will have the option to provide feedback or concerns anonymously or you may provide your name and contact information for follow-up purposes.   </p><br />

        <p>Please print this consent form if you would like to retain a copy for your records. </p><br />

        <p>I have ready and understand the above consent form.I certify that I am 18 years old or older.By clicking the “Submit” button to enter the survey, I indicate my willingness to voluntarily take part in this study.</p>
      </div >
      <div style={{margin: 'auto'}}>
        <button className="enter-room-button" onClick={handleJoinButtonClick}>
          Consent and Join Room
        </button>
      </div>
      {roomid &&
        <Redirect to={`/demographic/${roomid}/${playerNumber}`} />
      }
    </div>
  );
};

export default AutoAssign;
