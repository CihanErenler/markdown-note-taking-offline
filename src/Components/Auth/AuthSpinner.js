import React from "react";
import styled from "styled-components";
import SpinnerEyes from "../SpinnerEyes";

const AuthSpinner = () => {
	return (
		<StyledAuthWrapper>
			<SpinnerEyes />
		</StyledAuthWrapper>
	);
};

const StyledAuthWrapper = styled.div`
	width: 100%;
	height: 100vh;
	display: grid;
	place-items: center;
	background-color: ${(props) => props.theme.sidebarBg};
`;

export default AuthSpinner;
