import {takeLatest, put, call} from 'redux-saga/effects';

import {
  LOAD_PROJECT,
  CREATE_PROJECT
} from './workspace.action.types';

import {
  loadProject,
  createProject
} from './workspace.actions';

function* executeLoadProjectAction(action){
  try {
    yield call(alert, "Select a grpc.yml");
    // alert("Select a grpc.yml")
    // yield call(sendTokens, action.payload);
    // yield put(tokenTransferred());
    // yield put(fetchWallet());
  } catch (e) {
    // alert(`Somthing went wrong ${e.message}`);
  }
}

export default function*  workspaceSagas(){
  yield takeLatest(LOAD_PROJECT, executeLoadProjectAction);
}
