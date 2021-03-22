import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
const sagaMiddleware = createSagaMiddleware();

import "regenerator-runtime/runtime";
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);

export default store;
