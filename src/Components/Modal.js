import { useEffect, useRef } from "react";
import styled from "styled-components";
import Button from "./Button";
import Input from "./Input";
import InnerModal from "./InnerModal";
import { useEditorContext } from "../Context/EditorContext";
import { useAuthContext } from "../Context/AuthContext";
import { useCallback } from "react";

const Modal = () => {
	const {
		closeModal,
		createFolder,
		createFile,
		modalValue,
		updateModalValue,
		modalMode,
		rename,
		isModalOpen,
		handleDelete,
		deleteFile,
		renameFolder,
		setFileOptions,
		setFolderOptions,
	} = useEditorContext();
	const element = useRef(null);
	const { user } = useAuthContext();

	const generateModalTitle = (mode) => {
		let title = "New Folder";
		if (mode === "create-file") title = "New File";
		if (mode === "edit-file") title = "Rename File";
		if (mode === "edit-folder") title = "Rename Folder";
		return title;
	};

	const handleClick = useCallback(async () => {
		if (modalMode === "create-folder") createFolder(user);
		if (modalMode === "create-file") createFile(user);
		if (modalMode === "delete-item") handleDelete(user);
		if (modalMode === "delete-file") deleteFile(user);
		if (modalMode === "edit-folder") {
			renameFolder(user);
		}
		if (modalMode === "edit-file") {
			rename(user);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [createFile, createFolder, handleDelete, modalMode, rename]);

	const handleKeyPress = useCallback(
		(e) => {
			if (e.key === "Enter" && isModalOpen) {
				setFolderOptions(false);
				setFileOptions(false);
				handleClick();
			}
		},
		[handleClick, isModalOpen, setFileOptions, setFolderOptions]
	);

	useEffect(() => {
		const tempElem = element.current;
		const handleClick = (e) => {
			if (
				e.target.classList.contains("modal") ||
				e.target.textContent === "Cancel"
			) {
				closeModal();
			}
		};

		tempElem.addEventListener("click", handleClick);
		return () => {
			tempElem.removeEventListener("click", handleClick);
		};
	}, [closeModal]);

	useEffect(() => {
		window.addEventListener("keydown", handleKeyPress);
		return () => {
			window.removeEventListener("keydown", handleKeyPress);
		};
	}, [handleKeyPress]);

	const generatedTitle = generateModalTitle(modalMode);

	return (
		<StyledModal className="modal" ref={element}>
			{modalMode !== "delete-item" && modalMode !== "delete-file" ? (
				<InnerModal>
					<h1>{generatedTitle}</h1>
					<Input value={modalValue} action={updateModalValue} focused={true} />
					<section>
						<Button variant="secondary" action={closeModal}>
							Cancel
						</Button>
						<Button disabled={!modalValue} action={handleClick}>
							{modalMode === "edit-folder" || modalMode === "edit-file"
								? "Save"
								: "Create"}
						</Button>
					</section>
				</InnerModal>
			) : (
				<InnerModal>
					<h1>Are you sure?</h1>
					<section>
						<Button variant="secondary" action={closeModal}>
							Cancel
						</Button>
						<Button
							variant="danger"
							action={() =>
								modalMode === "delete-item"
									? handleDelete(user)
									: deleteFile(user)
							}
						>
							Delete
						</Button>
					</section>
				</InnerModal>
			)}
		</StyledModal>
	);
};

const StyledModal = styled.div`
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
		padding-bottom: 20px;
		font-weight: 500;
	}

	section {
		padding-top: 10px !important;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
`;

export default Modal;
