import {
	TOGGLE_MUTE_LOCAL_AUDIO, 
	TOGGLE_MUTE_LOCAL_VIDEO, 
	START_LOCAL_VIDEO,
	CREATE_OFFER,
	RECEIVE_OFFER,
	RECEIVE_ANSWER,
	SETUP_REMOTE_VIDEO_ELEMENT,
	SEND_ICE_CANDIDATE,
	RECEIVE_ICE_CANDIDATE,
	REMOTE_HANGUP,
	TOGGLE_SEARCH,
	SEARCH_NEXT,
	SIGNALING_DISCONNECT,
	SELECT_VIDEO_DEVICE,
	SELECT_AUDIO_DEVICE
} from './actions';
import Grymer from './chatroulette/session';
import Store from 'store';

export default socket => store => next => action => {
	const state = store.getState();
	
	console.log(action.type);
	
	switch(action.type) {
		case TOGGLE_SEARCH:
			if(state.isSearching) {
				Grymer.close();
			}
			next(action);
			break;
		case CREATE_OFFER:
			Grymer._onInitiateOffer().then(sdp => {
				socket.emit('offer-created', sdp);
			});
			break;
		case RECEIVE_OFFER:
			Grymer._onReceiveOffer(action.offer).then(sdp => {
				socket.emit('answer-created', sdp);
			});
			break;
		case RECEIVE_ANSWER:
			Grymer._onReceiveAnswer(action.answer);
			break;
		case TOGGLE_MUTE_LOCAL_AUDIO:
			Grymer.toggleLocalAudio();
			Store.set('muteLocalAudio', !state.muteLocalAudio);
			next(action);
			break;
		case TOGGLE_MUTE_LOCAL_VIDEO:
			Grymer.toggleLocalVideo();
			Store.set('muteLocalVideo', !state.muteLocalVideo);
			next(action);
			break;
		case START_LOCAL_VIDEO:
			Grymer.setLocalVideoElement(action.videoEl);
			Grymer.startLocalVideo({
				muteLocalAudio: state.muteLocalAudio,
				muteLocalVideo: state.muteLocalVideo,
				audioDevice: state.selectedAudioDevice,
				videoDevice: state.selectedVideoDevice
			});
			break;
		case SELECT_VIDEO_DEVICE:
			Store.set('selectedVideoDevice', action.deviceId);
			Grymer.startLocalVideo({
				muteLocalAudio: state.muteLocalAudio,
				muteLocalVideo: state.muteLocalVideo,
				audioDevice: state.selectedAudioDevice,
				videoDevice: action.deviceId,
			});
			next(action);
			break;
		case SELECT_AUDIO_DEVICE:
			Store.set('selectedAudioDevice', action.deviceId);
			Grymer.startLocalVideo({
				muteLocalAudio: state.muteLocalAudio,
				muteLocalVideo: state.muteLocalVideo,
				audioDevice: action.deviceId,
				videoDevice: state.selectedVideoDevice,
			});
			next(action);
			break;
		case SETUP_REMOTE_VIDEO_ELEMENT:
			Grymer.setRemoteVideoElement(action.videoEl);
			break;
		case SEND_ICE_CANDIDATE:
			socket.emit('ice-candidate', action.candidate);
			break;
		case RECEIVE_ICE_CANDIDATE:
			Grymer._onReceiveIceCandidate(action.candidate);
			break;
			
		case SIGNALING_DISCONNECT:
		case SEARCH_NEXT:
		case REMOTE_HANGUP:
			Grymer.close();
			next(action);
			break;
		default:
			next(action);
	}
};