import { useState } from "react";
import Input from "../Input";
import Button from "../Button";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../Context/AuthContext";
import { toast } from "react-toastify";

const initialState = {
	email: { value: "", danger: false },
	password: { value: "", danger: false },
};

const LoginContent = () => {
	const [loginState, setLoginState] = useState(initialState);
	const { loginUser } = useAuthContext();

	const handleKeypress = (e) => {
		const name = e.target.name;
		const value = e.target.value;

		const tempState = { ...loginState, [name]: { value, danger: false } };
		setLoginState(tempState);
	};

	const handleClick = async (e) => {
		e.preventDefault();
		const { email, password } = loginState;
		if (!email.value || !password.value) {
			const tempState = { ...loginState };
			Object.keys(tempState).forEach((item) => {
				if (tempState[item].value === "") tempState[item].danger = true;
			});
			setLoginState(tempState);
			toast.warn("Please fill all fields");
			return;
		}

		const credentials = {
			email: loginState.email.value,
			password: loginState.password.value,
		};

		await loginUser(credentials);
	};

	return (
		<StyledLoginContent>
			<h1>Login</h1>
			<form>
				<Input
					placeholder="Email"
					value={loginState.email.value}
					action={handleKeypress}
					name="email"
					type="text"
					danger={loginState.email.danger}
				/>
				<Input
					placeholder="Password"
					value={loginState.password.value}
					action={handleKeypress}
					name="password"
					type="password"
					danger={loginState.password.danger}
				/>
				<Button variant="full" action={handleClick}>
					Login
				</Button>
			</form>
			<p>
				Don't you have an account? <Link to="/register">Join Notedock</Link>
			</p>
		</StyledLoginContent>
	);
};

const StyledLoginContent = styled.div`
	h1 {
		font-size: 30px;
		margin-bottom: 20px;
		text-align: center;
	}

	p {
		margin-top: 20px;
		font-size: 14px;
		a {
			text-decoration: none;
			color: ${(props) => props.theme.primary};
		}
	}
`;

export default LoginContent;
