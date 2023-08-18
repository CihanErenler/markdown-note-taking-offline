import hero from "../Assets/images/hero.svg";
import Button from "../Components/Button";
import styled from "styled-components";
import { useNavigate } from "react-router";
import { useAuthContext } from "../Context/AuthContext";
import heroBg from "../Assets/bg.svg";

const WelcomePage = () => {
	const { user } = useAuthContext();
	const navigate = useNavigate();

	const handleClick = (type) => {
		if (type === "notes") {
			navigate("/notes");
			return;
		}
		navigate("/register");
	};

	return (
		<StyledWelcomePage>
			<img className="bg" src={heroBg} alt="" draggable={false} />
			<div className="container">
				<div className="hero-content">
					<h1>Write down what you think</h1>
					<p>
						NoteDock is a markdown note-taking application that helps you take
						notes quickly. It renders markdown in real-time to give you a
						preview of what you write down.
					</p>

					<div className="button-container">
						{user ? (
							<Button width="200px" action={() => handleClick("notes")}>
								Start taking note
							</Button>
						) : (
							<Button width="200px" action={() => handleClick("register")}>
								Sign up
							</Button>
						)}
					</div>
				</div>

				<img className="hero" src={hero} alt="hero-img" draggable={false} />
			</div>
		</StyledWelcomePage>
	);
};

const StyledWelcomePage = styled.div`
	height: 100%;
	background-color: #0d1117;
	position: relative;
	overflow: hidden;

	.container {
		width: 100%;
		max-width: 1400px;

		padding-top: 40px;
		text-align: center;
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		height: 100%;
		color: #fff;

		.hero-content {
			margin-top: 100px;
			-webkit-user-select: none;
			-ms-user-select: none;
			user-select: none;
		}

		h1 {
			font-size: 55px;
			font-weight: 700;
			padding-bottom: 10px;
			padding-top: 10px;

			@media (max-width: 1499px) {
				font-size: 46px;
			}

			span {
				color: dodgerblue;
			}
		}

		p {
			font-size: 18px;
			max-width: 600px;
			font-weight: 300;
			margin: auto;
			color: #99c1e8;
		}

		.button-container {
			display: flex;
			gap: 20px;
			padding: 20px 0;
			align-items: center;
			justify-content: center;
		}
	}

	.hero {
		position: relative;
		z-index: 99;
		max-width: 100%;
		transform: scale(2);
		border-radius: 20px;
		position: absolute;
		top: 48%;
		left: 50%;
		transform: translateX(-50%);
		display: inline-block;

		@media (max-width: 1200px) {
			bottom: -90px;
		}
	}
`;

export default WelcomePage;
