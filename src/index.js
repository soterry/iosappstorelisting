import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';

ReactDOM.render(
  <Provider store={store}>
    <App totalTopGrossingAppsCount="10" totalTopFreeAppsCount="100" topFreeAppsPerPage="10" />
  </Provider>,
  document.getElementById('root')
);
