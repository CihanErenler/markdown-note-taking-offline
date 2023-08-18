import React from "react";
import AuthSpinner from "./AuthSpinner";
import { useAuthContext } from "../../Context/AuthContext";

const AuthWrapper = ({ children }) => {
	const { isUserLoading } = useAuthContext();
	if (isUserLoading) {
		return <AuthSpinner />;
	}

	return children;
};

export default AuthWrapper;
