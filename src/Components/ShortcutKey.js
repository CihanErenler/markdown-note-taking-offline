import React from "react";
import styled from "styled-components";

const ShortcutKey = ({ children }) => {
	return <StyledShortKey>{children}</StyledShortKey>;
};

const StyledShortKey = styled.div`
	display: inline-flex;
	padding: 2px 8px;
	background-color: lightgray;
	border-radius: 3px;
	min-width: 30px;
	align-items: center;
	justify-content: center;
	font-weight: 600;
	margin: 0 2px;
	font-size: 11px !important;
`;

export default ShortcutKey;
