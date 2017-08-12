import { 
	CHAT_MESSAGE, 
	TOGGLE_MUTE_LOCAL_AUDIO, 
	TOGGLE_MUTE_LOCAL_VIDEO,
	TOGGLE_SEARCH,
	REMOTE_HANGUP,
	RECEIVE_REMOTE_STREAM,
	SEARCH_NEXT,
	SIGNALING_DISCONNECT,
	SIGNALING_CONNECT,
	RECEIVE_CHAT_MESSAGE,
	TOGGLE_CHAT,
	TOGGLE_CONTROL_PANEL,
	SET_MEDIA_DEVICES,
	SELECT_AUDIO_DEVICE,
	SELECT_VIDEO_DEVICE
} from '../actions';

			
// only change selected devices if they are null ...
// ... since they can be stored in LS and we don't want to override a users choice
function setSelectedDevice(currentDevice, receivedDevices) {
	if(currentDevice) {
		return currentDevice;
	}
	
	if(receivedDevices.length === 0) {
		return null;
	}
	
	return receivedDevices[0].deviceId;
}

export default function reducer(state = {}, action) {
  switch(action.type) {
	  
	case SET_MEDIA_DEVICES:
		const audioDevices = action.devices.filter(device => device.kind === 'audioinput');
		const videoDevices = action.devices.filter(device => device.kind === 'videoinput');
			
		return {
			...state,
			hasReceivedMediaDevices: true,
			audioDevices,
			videoDevices,
			selectedAudioDevice: setSelectedDevice(state.selectedAudioDevice, audioDevices),
			selectedVideoDevice: setSelectedDevice(state.selectedVideoDevice, videoDevices)
		};
		
	case SELECT_AUDIO_DEVICE:
		return {
			...state,
			selectedAudioDevice: action.deviceId
		};
		break;
		
	case SELECT_VIDEO_DEVICE:
		return {
			...state,
			selectedVideoDevice: action.deviceId
		};

	case RECEIVE_CHAT_MESSAGE:
		return {
			...state,
			messages: [...state.messages, action.message],
			hasUnreadMessages: state.isChatDrawerOpen ? false : true,
			lastReceiveMessage: Date.now()
		};
		
    case CHAT_MESSAGE:
		return {
			...state,
			messages: [...state.messages, action.message]
		};
		
	case TOGGLE_MUTE_LOCAL_AUDIO:
		return {
			...state,
			muteLocalAudio: !state.muteLocalAudio
		};
		
	case TOGGLE_MUTE_LOCAL_VIDEO:
		return {
			...state,
			muteLocalVideo: !state.muteLocalVideo
		};
	
	case TOGGLE_SEARCH:
		return {
			...state,
			isSearching: !state.isSearching,
			hasPartner: state.isSearching ? false : state.hasPartner,
			messages: state.isSearching ? [] : state.messages
		};

	case RECEIVE_REMOTE_STREAM:
		return {
			...state,
			hasPartner: true
		};
		
	case SEARCH_NEXT:
	case REMOTE_HANGUP:
		return {
			...state,
			hasPartner: false,
			messages: []
		};
		
	case SIGNALING_DISCONNECT:
		return {
			...state,
			hasPartner: false,
			isSearching: false,
			hasSignalingConnection: false,
			messages: []
		};
		
	case SIGNALING_CONNECT:
		return {
			...state,
			hasSignalingConnection: true
		};
		
	case TOGGLE_CHAT:
		return {
			...state,
			isChatDrawerOpen: typeof action.force === 'undefined' ? !state.isChatDrawerOpen : action.force,
			hasUnreadMessages: state.hasUnreadMessages ? !(typeof action.force === 'undefined' ? !state.isChatDrawerOpen : action.force) : state.hasUnreadMessages
		};
		
	case TOGGLE_CONTROL_PANEL:
		return {
			...state,
			isControlPanelOpen: typeof action.force === 'undefined' ? !state.isControlPanelOpen : action.force
		};
		
    default:
      return state;
  }
}
