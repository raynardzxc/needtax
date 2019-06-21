import React, { Component } from 'react';
import { Router, Route } from 'react-router-dom';

import history from './History';
import TaxCalculator from './containers/TaxCalculator/TaxCalculator';
import TaxReport from './containers/TaxReport/TaxReport';
import './App.css';

class App extends Component {
  render () {
    return (
      <Router history = {history}>
        <Route path="/" exact component={TaxCalculator}/>
        <Route path="/report" component={TaxReport}/>
      </Router>
    );
  }
}

export default App;
