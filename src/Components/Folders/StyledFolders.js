import styled from "styled-components";

export const StyledFolderTree = styled.section`
	position: relative;

	.all-notes {
		cursor: pointer;
		border-radius: 6px;
		:hover {
			background-color: ${(props) => props.theme.sidebarHover};
		}
	}

	.folder-tree-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 10px 0 20px;
		/* border-bottom: 1px solid ${(props) => props.theme.sidebarHover}; */

		.tag-list {
			display: flex;
			color: ${(props) => props.theme.bg1};
			font-size: 14px;
			width: 100%;

			ul {
				list-style: none;
				width: 100%;

				li {
					height: 29px;
					padding: 2px 2px 4px 14px;
					cursor: pointer;
					width: 100%;
					display: flex;
					align-items: center;
					transition: background-color 0.3s ease;
					font-size: 13px;

					:hover {
						background-color: ${(props) => props.theme.sidebarHover};
					}

					span {
						display: inline-block;
						margin-right: 6px;
						width: 10px;
						height: 10px;
						border-radius: 50%;
					}
				}

				li.selected {
					background-color: ${(props) => props.theme.sidebarSelected};
				}
			}
		}

		.tree-title {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;

			span {
				display: flex;
				align-items: center;
			}

			.title-group {
				display: flex;
			}

			h1 {
				color: ${(props) => props.theme.bg1};
				/* text-transform: uppercase; */
				padding: 10px;
				font-weight: 500;
				letter-spacing: 1px;
				font-size: 14px;
			}
		}
	}

	.tags {
		flex-direction: column;
		align-items: start;
		padding: 0;

		.tree-title {
			padding-left: 16px;
			padding-right: 10px;
		}

		h1 {
			padding-left: 16px;
		}

		li {
			padding-left: 30px !important;
		}
	}
`;
