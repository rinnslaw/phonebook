import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { pendingTasksReducer } from 'react-redux-spinner';
import phoneBook from './phoneBook';

export default combineReducers({
  routing: routerReducer,
  pendingTasks: pendingTasksReducer,
  phoneBook
})
