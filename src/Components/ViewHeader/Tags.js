import { useState, useEffect } from "react";
import styled from "styled-components";
import Tag from "./Tag";
import TagContainer from "./TagContainer";
import { useEditorContext } from "../../Context/EditorContext";

const Tags = () => {
	const [showContainer, setShowContainer] = useState(false);
	const [selectedTags, setSelectedTags] = useState(null);
	const { tags, code } = useEditorContext();

	useEffect(() => {
		const filteredTags = tags.filter((tag) => {
			if (code.tags.includes(tag.id)) return true;
			return false;
		});
		setSelectedTags(filteredTags);
	}, [tags, code.tags]);

	return (
		<StyledTags>
			<span>Tags:</span>
			{selectedTags &&
				selectedTags.map((tag) => {
					const { id, name, color } = tag;
					return (
						<Tag
							key={id}
							tagName={name}
							color={color}
							isSelected={true}
							closable={true}
							id={id}
						/>
					);
				})}
			<div className="add-button" onClick={() => setShowContainer(true)}>
				Add
			</div>
			{showContainer && (
				<TagContainer close={setShowContainer} showContainer={showContainer} />
			)}
		</StyledTags>
	);
};

const StyledTags = styled.div`
	display: flex;
	align-items: center;
	position: relative;

	span {
		font-size: 12px;
		color: ${(props) => props.theme.textColorLighter};
		font-weight: 600;
		margin-right: 6px;
	}

	.add-button {
		font-size: 11px;
		height: 18px;
		border-radius: 50px;
		background-color: ${(props) => props.theme.primary};
		color: ${(props) => props.theme.bg1};
		padding: 3px 6px;
		margin: 0 6px;
		cursor: pointer;
	}
`;

export default Tags;
