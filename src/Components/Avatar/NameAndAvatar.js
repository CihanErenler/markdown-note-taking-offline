import React from "react";
import Avatar from "./Avatar";
import styled from "styled-components";

const NameAndAvatar = ({ name, lastname, email }) => {
	return (
		<StyledNameAndAvatar className="name-and-avatar">
			<Avatar name={name} lastname={lastname} />
			<div>
				<div className="name">{`${name} ${lastname}`}</div>
				<div className="email">{email}</div>
			</div>
		</StyledNameAndAvatar>
	);
};

const StyledNameAndAvatar = styled.div`
	.name {
		width: max-content;
	}
`;

export default NameAndAvatar;
