import React from "react";
import styled from "styled-components";

const Spinner = () => {
	return (
		<StyledSpinner>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</StyledSpinner>
	);
};

const StyledSpinner = styled.div`
	display: inline-flex;
	position: relative;
	width: 60px;
	height: 60px;
	align-items: center;
	justify-content: center;

	div {
		box-sizing: border-box;
		display: block;
		position: absolute;
		width: 60px;
		height: 60px;
		border: 5px solid #3080e3;
		border-radius: 50%;
		animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
		border-color: #3080e3 transparent transparent transparent;
	}
	div:nth-child(1) {
		animation-delay: -0.45s;
	}
	div:nth-child(2) {
		animation-delay: -0.3s;
	}
	div:nth-child(3) {
		animation-delay: -0.15s;
	}
	@keyframes lds-ring {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
`;

export default Spinner;
