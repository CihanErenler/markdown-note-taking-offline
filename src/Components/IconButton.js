import styled from "styled-components";

const IconButton = ({ children, action }) => {
	return <StyledIconButton onClick={action}>{children}</StyledIconButton>;
};

const StyledIconButton = styled.button`
	background-color: transparent;
	border: none;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;

	svg {
		transition: all 0.3s ease;
		fill: #8b949e;
	}

	:hover {
		svg {
			fill: lightskyblue;
		}
	}
`;

export default IconButton;
