import React, { ReactElement } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './App.scss';

import { Navbar } from './Navbar';
import { Home } from './Home';
import { Login } from './Login';
import { Manual } from './Manual';

const App: React.FC = (): ReactElement => {
  return (
    <Router>
      <Navbar />

      <Route path="/" exact component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/manual" component={Manual} />
    </Router>
  );
};

export default App;
