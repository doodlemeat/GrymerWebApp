import { ADD_MEDIA, CHANGED_MEDIA, REMOVED_MEDIA } from '../actions'
export default function mediaReducer(state = [], action) {
  switch(action.type) {

    case ADD_MEDIA:
      return [
        ...state,
        action.media
      ];

    case CHANGED_MEDIA:
      return state.map((media) => {
        if(media.key === action.media.key) {
          return action.media;
        } else {
          return media;
        }
      });

    case REMOVED_MEDIA:
      return state.filter((media) => media.key !== action.media.key);

    default:
      return state;
  }
}
