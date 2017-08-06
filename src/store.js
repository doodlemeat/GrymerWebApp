import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import createSocketIoMiddleware from 'redux-socket.io';
import { composeWithDevTools } from 'redux-devtools-extension'
import reducer from './reducers/reducer';
import io from 'socket.io-client';
import Store from 'store';
import ChatRouletteMiddleware from './chatroulette-middleware';
import { sendICECandidate, receiveRemoteStream, receiveLocalVideoSize, SIGNALING_DISCONNECT, SIGNALING_CONNECT } from './actions';
import Grymer from './chatroulette/session';

const env = process.env.NODE_ENV === 'development' ? 'dev.' : '';

const socket = io(`https://${env}signaling.grymer.se`);

const socketIoMiddleware = createSocketIoMiddleware(socket, 'server/');

Grymer.getIceServers();

const initialState = {
	messages: [],
	isSearching: false,
	hasPartner: false,
	hasSignalingConnection: false,
	isChatDrawerOpen: false,
	hasUnreadMessages: false,
	lastReceiveMessage: null,
	muteLocalAudio: Store.get('muteLocalAudio') || false,
	muteLocalVideo: Store.get('muteLocalVideo') || false
};

const middleware = applyMiddleware(thunk, socketIoMiddleware, ChatRouletteMiddleware(socket));

const store = createStore(reducer, initialState, composeWithDevTools(middleware));

socket.on('connect', () => {
	store.dispatch({ type: SIGNALING_CONNECT });
});

socket.on('disconnect', () => {
	store.dispatch({ type: SIGNALING_DISCONNECT });
});

Grymer.on('local-video-dimensions', (videoWidth, videoHeight) => {
	store.dispatch(receiveLocalVideoSize(videoWidth, videoHeight));
});

Grymer.on('ice-candidate', candidate => {
	store.dispatch(sendICECandidate(candidate));
});

Grymer.on('remote-stream', () => {
	store.dispatch(receiveRemoteStream());
});

export default store;
