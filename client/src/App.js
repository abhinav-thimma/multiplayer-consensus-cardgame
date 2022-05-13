import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import "./index.css";
import Home from "./Home/Home";
import Room from "./Room/Room";
import Demographic from "./Demographic/Demographic";
import EndPage from "./EndPage/EndPage";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/room/:roomId/:playerNumber" component={Room} />
        <Route exact path="/thanks" component={EndPage} />
        <Route exact path="/demographic/:roomId/:playerNumber" component={Demographic} />
      </Switch>
    </Router>
  );
}

export default App;
