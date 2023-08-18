import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../Context/AuthContext";

const ProtectedAuthRoute = ({ children }) => {
	const { user } = useAuthContext();
	if (!user) {
		return <Navigate to="/" />;
	}

	return children;
};

export default ProtectedAuthRoute;
