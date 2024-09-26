import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import App from "./App";
import store from "./store/store";
import "./index.css";
import SocketContext from "./contexts/socket";
import { io } from "socket.io-client";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <SocketContext.Provider value={io("http://localhost:3100")}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SocketContext.Provider>
  </Provider>,
);
