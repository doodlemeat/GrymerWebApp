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
	RECEIVE_CHAT_MESSAGE
} from '../actions';

export default function reducer(state = {}, action) {
  switch(action.type) {

	case RECEIVE_CHAT_MESSAGE:
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
		
    default:
      return state;
  }
}
