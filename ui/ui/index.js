import React from "react";
import ReactDOM from "react-dom";
import './index.scss';
import 'antd/dist/antd.css';
import { Provider } from 'react-redux';
import store from './store';

import App from "./app";

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById("app")
);
