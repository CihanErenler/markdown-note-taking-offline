import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { BiShow, BiHide } from "react-icons/bi";
import { BiSearchAlt2 } from "react-icons/bi";

const Input = ({
	value,
	action,
	placeholder,
	disabled,
	focused,
	type,
	name,
	danger,
}) => {
	const [showPass, setShowPass] = useState(false);
	const input = useRef(null);

	useEffect(() => {
		if (focused) {
			input.current.select();
		}
	}, [focused]);

	return (
		<StyledInput type={type}>
			<div className="input-wrapper">
				<input
					ref={input}
					value={value}
					className={danger ? "danger" : ""}
					name={name}
					onChange={action}
					placeholder={placeholder}
					disabled={disabled}
					type={showPass ? "text" : type}
					suggested="current-password"
				/>
				{type === "password" ? (
					<span onClick={() => setShowPass(!showPass)}>
						{!showPass ? (
							<BiHide size={26} color="gray" />
						) : (
							<BiShow size={26} color="gray" />
						)}
					</span>
				) : (
					""
				)}
				{type === "search" ? (
					<span onClick={() => setShowPass(!showPass)}>
						<BiSearchAlt2 size={22} color="gray" />
					</span>
				) : (
					""
				)}
			</div>
		</StyledInput>
	);
};

const StyledInput = styled.div`
	.input-wrapper {
		position: relative;
		margin-bottom: 20px;

		span {
			cursor: pointer;
			position: absolute;
			top: 50%;
			right: 10px;
			transform: translateY(-50%);
			display: grid;
			align-items: center;
		}

		input {
			border: 1px solid ${(props) => props.theme.inputBorder};
			height: ${(props) => (props.type === "search" ? "30px" : "45px")};
			width: 100%;
			border-radius: 6px;
			padding: 0 20px;
			font-size: 18px;
			transition: all 0.3s ease;
			background-color: ${(props) =>
				props.type === "search" ? props.theme.bg1 : props.theme.inputBg};

			::-moz-selection {
				color: ${(props) => props.theme.bg1};
				background: ${(props) => props.theme.primary};
			}

			::selection {
				color: ${(props) => props.theme.bg1};
				background: ${(props) => props.theme.primary};
			}

			:focus {
				outline: none;
				border-color: ${(props) => props.theme.primary};
				box-shadow: 0px 0px 0px 3px ${(props) => props.theme.inputBorderFocus};
				background-color: ${(props) =>
					props.type === "search" ? props.theme.bg1 : props.theme.inputBg};
			}

			::placeholder {
				font-size: ${(props) => (props.type === "search" ? "14px" : "16px")};
			}
		}

		.danger {
			border-color: red !important;
		}
	}
`;

export default Input;
