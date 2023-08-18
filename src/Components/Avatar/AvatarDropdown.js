import { useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import NameAndAvatar from "./NameAndAvatar";
import { FiLogOut } from "react-icons/fi";
import { useAuthContext } from "../../Context/AuthContext";

const AvatarDropdown = ({
	name,
	lastname,
	email,
	setShowAvatarDropdown,
	showAvatarDropdown,
	wrapper,
}) => {
	const { removeUserFromLocalStorage } = useAuthContext();
	const ref = useRef(null);

	const handleClick = useCallback(
		(e) => {
			if (
				ref.current &&
				!ref.current.contains(e.target) &&
				wrapper.current !== e.target
			) {
				setShowAvatarDropdown(false);
			}
		},
		[setShowAvatarDropdown, wrapper]
	);

	const handleKeyPress = useCallback(() => {
		if (showAvatarDropdown) {
			setShowAvatarDropdown(false);
		}
	}, [setShowAvatarDropdown, showAvatarDropdown]);

	useEffect(() => {
		document.addEventListener("click", handleClick);
		document.addEventListener("keydown", handleKeyPress);

		return () => {
			// eslint-disable-next-line react-hooks/exhaustive-deps
			document.removeEventListener("click", handleClick);
			document.removeEventListener("keydown", handleKeyPress);
		};
	}, [handleClick, handleKeyPress]);

	const handleLogout = () => {
		removeUserFromLocalStorage();
		setShowAvatarDropdown(false);
	};

	return (
		<StyledAvatarDropdown ref={ref}>
			<ul className="avatar-list">
				<li className="avatar-list-item">
					<NameAndAvatar name={name} lastname={lastname} email={email} />
				</li>
				<li className="avatar-list-item">
					<div className="logout" onClick={handleLogout}>
						<FiLogOut /> Logout
					</div>
				</li>
			</ul>
		</StyledAvatarDropdown>
	);
};

const StyledAvatarDropdown = styled.section`
	position: absolute;
	top: 26px;
	right: -10px;
	background-color: ${(props) => props.theme.bg1};
	border-radius: 6px;
	z-index: 999;
	box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
	animation: fade-in 0.3s ease;
	transform-origin: top right;
	width: fit-content;

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

	.avatar-list {
		list-style: none;

		.avatar-list-item {
			padding: 10px 20px;
			border-bottom: 1px solid ${(props) => props.theme.borderLight};

			:last-child {
				border-bottom: none;
			}
		}

		.logout {
			font-size: 14px;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			transition: color 0.3s ease;

			:hover {
				color: ${(props) => props.theme.primary};
			}

			svg {
				margin-right: 4px;
			}
		}
	}
`;

export default AvatarDropdown;
