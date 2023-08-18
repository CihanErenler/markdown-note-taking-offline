export const USER_LOGGED_IN = "USER_LOGGED_IN";
export const SET_LOCALSTORAGE = "SET_LOCALSTORAGE";
export const USER_LOADING = "USER_LOADING";
export const HANDLE_SPINNER = "HANDLE_SPINNER";
export const REMOVE_USER_FROM_LOCALSTORAGE = "REMOVE_USER_FROM_LOCALSTORAGE";

const AuthReducer = (state, action) => {
	if (action.type === USER_LOGGED_IN) {
		const { name, lastname, email, token } = action.payload;
		const tempState = {
			...state,
			useLoggedIn: true,
			user: { name, lastname, email, token },
			// data,
		};
		return tempState;
	}

	if (action.type === SET_LOCALSTORAGE) {
		const { name, lastname, email, token } = action.payload;
		localStorage.setItem(
			"user",
			JSON.stringify({ name, lastname, email, token })
		);
	}

	if (action.type === USER_LOADING) {
		const newState = { ...state, isUserLoading: action.payload };
		return newState;
	}

	if (action.type === HANDLE_SPINNER) {
		const newState = { ...state, showRootSpinner: false };
		return newState;
	}

	if (action.type === REMOVE_USER_FROM_LOCALSTORAGE) {
		const newState = { ...state, userLoggedIn: false, user: null };
		return newState;
	}

	return state;
};

export default AuthReducer;
