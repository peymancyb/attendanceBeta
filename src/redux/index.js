import {combineReducers,createStore} from 'redux';
import studentReducer from './reducer/studentReducer';
import classReducer from './reducer/classReducer';

const reducer = combineReducers({
  students:studentReducer,
  class:classReducer,
});


const store = createStore(reducer);
export default store;
