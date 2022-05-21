import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import "./index.css";
import Home from "./Home/Home";
import Room from "./Room/Room";
import Demographic from "./Demographic/Demographic";
import EndPage from "./EndPage/EndPage";
import SurveyPage from "./SurveyPage/SurveyPage";
import AutoAssign from "./AutoAssign/AutoAssign";
import Instructions from "./Instructions/Instructions";
import Reflections from "./Reflections/Reflections";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={AutoAssign} />
        <Route exact path="/reflections" component={Reflections} />
        <Route exact path="/instructions/:roomId/:playerNumber" component={Instructions} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/room/:roomId/:playerNumber" component={Room} />
        <Route exact path="/thanks" component={EndPage} />
        <Route exact path="/demographic/:roomId/:playerNumber" component={Demographic} />
        <Route exact path="/surveypage/:roomId/:playerNumber" component={SurveyPage} />
      </Switch>
    </Router>
  );
}

export default App;
