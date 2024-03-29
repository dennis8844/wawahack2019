import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './views/index';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>,
    div
  );
});
