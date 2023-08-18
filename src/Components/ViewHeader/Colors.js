import { useEffect, useCallback, useRef } from "react";
import colors from "../../colors";
import styled from "styled-components";

const Colors = ({
	selected,
	setCurrent,
	setShowColors,
	container,
	showColors,
}) => {
	const colorsRef = useRef(null);
	const handleClick = useCallback(
		(e) => {
			if (colorsRef.current && !colorsRef.current.contains(e.target)) {
				setShowColors(!showColors);
			}
		},
		[setShowColors, showColors]
	);

	useEffect(() => {
		const tempContainer = container.current;
		tempContainer.addEventListener("click", handleClick);

		return () => {
			tempContainer.removeEventListener("click", handleClick);
		};
	}, [container, handleClick]);
	return (
		<StyledColors ref={colorsRef}>
			<div>
				{colors.map((color) => (
					<span
						key={color}
						className={selected === color ? "current" : ""}
						style={{ backgroundColor: color }}
						onClick={() => setCurrent(color)}
					></span>
				))}
			</div>
			<button onClick={() => setShowColors(false)}>Select</button>
		</StyledColors>
	);
};

const StyledColors = styled.div`
	padding: 10px 10px 0;
	box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
	border-radius: 20px;
	position: absolute;
	background-color: #fff;
	left: 100px;
	bottom: -130px;
	animation: fade-in 0.3s ease;
	transform-origin: left top;
	z-index: 10;

	> div {
		display: grid;
		grid-template-columns: repeat(10, 1fr);
		gap: 4px;

		span {
			height: 20px;
			width: 20px;
			border-radius: 50%;
			cursor: pointer;
		}
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: scale(0.5);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.current {
		box-shadow: 0px 0px 0px 2px black;
	}

	button {
		width: 100%;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: ${(props) => props.theme.sidebarBg};
		color: ${(props) => props.theme.bg1};
		border: none;
		border-radius: 10px;
		margin: 10px 0;
		opacity: 0.9;
		cursor: pointer;
		transition: all 0.3s ease;

		:hover {
			opacity: 1;
		}
	}
`;

export default Colors;
