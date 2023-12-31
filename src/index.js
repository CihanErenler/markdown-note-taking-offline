import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { EditorProvider } from "./Context/EditorContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <EditorProvider>
    <App />
  </EditorProvider>
  // </React.StrictMode>
);
