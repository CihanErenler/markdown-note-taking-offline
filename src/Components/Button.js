import styled, { css } from "styled-components";

const Button = ({ children, variant, type, disabled, action, width }) => {
	if (type === "cancel") {
		return (
			<StyledCancelButton disabled={disabled} onClick={action} width={width}>
				{children}
			</StyledCancelButton>
		);
	}

	if (variant === "secondary") {
		return (
			<StyledSecondary disabled={disabled} onClick={action} width={width}>
				{children}
			</StyledSecondary>
		);
	}

	if (variant === "outlined") {
		return (
			<StyledOutlined disabled={disabled} onClick={action} width={width}>
				{children}
			</StyledOutlined>
		);
	}
	if (variant === "outlined-danger") {
		return (
			<StyledOutlinedDanger disabled={disabled} onClick={action} width={width}>
				{children}
			</StyledOutlinedDanger>
		);
	}
	if (variant === "danger") {
		return (
			<StyledDanger disabled={disabled} onClick={action} width={width}>
				{children}
			</StyledDanger>
		);
	}

	if (variant === "small") {
		return (
			<StyledSmall disabled={disabled} onClick={action} width={width}>
				{children}
			</StyledSmall>
		);
	}

	if (variant === "small-full") {
		return (
			<StyledSmallFull disabled={disabled} onClick={action} width={width}>
				{children}
			</StyledSmallFull>
		);
	}

	if (variant === "full") {
		return (
			<StyledFullButton disabled={disabled} onClick={action} width={width}>
				{children}
			</StyledFullButton>
		);
	}

	return (
		<StyledButton disabled={disabled} onClick={action} width={width}>
			{children}
		</StyledButton>
	);
};

const CommonStyles = css`
	height: 45px;
	display: flex;
	width: ${(props) => (props.width ? props.width : "")};
	align-items: center;
	justify-content: center;
	border: none;
	border-radius: 6px;
	font-size: 18px;
	font-weight: 600;
	color: ${(props) => props.theme.bg1};
	cursor: pointer;
	background-color: transparent;
	transition: all 0.3s ease;
	opacity: 0.9;
	padding: 0 20px;

	&:not(:disabled):hover {
		opacity: 1;
	}

	&:disabled {
		cursor: default;
		opacity: 0.5;
	}
`;

const StyledFullButton = styled.button`
	${CommonStyles}
	background-color: ${(props) => props.theme.primary};
	width: 100%;
`;

const StyledButton = styled.button`
	${CommonStyles}
	background-color: ${(props) => props.theme.primary};
`;

const StyledCancelButton = styled.button`
	${CommonStyles}
	background-color: ${(props) => props.theme.danger};
`;

const StyledOutlinedDanger = styled.button`
	${CommonStyles}
	border: 2px solid ${(props) => props.theme.danger};
	color: ${(props) => props.theme.danger};
`;

const StyledDanger = styled.button`
	${CommonStyles}
	border: 2px solid ${(props) => props.theme.danger};
	color: ${(props) => props.theme.bg1};
	background-color: ${(props) => props.theme.danger};
`;

const StyledOutlined = styled.button`
	${CommonStyles}
	border: 1px solid ${(props) => props.theme.primary};
	color: ${(props) => props.theme.primary};
	background-color: ${(props) => props.theme.bg1};
`;

const StyledSecondary = styled.button`
	${CommonStyles}
	background-color: ${(props) => props.theme.sidebarBg};
`;

const StyledSmall = styled.button`
	${CommonStyles}
	background-color: ${(props) => props.theme.primary};
	font-size: 14px;
	height: 35px;
`;

const StyledSmallFull = styled.button`
	${CommonStyles}
	background-color: ${(props) => props.theme.sidebarBg};
`;

export default Button;
