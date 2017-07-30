import React from 'react';
import { render } from 'react-dom';
import Routes from './routes.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { HashRouter } from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

require('./css/main.css');

render(
  <MuiThemeProvider><HashRouter><Routes /></HashRouter></MuiThemeProvider>,
   document.getElementById('root'));
