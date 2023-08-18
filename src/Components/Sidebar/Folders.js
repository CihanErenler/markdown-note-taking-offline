import styled from "styled-components";
import logo from "../../Assets/logo-light.svg";
import FolderTree from "../Folders/FolderTree";
import { Link } from "react-router-dom";
import { useEditorContext } from "../../Context/EditorContext";

const Parent = () => {
	const { openShortcutsModal } = useEditorContext();
	return (
		<StyledFolders>
			<Link to="/">
				<StyledLogo src={logo} alt="logo" />
			</Link>
			<FolderTree />
			<div className="shortcuts-btn" onClick={openShortcutsModal}>
				Shortcuts
			</div>
		</StyledFolders>
	);
};

const StyledFolders = styled.div`
	flex: 1;
	background-color: ${(props) => props.theme.sidebarBg};
	padding: 10px;
	position: relative;

	.shortcuts-btn {
		position: absolute;
		bottom: 10px;
		left: 50%;
		transform: translateX(-50%);
		background-color: ${(prosp) => prosp.theme.textColor};
		color: ${(prosp) => prosp.theme.textColorLighter};
		padding: 4px 10px;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.3s ease;
		border: none;
		font-size: 12px;

		:hover {
			background-color: lightblue;
			color: ${(prosp) => prosp.theme.sidebarBg};
		}
	}
`;

const StyledLogo = styled.img`
	display: block;
	width: 70%;
	padding: 4px 0px 20px 20px;
`;

export default Parent;
