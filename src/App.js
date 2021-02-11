import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Main from "./features/main/Main";
import "./App.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <Main />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
