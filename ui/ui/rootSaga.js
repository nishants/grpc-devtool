import {all} from 'redux-saga/effects';
import workspaceSaga from './modules/workspace/workspace.sagas';

export default function* rootSaga(){
  yield all([
    workspaceSaga()
  ]);
}
