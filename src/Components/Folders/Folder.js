import styled from "styled-components";
import Amount from "../Sidebar/Amount";
import { useEditorContext } from "../../Context/EditorContext";
import { MdFolder } from "react-icons/md";

function Folder({ explorer }) {
	const { selectParent, parent } = useEditorContext();

	return (
		<StyledFolder key={explorer.id}>
			<div
				className={`parent-wrapper ${
					String(parent) === explorer.id ? "selected" : ""
				}`}
				onClick={() => selectParent(explorer.id)}
			>
				<div className="title">
					<span className="title-wrapper">
						<MdFolder size={18} />{" "}
						<h1 className="parent-title">{explorer.name}</h1>
					</span>
					<Amount amount={explorer.items.length} />
				</div>
			</div>
		</StyledFolder>
	);
}

const StyledFolder = styled.section`
	color: ${(props) => props.theme.bg1};

	.parent-wrapper {
		padding: 4px 10px 4px 24px;
		cursor: pointer;
		transition: all ease 0.1s;
		border-radius: 6px;
		color: #8b949e;
		margin-bottom: 6px;

		:hover {
			background-color: ${(props) => props.theme.sidebarHover};
		}

		.title {
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: relative;
			width: 100% !important;

			span.title-wrapper {
				display: flex;
				align-items: center;

				h1 {
					display: inline-block;
					margin-left: 5px;
				}
			}
		}

		.parent-title {
			text-transform: capitalize;
			font-size: 13px;
			flex: 1;
			font-weight: 400;
			transition: all 0.3s ease;
			white-space: nowrap;
			text-overflow: ellipsis;
			-webkit-touch-callout: none;
			-webkit-user-select: none;
			-khtml-user-select: none;
			-moz-user-select: none;
			-ms-user-select: none;
			user-select: none;
			position: relative;
		}
	}

	.parent-wrapper.selected {
		background-color: ${(props) => props.theme.primary};
		color: ${(props) => props.theme.bg1};
	}
`;

export default Folder;
