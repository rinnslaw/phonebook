import React from 'react';
import { Route } from 'react-router-dom';
import { ConnectedSwitch } from 'reactRouterConnected';
import phoneBook from 'pages/phoneBook';

class Routes extends React.Component {
    render() {
      return (
        <ConnectedSwitch>
          <Route exact path="/" component={phoneBook} />
          <Route exact path="/phoneBook/" component={phoneBook} />
        </ConnectedSwitch>
      );
    }
  }
 
  export default Routes;
  