import React from 'react';
import Login from './components/login.js';
import Registration from './components/registration.js';
import UserView from './components/userview.js';
import { Switch, Route } from 'react-router-dom';


class Routes extends React.Component {
  componentDidMount() {
    console.log('ROUTES MOUNTED BOIZ');
  }
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/registration" component={Registration} />
        <Route exact path="/userview" component={UserView} />
      </Switch>
    );
  }
}


export default Routes;
