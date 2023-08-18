import { useEffect, useRef } from "react";
import styled from "styled-components";
import ShortcutKey from "./ShortcutKey";
import InnderModal from "./InnerModal";
import { useEditorContext } from "../Context/EditorContext";

const Shortcuts = () => {
	const { closeShortcutsModal } = useEditorContext();
	const element = useRef(null);

	const generateCombineKeys = (keys) => {
		const combinedKeys = keys.map((key, index) => {
			return <ShortcutKey key={index}>{key}</ShortcutKey>;
		});
		return combinedKeys;
	};

	const focusEditor = generateCombineKeys(["Ctrl", "Alt", "1"]);
	const focusPreview = generateCombineKeys(["Ctrl", "Alt", "2"]);
	const hideSidebar = generateCombineKeys(["Ctrl", "Alt", "H"]);
	const saveWork = generateCombineKeys(["Ctrl", "S"]);
	const newFile = generateCombineKeys(["Alt", "N"]);
	const newFolder = generateCombineKeys(["Ctrl", "Alt", "N"]);
	const renameFolder = generateCombineKeys(["Ctrl", "Alt", "R"]);
	const deleteFolder = generateCombineKeys(["Shift", "Ctrl", "Delete"]);

	useEffect(() => {
		const tempElem = element.current;
		const handleClick = (e) => {
			if (e.target.classList.contains("modal")) {
				closeShortcutsModal();
			}
		};
		tempElem.addEventListener("click", handleClick);
		return () => {
			tempElem.removeEventListener("click", handleClick);
		};
	}, [closeShortcutsModal]);

	return (
		<StyledShortcuts className="modal" ref={element}>
			<InnderModal>
				<section className="shorcuts-wrapper">
					<div>
						<h1>Save</h1>
						<div className="shortcuts">{saveWork} Save</div>

						<h1>Editor focus</h1>
						<div className="shortcuts">{focusEditor} Focus Editor</div>
						<div className="shortcuts">{focusPreview} Focus Preview</div>

						<h1>Sidebar</h1>
						<div className="shortcuts">{hideSidebar} Toggle Sidebar</div>
					</div>
					<div>
						<h1>File System</h1>
						<div className="shortcuts">{newFile} New File</div>
						<div className="shortcuts">{newFolder} New Folder</div>
						<div className="shortcuts">{renameFolder} Rename Folder</div>
						<div className="shortcuts">{deleteFolder} Delete Folder</div>
					</div>
				</section>
			</InnderModal>
		</StyledShortcuts>
	);
};

const StyledShortcuts = styled.section`
	position: absolute;
	height: 100%;
	width: 100%;
	top: 0;
	left: 0;
	background-color: rgba(0, 10, 20, 0.6);
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
	opacity: 0;
	animation: fadein 0.3s forwards ease;
	z-index: 9999;

	.shorcuts-wrapper {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 20px;
		padding-top: 0 !important;

		.shortcuts {
			margin-bottom: 10px;
			font-size: 13px;
		}
	}

	@keyframes fadein {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	h1 {
		margin-bottom: 10px;
		font-weight: 700;
		font-size: 18px;
		border-bottom: 1px solid lightgray;
	}
`;

export default Shortcuts;
