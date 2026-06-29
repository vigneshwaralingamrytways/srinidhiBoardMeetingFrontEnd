// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthContextProvider } from './Forms/Store/auth-context';
import { persistedstore, store } from './Forms/Store/index';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { Provider } from 'react-redux';
// import { persistedstore, store } from './store/index';
import { PersistGate } from 'redux-persist/integration/react';
import createHistory from 'history/createBrowserHistory'
import {ui} from './Api'

export const history = createHistory()
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter history={history} basename={ui}>
  <Provider store={store}>
  <PersistGate loading={null} persistor={persistedstore}>
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
  </PersistGate>
  </Provider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
