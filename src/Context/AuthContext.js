import React, { useReducer, useContext } from "react";
import reducer from "../Reducers/AuthReducer";
import { toast } from "react-toastify";
import { db } from "../db/db";
import {
  USER_LOGGED_IN,
  SET_LOCALSTORAGE,
  USER_LOADING,
  HANDLE_SPINNER,
  REMOVE_USER_FROM_LOCALSTORAGE,
} from "../Reducers/AuthReducer";

const AuthContext = React.createContext();

const inititalState = {
  userLoggedIn: false,
  user: null,
  isUserLoading: false,
  showRootSpinner: true,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, inititalState);

  const createUser = async (user) => {
    try {
      const response = await db.post("/user/register", user);
      if (response.status === 200) {
        toast.success("New user created. Time to login!");
      }
      return response;
    } catch (error) {
      if (error.response.status === 400) {
        toast.error(error.response.data.message);
        return;
      }
      toast.error("Something went wrong");
    }
  };

  const loginUser = async (user) => {
    try {
      const response = await db.post("/user/login", user);
      if (response.status === 200) {
        dispatch({ type: USER_LOGGED_IN, payload: response.data.user });
        dispatch({ type: SET_LOCALSTORAGE, payload: response.data.user });
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        toast.error(error.response.data.message);
        return;
      }
      toast.error("Something went wrong");
    }
  };

  const removeUserFromLocalStorage = () => {
    localStorage.removeItem("user");
    dispatch({ type: REMOVE_USER_FROM_LOCALSTORAGE });
    toast.success("Logged out successfully!");
  };

  const getUserFromLocalStorage = () => {
    dispatch({ type: USER_LOADING, payload: true });
    if (localStorage.getItem("user")) {
      const user = JSON.parse(localStorage.getItem("user"));
      dispatch({ type: USER_LOGGED_IN, payload: user });
    }
    dispatch({ type: USER_LOADING, payload: false });
  };

  const handleRootSpinner = () => {
    dispatch({ type: HANDLE_SPINNER });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        createUser,
        loginUser,
        removeUserFromLocalStorage,
        getUserFromLocalStorage,
        handleRootSpinner,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
