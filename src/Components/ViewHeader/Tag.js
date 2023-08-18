import React from "react";
import styled from "styled-components";
import { IoCloseCircle } from "react-icons/io5";
import { useEditorContext } from "../../Context/EditorContext";
import { IconContext } from "react-icons";

const Tag = ({ id, tagName, color, isSelected, closable }) => {
	const { toggleTags, removeTag } = useEditorContext();

	const handleClick = (id, isSelected) => {
		if (isSelected) {
			removeTag(id);
			return;
		}
		toggleTags(id);
	};

	if (closable) {
		return (
			<StyledTag color={color} isSelected={isSelected} closable={closable}>
				<div></div>
				{tagName}
				<IconContext.Provider value={{ fill: "white" }}>
					<span
						onClick={() => handleClick(id, isSelected)}
						className="tag-close-btn"
					>
						<IoCloseCircle size={18} color={"tomato"} />
					</span>
				</IconContext.Provider>
			</StyledTag>
		);
	}

	return (
		<StyledTag
			color={color}
			onClick={() => handleClick(id, isSelected)}
			isSelected={isSelected}
		>
			<div></div>
			{tagName}
		</StyledTag>
	);
};

const StyledTag = styled.div`
	min-width: fit-content;
	font-size: 11px;
	height: 18px;
	border-radius: 50px;
	background-color: ${(props) =>
		!props.isSelected ? "#e5e7eb" : props.theme.seperator};
	color: ${(props) => (!props.isSelected ? "#505967" : props.theme.sidebarBg)};
	padding: ${(props) => (props.closable ? "3px 2px 3px 8px" : "3px 8px")};
	margin-right: 6px;
	cursor: ${(props) => (props.closable ? "default" : "pointer")};
	display: flex;
	align-items: center;
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;

	> div {
		width: 11px;
		height: 11px;
		border-radius: 50%;
		background-color: ${(props) => props.color};
		margin-right: 5px;
	}

	.tag-close-btn {
		cursor: pointer;
		background-color: ${(props) => props.theme.bg1};
		border-radius: 50%;
		display: grid;
		/* place-items: center; */
		margin-left: 5px;
		margin-right: 0;
		box-shadow: inset 0px 0px 0px 3px #c4e0f9;

		svg {
			pointer-events: none;
		}
	}
`;

export default Tag;
