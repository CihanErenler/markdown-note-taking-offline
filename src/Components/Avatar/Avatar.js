import React from "react";
import styled from "styled-components";

const Avatar = ({ name, lastname }) => {
	const fName = name.charAt(0);
	const lName = lastname.charAt(0);
	return (
		<StyledAvatar>
			{fName}
			{lName}
		</StyledAvatar>
	);
};

const StyledAvatar = styled.div`
	height: 40px;
	width: 40px;
	color: ${(props) => props.theme.bg1};
	background-color: ${(props) => props.theme.primary};
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	margin-right: 10px;
	font-weight: 600;
	text-transform: uppercase;
`;

export default Avatar;
