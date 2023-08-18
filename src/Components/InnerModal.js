import React from "react";
import styled from "styled-components";

const InnerModal = ({ children }) => {
	return <StyledInnerModal>{children}</StyledInnerModal>;
};

const StyledInnerModal = styled.div`
	background-color: ${(props) => props.theme.bg1};
	min-width: 500px;
	padding: 20px 40px;
	border-radius: 10px;
	animation: fadein 0.3s forwards ease;
	opacity: 0;
	transform: scale(0.9);
`;

export default InnerModal;
