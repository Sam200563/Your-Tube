import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { applyMiddleware, compose } from "redux";
import { legacy_createStore as createstore } from "redux";
import { thunk } from "redux-thunk";
import Reducers from "./Reducers";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Callprovider } from "./component/Videocall/Callcontext";

const googleClientId=process.env.REACT_APP_GOOGLE_CLIENT_ID
const store = createstore(Reducers, compose(applyMiddleware(thunk)));

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={googleClientId}>
      <Callprovider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </Callprovider>
    </GoogleOAuthProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
