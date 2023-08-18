import React from "react";
import { useEditorContext } from "../../Context/EditorContext";
import styled from "styled-components";

const Tag = ({ tag, action }) => {
	const { currentlySelectedTag } = useEditorContext();
	return (
		<StyledSidebarTag
			key={tag.name}
			onClick={() => action(tag.name)}
			className={tag.name === currentlySelectedTag ? "selected" : ""}
		>
			<div className="title">
				<span style={{ backgroundColor: tag.color }}></span>
				{tag.name}
			</div>
		</StyledSidebarTag>
	);
};

const StyledSidebarTag = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 4px 10px 4px 30px !important;
	transition: all 0.3s ease;
	text-transform: capitalize;
	cursor: pointer;

	span {
		height: 10px;
		width: 10px;
		border-radius: 50%;
		display: inline-block;
		margin-right: 8px;
	}

	:hover {
		background-color: ${(props) => props.theme.sidebarHover};
	}
`;

export default Tag;
