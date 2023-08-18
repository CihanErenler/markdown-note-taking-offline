import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { useEditorContext } from "../../Context/EditorContext";

const FolderOptions = ({ buttonRef }) => {
	const ref = useRef(null);
	const { openModal, parent, setFolderOptions, showFolderOptions } =
		useEditorContext();

	const handleRename = () => {
		setFolderOptions(false);
		openModal(parent, "edit", "edit-folder");
	};

	const handleDelete = () => {
		setFolderOptions(false);
		openModal(parent, "delete", "delete-item");
	};

	useEffect(() => {
		function handleClickOutside(event) {
			if (
				ref.current &&
				!ref.current.contains(event.target) &&
				buttonRef.current !== event.target
			) {
				setFolderOptions(!showFolderOptions);
			}
		}

		function handleKeypress(event) {
			if (event.key === "Escape") {
				setFolderOptions(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleKeypress);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleKeypress);
		};
	}, [buttonRef, setFolderOptions, showFolderOptions]);

	return (
		<StyledFolderOption ref={ref}>
			<div onClick={handleRename}>Rename</div>
			<div className="delete" onClick={handleDelete}>
				Delete
			</div>
		</StyledFolderOption>
	);
};

const StyledFolderOption = styled.div`
	background-color: ${(prosp) => prosp.theme.bg1};
	box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
		rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
	border-radius: 4px;
	position: absolute;
	right: 12px;
	top: 25px;
	animation: fade-in 0.3s ease;
	transform-origin: top right;

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

	.delete {
		color: ${(props) => props.theme.danger};
	}

	div {
		padding: 2px 6px;
		font-size: 13px;
		cursor: pointer;

		:first-child {
			border-bottom: 1px solid ${(props) => props.theme.inputBorder};
		}

		:hover {
			background-color: ${(props) => props.theme.seperator};
		}
	}
`;

export default FolderOptions;
