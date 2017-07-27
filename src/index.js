import 'webrtc-adapter';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import ChatRoulette from './chatroulette';
import 'typeface-roboto';
import './index.css';
import '@material/typography/dist/mdc.typography.css';
import { MuiThemeProvider } from 'material-ui/styles';

import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDOM.render((
  <Provider store={store}>
	<MuiThemeProvider>
		<ChatRoulette />
	</MuiThemeProvider>
  </Provider>
), document.getElementById('root'));
