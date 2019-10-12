import React from 'react';
import ReactDOM from 'react-dom';
import App from './views/index';
import registerServiceWorker from './registerServiceWorker';
import './assets/stylesheets/index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

let theme = createMuiTheme();
theme = responsiveFontSizes(theme);


ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>,
  document.getElementById('root')
);
registerServiceWorker();
