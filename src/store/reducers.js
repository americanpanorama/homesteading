import { combineReducers } from 'redux';
import A from './actionTypes';
import initialState from './initialState';

const selectedYear = (state = initialState, action) => {
  if (action.type === A.SELECT_YEAR) {
    return action.payload;
  }
  return state;
}

const mapPosition = (state = initialState, action) => (
  (action.type === A.MAP_MOVED) ? action.payload : state
);

const dimensions = (state = initialState, action) => (
  (action.type === A.DIMENSIONS_CALCULATED) ? action.payload : state
);

const combinedReducer = combineReducers({
  selectedYear,
  mapPosition,
  dimensions,
});

export default combinedReducer;
