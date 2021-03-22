import { combineReducers } from 'redux';
import workspace from './modules/workspace/workspace.reducer';

const rootReducer = combineReducers({
  workspace,
});

export default rootReducer;
