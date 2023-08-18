import { useEffect } from "react";
import styled from "styled-components";
import Parent from "./Folders";
import FilterView from "./FilterView";
import { useEditorContext } from "../../Context/EditorContext";

const Sidebar = () => {
	const { files, getAmount } = useEditorContext();

	useEffect(() => {
		getAmount();
		// eslint-disable-next-line
	}, [files]);

	return (
		<StyledSidebar>
			<Parent />
			<FilterView />
		</StyledSidebar>
	);
};

const StyledSidebar = styled.section`
	display: flex;
	width: 500px;
	border-right: 1px solid ${(props) => props.theme.borderLight};
`;

export default Sidebar;
