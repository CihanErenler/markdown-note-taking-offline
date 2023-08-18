import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { EditorProvider } from "./Context/EditorContext";
import { AuthProvider } from "./Context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	// <React.StrictMode>
	<AuthProvider>
		<EditorProvider>
			<App />
		</EditorProvider>
	</AuthProvider>
	// </React.StrictMode>
);
