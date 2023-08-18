import React from "react";
import styled from "styled-components";
import notFound from "../Assets/not_found.svg";
import Button from "../Components/Button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
	const navigate = useNavigate();

	const handleBackHome = () => {
		navigate("/");
	};

	return (
		<NotFoundPage>
			<img src={notFound} alt="" />
			<Button action={handleBackHome}>Go back home</Button>
		</NotFoundPage>
	);
};

const NotFoundPage = styled.div`
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	img {
		display: block;
		width: 30%;
	}
`;

export default NotFound;
