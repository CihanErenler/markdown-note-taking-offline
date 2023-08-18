import { useRef, useEffect, useCallback, useState } from "react";
import styled from "styled-components";
import { SlOptions } from "react-icons/sl";
import { BsInfoCircle } from "react-icons/bs";
import { useEditorContext } from "../../Context/EditorContext";

const FileOptions = () => {
	const [showInfo, setShowInfo] = useState(false);
	const options = useRef(null);
	const { code, openModal, setFileOptions, showFileOptions } =
		useEditorContext();

	const handleRename = () => {
		setFileOptions(false);
		openModal(null, "edit", "edit-file");
	};

	const handleDelete = () => {
		setFileOptions(false);
		openModal(null, "delete", "delete-file");
	};

	const handleIconClick = (type) => {
		if (type === "info") {
			setShowInfo(!showInfo);
			setFileOptions(false);
			return;
		}
		setShowInfo(false);
		setFileOptions(!showFileOptions);
	};

	const handleClick = useCallback(
		(e) => {
			if (options.current && !options.current.contains(e.target)) {
				setFileOptions(false);
				setShowInfo(false);
			}
		},
		[setFileOptions]
	);

	const handleKeypress = useCallback(
		(e) => {
			if (e.key === "Escape") {
				setFileOptions(false);
			}
		},
		[setFileOptions]
	);

	useEffect(() => {
		document.addEventListener("click", handleClick);
		document.addEventListener("keydown", handleKeypress);

		return () => {
			document.removeEventListener("click", handleClick);
			document.removeEventListener("keydown", handleKeypress);
		};
	}, [handleClick, handleKeypress]);

	const dateOptions = {
		// timeZone: "UTC",
		hourCycle: "h23",
		year: "numeric",
		month: "long",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	};
	const createdAt = new Date(code.createdAt);
	const lastUpdated = new Date(code.updatedAt);

	return (
		<StyledFileOptions ref={options}>
			<div className="icons-wrapper">
				<div className="info-btn" onClick={() => handleIconClick("info")}>
					<BsInfoCircle size={22} />
				</div>
				<div className="icon-wrapper" onClick={() => handleIconClick("option")}>
					<SlOptions size={20} />
				</div>
			</div>
			{showFileOptions ? (
				<section className="file-options">
					<ul>
						<li onClick={handleRename}>Rename File</li>
						<li className="delete-file" onClick={handleDelete}>
							Delete File
						</li>
					</ul>
				</section>
			) : (
				""
			)}
			{showInfo ? (
				<section className="info-wrapper">
					<h5>Document</h5>
					<div className="info-container">
						<div className="info-row">
							<span className="info-title">Created</span>
							<span>{createdAt.toLocaleDateString("en-US", dateOptions)}</span>
						</div>
						<div className="info-row">
							<span className="info-title">Modified</span>
							<span>
								{lastUpdated.toLocaleDateString("en-US", dateOptions)}
							</span>
						</div>
					</div>
				</section>
			) : (
				""
			)}
		</StyledFileOptions>
	);
};

const StyledFileOptions = styled.div`
	.icon-wrapper {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		border: 1px solid #b6b6b6;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		cursor: pointer;
		position: relative;
		transition: all 0.3s ease;

		:hover {
			border-color: ${(props) => props.theme.primary};

			svg {
				color: ${(props) => props.theme.primary};
			}
		}

		svg {
			color: #b6b6b6;
			transition: all 0.3s ease;
		}
	}

	.icons-wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;

		.info-btn {
			display: grid;
			place-items: center;
			cursor: pointer;

			svg {
				transition: all 0.3s ease;
				fill: ${(props) => props.theme.textColorLight};
			}

			:hover {
				svg {
					fill: ${(props) => props.theme.primary};
				}
			}
		}
	}

	.file-options {
		background-color: #fff;

		width: 100px;
		box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
			rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
		position: absolute;
		top: 48px;
		right: 260px;
		border-radius: 4px;
		z-index: 9999;
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

		ul {
			list-style: none;
			font-size: 13px;
			width: 100%;

			li {
				padding: 4px 10px;
				cursor: pointer;
				:hover {
					background-color: ${(props) => props.theme.seperator};
				}
			}

			.delete-file {
				color: ${(props) => props.theme.danger};
			}
		}
	}

	.info-wrapper {
		background-color: #fff !important;
		width: 400px;
		border-radius: 6px;
		position: absolute;
		box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
			rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
		z-index: 9999;
		right: 300px;
		top: 48px;
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

		h5 {
			font-size: 14px;
			border-bottom: 1px solid #ddd;
			padding: 6px 10px;
		}

		.info-container {
			padding: 6px 10px;
			color: ${(props) => props.theme.textColorLight};
			font-size: 13px;

			.info-row {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 4px 0;

				.info-title {
					font-weight: 600;
				}
			}
		}
	}
`;

export default FileOptions;
