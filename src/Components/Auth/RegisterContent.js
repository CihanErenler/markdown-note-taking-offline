import { useState } from "react";
import Input from "../Input";
import Button from "../Button";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { defaultState } from "./defaultState";

const initialState = {
	name: { value: "", danger: false },
	lastname: { value: "", danger: false },
	email: { value: "", danger: false },
	password: { value: "", danger: false },
};

const RegisterContent = () => {
	const [registerState, setRegisterState] = useState(initialState);
	const navigate = useNavigate();
	const { createUser } = useAuthContext();

	const handleKeypress = (e) => {
		const name = e.target.name;
		const value = e.target.value;

		const tempState = { ...registerState, [name]: { value, danger: false } };
		setRegisterState(tempState);
	};

	const handleClick = async (e) => {
		e.preventDefault();
		const { name, lastname, email, password } = registerState;
		if (!name.value || !lastname.value || !email.value || !password.value) {
			const tempState = { ...registerState };
			Object.keys(tempState).forEach((item) => {
				if (tempState[item].value === "") tempState[item].danger = true;
			});
			setRegisterState(tempState);
			toast.warn("Please fill all fields");
			return;
		}

		const user = {
			name: registerState.name.value,
			lastname: registerState.lastname.value,
			email: registerState.email.value,
			password: registerState.password.value,
			data: defaultState,
		};
		const response = await createUser(user);
		if (response.status === 200) {
			navigate("/login");
		}
	};

	return (
		<StyledRegisterContent>
			<form>
				<h1>Sign up</h1>
				<Input
					placeholder="Name"
					value={registerState.name.value}
					action={handleKeypress}
					name="name"
					danger={registerState.name.danger}
					type="text"
				/>
				<Input
					placeholder="Lastname"
					value={registerState.lastname.value}
					action={handleKeypress}
					name="lastname"
					danger={registerState.lastname.danger}
					type="text"
				/>
				<Input
					placeholder="Email"
					value={registerState.email.value}
					action={handleKeypress}
					name="email"
					danger={registerState.email.danger}
					type="text"
				/>
				<Input
					placeholder="Password"
					value={registerState.password.value}
					action={handleKeypress}
					name="password"
					danger={registerState.password.danger}
					type="password"
				/>
				<Button variant="full" action={handleClick}>
					Sign up
				</Button>
			</form>
			<p>
				Already have an account? <Link to="/login">Sign in</Link>
			</p>
		</StyledRegisterContent>
	);
};

const StyledRegisterContent = styled.div`
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

export default RegisterContent;
