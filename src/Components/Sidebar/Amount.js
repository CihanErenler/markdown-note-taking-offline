import React from "react";
import styled from "styled-components";

const Amount = ({ amount }) => {
	return <StyledAmount>{amount}</StyledAmount>;
};

const StyledAmount = styled.div`
	width: 22px;
	height: 22px;
	border-radius: 50%;
	background-color: ${(props) => props.theme.amountBg};
	color: ${(props) => props.theme.amountColor};
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: 10px;
	font-size: 11px;
	font-weight: 600;
`;

export default Amount;
