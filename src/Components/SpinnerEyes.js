import React from "react";
import styled from "styled-components";

const SpinnerEyes = () => {
	return <StyledSpinnerEyes></StyledSpinnerEyes>;
};

const StyledSpinnerEyes = styled.span`
	width: 100px;
	height: 100px;
	border-radius: 50%;
	display: inline-block;
	position: relative;
	border: 3px solid;
	border-color: #fff #fff transparent transparent;
	box-sizing: border-box;
	animation: rotation 1s linear infinite;

	::after,
	::before {
		content: "";
		box-sizing: border-box;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		margin: auto;
		border: 3px solid;
		border-color: transparent transparent dodgerblue lightskyblue;
		width: 70px;
		height: 70px;
		border-radius: 50%;
		box-sizing: border-box;
		animation: rotationBack 0.5s linear infinite;
		transform-origin: center center;
	}
	::before {
		width: 50px;
		height: 50px;
		border-color: #fff #fff transparent transparent;
		animation: rotation 1.5s linear infinite;
	}

	@keyframes rotation {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	@keyframes rotationBack {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(-360deg);
		}
	}
`;

export default SpinnerEyes;
