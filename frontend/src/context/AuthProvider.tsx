import { useEffect, useState, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import type { UserType } from "./AuthContext";
import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { message } from "antd";

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserType | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    try {
      if (storedUser && storedUser !== "undefined") {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      localStorage.removeItem("user");
    }
  }, []);

  const login = useCallback((token: string, userData: UserType) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (location.pathname !== "/") navigate("/");
    message.success("Has cerrado la sesión, ¡Nos vemos pronto!");
    setUser(null);
  }, [navigate, location.pathname]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
