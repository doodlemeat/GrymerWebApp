export const CHAT_MESSAGE = 'server/CHAT_MESSAGE';
export const SEND_ICE_CANDIDATE = 'server/SEND_ICE_CANDIDATE';
export const RECEIVE_ICE_CANDIDATE = 'RECEIVE_ICE_CANDIDATE';
export const CREATE_OFFER = 'CREATE_OFFER';
export const RECEIVE_OFFER = 'RECEIVE_OFFER';
export const ANSWER_CREATED = 'ANSWER_CREATED';
export const RECEIVE_ANSWER = 'RECEIVE_ANSWER';
export const TOGGLE_MUTE_LOCAL_AUDIO = 'TOGGLE_MUTE_LOCAL_AUDIO';
export const TOGGLE_MUTE_LOCAL_VIDEO = 'TOGGLE_MUTE_LOCAL_VIDEO';
export const START_LOCAL_VIDEO = 'START_LOCAL_VIDEO';
export const SETUP_REMOTE_VIDEO_ELEMENT = 'SETUP_REMOTE_VIDEO_ELEMENT';
export const TOGGLE_SEARCH = 'server/TOGGLE_SEARCH';
export const REMOTE_HANGUP = 'REMOTE_HANGUP'; 
export const RECEIVE_REMOTE_STREAM = 'RECEIVE_REMOTE_STREAM';
export const SEARCH_NEXT = 'server/SEARCH_NEXT';
export const SIGNALING_DISCONNECT = 'SIGNALING_DISCONNECT';
export const SIGNALING_CONNECT = 'SIGNALING_CONNECT';
export const RECEIVE_LOCAL_VIDEO_SIZE = 'RECEIVE_LOCAL_VIDEO_SIZE';
export const RECEIVE_CHAT_MESSAGE = 'RECEIVE_CHAT_MESSAGE';
export const TOGGLE_CHAT = 'TOGGLE_CHAT';
export const TOGGLE_CONTROL_PANEL = 'TOGGLE_CONTROL_PANEL';
export const SET_MEDIA_DEVICES = 'SET_MEDIA_DEVICES';
export const SELECT_AUDIO_DEVICE = 'SELECT_AUDIO_DEVICE';
export const SELECT_VIDEO_DEVICE = 'SELECT_VIDEO_DEVICE';

export const writeMessage = message => {
	return { 
		type: CHAT_MESSAGE, 
		message: { 
			from: 'me', 
			message: message 
		} 
	};
};

export const receiveLocalVideoSize = (width, height) => ({ type: RECEIVE_LOCAL_VIDEO_SIZE, width, height })
export const searchNext = () => ({ type: SEARCH_NEXT });
export const sendICECandidate = candidate => ({ type: SEND_ICE_CANDIDATE, candidate });
export const toggleMuteLocalAudio = () => ({ type: TOGGLE_MUTE_LOCAL_AUDIO });
export const toggleMuteLocalVideo = () => ({ type: TOGGLE_MUTE_LOCAL_VIDEO });
export const startLocalVideo = videoEl => ({ type: START_LOCAL_VIDEO, videoEl });
export const toggleSearch = () => ({ type: TOGGLE_SEARCH });
export const setupRemoteVideoElement = videoEl => ({ type: SETUP_REMOTE_VIDEO_ELEMENT, videoEl });
export const receiveRemoteStream = () => ({ type: RECEIVE_REMOTE_STREAM });

export const toggleChat = (force) => {
	if(typeof force !== 'boolean') {
		force = undefined;
	}
	
	return {
		type: TOGGLE_CHAT,
		force
	};
};

export const toggleControlPanel = (force) => {
	if(typeof force !== 'boolean') {
		force = undefined;
	}
	
	return {
		type: TOGGLE_CONTROL_PANEL,
		force
	};
};

export const setMediaDevices = (devices) => ({ type: SET_MEDIA_DEVICES, devices });
export const selectAudioDevice = (deviceId) => ({ type: SELECT_AUDIO_DEVICE, deviceId });
export const selectVideoDevice = (deviceId) => ({ type: SELECT_VIDEO_DEVICE, deviceId });