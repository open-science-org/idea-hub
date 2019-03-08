import React, { Component } from "react";
import Intro from "./components/Intro";
import Dashboard from "./components/Dashboard";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App medium-padding">
        <Intro />
      </div>
    );
  }
}

export default App;
