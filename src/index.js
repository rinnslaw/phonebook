import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import reducer from './ducks';
import 'resources/styles/_main.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';

const createHistory = require("history").createHashHistory;
const history = createHistory();
const router = routerMiddleware(history);
const middlewares = [router, thunk];
const isLogger = true;
if (isLogger && process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');
  middlewares.push(logger);
}
const store = createStore(reducer, composeWithDevTools(applyMiddleware(...middlewares)));

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history} >
            <App />
        </ConnectedRouter>
    </Provider>, 
    document.getElementById('root')
);

serviceWorker.unregister();
