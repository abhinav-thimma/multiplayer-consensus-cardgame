import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import "./index.css";
import Home from "./Home/Home";
import Room from "./Room/Room";
import Survey from "./Survey/Survey";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/:roomId" component={Room} />
        {/* <Route exact path="/:roomId/survey" component={Survey} /> */}
      </Switch>
    </Router>
  );
}

export default App;
