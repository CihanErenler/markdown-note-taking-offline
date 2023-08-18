import React from "react";
import styled from "styled-components";
import about from "../Assets/images/about.png";
import Button from "../Components/Button";
import { useNavigate } from "react-router";

const AboutPage = () => {
	const navigate = useNavigate();

	const handleClick = (type) => {
		if (type === "notes") {
			navigate("/notes");
			return;
		}
	};
	return (
		<StyledAboutPage>
			<div className="container">
				<div>
					<h1>Welcome to NoteDock, the premier markdown note taking app!</h1>
					<p>
						We know how important it is to stay organized and informed in a
						digital world. That's why we created NoteDock – a modern, efficient,
						and secure note taking app designed specifically for taking notes in
						Markdown.
					</p>
					<p>
						With NoteDock, you can easily keep your notes in sync across all
						your devices. Our intuitive interface allows you to quickly and
						easily create, edit, and manage your notes. Plus, our powerful
						search feature makes finding the right note a snap.
					</p>
					<p>
						Whether you're a student, business professional, or just someone who
						needs to stay organized, you'll love the simplicity and convenience
						of NoteDock. So if you need an efficient and secure note taking app,
						try NoteDock today!
					</p>
					<Button width="200px" action={() => handleClick("notes")}>
						Start taking notes
					</Button>
				</div>
				<div>
					<img src={about} alt="about page" />
				</div>
			</div>
		</StyledAboutPage>
	);
};

const StyledAboutPage = styled.section`
	.container {
		width: 100%;
		height: calc(100vh - 60px);
		padding: 20px 100px;
		margin: auto;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		align-items: center;

		h1 {
			font-size: 48px;
			width: 90%;
			line-height: 1.2;
			font-weight: 900;
			margin-bottom: 30px;

			@media (max-width: 1499px) {
				font-size: 38px;
			}
		}

		p {
			width: 90%;
			margin-bottom: 20px;
			font-size: 16px;
			color: ${(props) => props.theme.textColorLight};
			line-height: 1.8;

			@media (max-width: 1499px) {
				font-size: 14px;
			}
		}

		img {
			display: block;
			margin: auto;
		}
	}
`;

export default AboutPage;
