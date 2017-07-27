import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'
import reducer from './reducers/reducer'
import mediaReducer from './reducers/mediaReducer'
import { combineForms } from 'react-redux-form';

const reducers = {
  user: reducer,
  media: mediaReducer,
  form: combineForms({
    addMedia: {}
  })
};

const rootReducer = combineReducers(reducers);
// Create store with reducers
const store = createStore(rootReducer, composeWithDevTools(
  applyMiddleware(thunk),
));

export default store;
