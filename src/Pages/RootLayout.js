import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import Header from "../Components/Header";
import styled from "styled-components";
import { useNavigate } from "react-router";
import { useAuthContext } from "../Context/AuthContext";
import { useEditorContext } from "../Context/EditorContext";
import AuthSpinner from "../Components/Auth/AuthSpinner";
import { toast } from "react-toastify";

const RootLayout = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { user, showRootSpinner, handleRootSpinner } = useAuthContext();
	const { fetchData, clearState } = useEditorContext();

	useEffect(() => {
		if (user) {
			const { name } = user;
			const upperCaseName = name.charAt(0).toUpperCase() + name.slice(1);
			toast.success(`Welcome ${upperCaseName}`);
			setTimeout(() => {
				navigate("/notes");
				handleRootSpinner();
			}, 1500);
		} else {
			setTimeout(() => {
				handleRootSpinner();
			}, 1600);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	useEffect(() => {
		if (!user) {
			clearState();
			navigate("/");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	useEffect(() => {
		if (user) {
			fetchData(user);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	if (showRootSpinner) {
		return <AuthSpinner />;
	}

	return (
		<StyledRootElement>
			{location.pathname !== "/notes" ? <Header /> : ""}
			<main>
				<Outlet />
			</main>
		</StyledRootElement>
	);
};

const StyledRootElement = styled.section`
	main {
		height: 100vh;
	}
`;

export default RootLayout;
