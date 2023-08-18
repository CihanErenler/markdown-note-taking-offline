import { useState, useEffect } from "react";
import GlobalStyles from "./GlobalStyles";
import { ThemeProvider } from "styled-components";
import themes from "./theme";
import styled from "styled-components";
import { ToastContainer, Slide } from "react-toastify";
import { useAuthContext } from "./Context/AuthContext";
import CustomRouter from "./CustomRouter";
import AuthWrapper from "./Components/Auth/AuthWrapper.js";
import "react-toastify/dist/ReactToastify.css";
import "./Split.css";

function App() {
	// eslint-disable-next-line no-unused-vars
	const [currentTheme, setCurrentTheme] = useState(false);
	const { getUserFromLocalStorage } = useAuthContext();

	useEffect(() => {
		getUserFromLocalStorage();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Main>
			<GlobalStyles />
			<ThemeProvider theme={currentTheme ? themes.dark : themes.default}>
				<AuthWrapper>
					<CustomRouter />
				</AuthWrapper>
			</ThemeProvider>
			<ToastContainer
				position="bottom-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={true}
				transition={Slide}
				rtl={false}
				closeOnClick
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
		</Main>
	);
}

const Main = styled.main`
	height: 100vh;
`;

export default App;
