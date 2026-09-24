"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getToken, getUser, setToken, setUser, clearToken, clearUser } from "../lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUserState(getUser());
    setLoggedIn(!!getToken());
    setReady(true);
  }, []);

  function loginSuccess(data) {
    const { token, ...user } = data;
    setToken(token);
    setUser(user);
    setUserState(user);
    setLoggedIn(true);
  }

  function logout() {
    clearToken();
    clearUser();
    setUserState(null);
    setLoggedIn(false);
  }

  return (
    <AuthContext.Provider value={{ user, ready, isLoggedIn: loggedIn, loginSuccess, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
