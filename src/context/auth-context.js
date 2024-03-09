import React, { useState } from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculateRemainingTime = () => {
  const currentTime = new Date().getTime();
  const expirationTime = localStorage.getItem("expirationTime");
  const adjExpirationTime = new Date(expirationTime).getTime();
  const remainingDuration = adjExpirationTime - currentTime;
  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const remainingTime = calculateRemainingTime();
  console.log(remainingTime);
  if (remainingTime <= 0) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }
  return storedToken;
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  const [token, setToken] = useState(tokenData);
  const userLoggedIn = !!token;

  const loginHandler = (token) => {
    const expirationTime = new Date(new Date().getTime() + 60 * 1000);
    localStorage.setItem("expirationTime", expirationTime.toISOString());
    localStorage.setItem("token", token);
    setToken(token);
  };
  const logoutHandler = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const contextValue = {
    token,
    isLoggedIn: userLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
