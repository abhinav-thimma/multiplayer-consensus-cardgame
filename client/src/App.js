import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import "./index.css";
import Home from "./Home/Home";
import Room from "./Room/Room";
import EndPage from "./EndPage/EndPage";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/room/:roomId" component={Room} />
        <Route exact path="/thanks" component={EndPage} />
      </Switch>
    </Router>
  );
}

export default App;
